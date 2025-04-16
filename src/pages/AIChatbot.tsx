
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Send, Bot, User, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const AIChatbot = () => {
  const { isAuthenticated, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to access the AI Chatbot");
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  // Initial welcome message
  useEffect(() => {
    const initialMessage = profile?.is_admin
      ? "Welcome to the Admin AI Assistant! I can help you generate blog content, answer questions, and more. How can I assist you today?"
      : "Hello! I'm your AI assistant. Feel free to ask me any questions about Aman Singh's portfolio, projects, or any other topics you're curious about!";

    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: initialMessage,
        timestamp: new Date(),
      },
    ]);
  }, [profile]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user" as const,
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call Gemini Edge Function
      const { data, error } = await supabase.functions.invoke("gemini-content", {
        body: { prompt: createPrompt(input, profile?.is_admin || false) },
      });

      if (error) throw new Error(error.message);

      const botResponse = {
        id: `assistant-${Date.now()}`,
        role: "assistant" as const,
        content: data.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error calling AI:", error);
      toast.error("Failed to get AI response");
      
      const errorMessage = {
        id: `assistant-error-${Date.now()}`,
        role: "assistant" as const,
        content: "Sorry, I encountered an error processing your request. Please try again later.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const createPrompt = (userInput: string, isAdmin: boolean) => {
    if (isAdmin) {
      return `You are an AI assistant for Aman Singh's portfolio website admin. ${userInput}
      
      If the admin is asking for blog content, provide well-structured content with markdown formatting including headers, bullet points, etc. If the admin asks for SEO suggestions, give them detailed advice tailored to the portfolio website.`;
    } else {
      return `You are an AI assistant on Aman Singh's portfolio website. Answer the following question from a visitor: ${userInput}
      
      Keep your answers friendly, helpful and related to Aman Singh's portfolio, skills, projects, or general information. If you don't know the answer, be honest about it.`;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Lock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-4">
              Please login to access the AI Chatbot
            </p>
            <Button onClick={() => navigate("/auth")}>Login Now</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-20 px-4 max-w-4xl">
      <Card className="min-h-[70vh] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            {profile?.is_admin ? "Admin AI Assistant" : "AI Chatbot"}
          </CardTitle>
          {profile?.is_admin && (
            <p className="text-sm text-muted-foreground">
              Admin mode: I can help generate blog content and provide advanced assistance
            </p>
          )}
          <Separator />
        </CardHeader>
        
        <CardContent className="flex-grow overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                <div className="flex gap-3 max-w-[80%]">
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        AI
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <div
                      className={`rounded-lg p-4 ${
                        message.role === "assistant"
                          ? "bg-muted"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {message.content.split("\n").map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          {i < message.content.split("\n").length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                      {profile?.avatar_url && (
                        <AvatarImage src={profile.avatar_url} />
                      )}
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        <CardFooter className="border-t p-4">
          <form onSubmit={handleSendMessage} className="w-full flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-grow"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AIChatbot;
