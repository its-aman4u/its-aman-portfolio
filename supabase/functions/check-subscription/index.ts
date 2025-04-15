
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Use the service role key for enhanced permissions
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    // Get Stripe API key from environment
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    logStep("Stripe key verified");

    // Authenticate the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) {
      throw new Error(`Authentication error: ${userError.message}`);
    }
    const user = userData.user;
    if (!user?.email) {
      throw new Error("User not authenticated or email not available");
    }
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check if the user has a Stripe customer account
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No Stripe customer found, updating unsubscribed state");
      
      // Update the subscription record to reflect no active subscription
      await supabaseClient.from("subscriptions").upsert({
        user_id: user.id,
        tier: 'free',
        is_active: true,
        stripe_customer_id: null,
        stripe_subscription_id: null,
        current_period_end: null,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      
      return new Response(JSON.stringify({ 
        subscribed: false,
        tier: 'free',
        current_period_end: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // User has a Stripe customer account
    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    
    // Determine if the user has an active subscription
    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionTier = 'free';
    let currentPeriodEnd = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
      logStep("Active subscription found", { 
        subscriptionId: subscription.id, 
        endDate: currentPeriodEnd 
      });
      
      // Determine subscription tier from metadata if available, otherwise from product/price
      if (subscription.metadata.tier) {
        subscriptionTier = subscription.metadata.tier;
      } else {
        // Default to premium for simplicity in this implementation
        subscriptionTier = 'premium';
      }
      
      logStep("Determined subscription tier", { subscriptionTier });
      
      // Update the subscription record in Supabase
      await supabaseClient.from("subscriptions").upsert({
        user_id: user.id,
        tier: subscriptionTier,
        is_active: true,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
        current_period_end: currentPeriodEnd,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    } else {
      logStep("No active subscription found");
      
      // Update the subscription record to reflect no active premium subscription
      await supabaseClient.from("subscriptions").upsert({
        user_id: user.id,
        tier: 'free',
        is_active: true,
        stripe_customer_id: customerId,
        stripe_subscription_id: null,
        current_period_end: null,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    }

    logStep("Updated database with subscription info", { 
      subscribed: hasActiveSub, 
      subscriptionTier 
    });
    
    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      tier: subscriptionTier,
      current_period_end: currentPeriodEnd
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
