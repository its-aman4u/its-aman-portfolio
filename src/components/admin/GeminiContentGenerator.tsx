
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { Loader2, Sparkles } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface GeminiContentGeneratorProps {
  onContentGenerated: (content: { title: string; excerpt: string; content: string }) => void;
  // Add the new prop
  onInsertContent?: (content: string) => void;
}

const GeminiContentGenerator: React.FC<GeminiContentGeneratorProps> = ({ onContentGenerated, onInsertContent }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateContent = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to generate content');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gemini-content', {
        body: { 
          prompt: `Generate a blog post with the following details:
            1. An engaging title related to "${prompt}"
            2. A short excerpt (2-3 sentences) that summarizes the post
            3. The full content of the blog post (at least 300 words)
            
            Format your response as a JSON object with these properties: 
            {
              "title": "The Title",
              "excerpt": "The excerpt...",
              "content": "The full content..."
            }` 
        }
      });

      if (error) throw error;

      let parsedContent;
      try {
        // First try to extract JSON if it's embedded in the response
        const jsonMatch = data.content.match(/```json\s*({[\s\S]*?})\s*```/) || 
                         data.content.match(/{[\s\S]*?}/);
                         
        const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : data.content;
        parsedContent = JSON.parse(jsonString);
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        throw new Error('Failed to parse generated content');
      }

      if (!parsedContent.title || !parsedContent.excerpt || !parsedContent.content) {
        throw new Error('Generated content is missing required fields');
      }

      onContentGenerated({
        title: parsedContent.title,
        excerpt: parsedContent.excerpt,
        content: parsedContent.content
      });
      
      // Also call onInsertContent if it exists and the user wants to insert just the content
      if (onInsertContent) {
        onInsertContent(parsedContent.content);
      }
      
      toast.success('Content generated successfully');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          AI Content Generator
        </CardTitle>
        <CardDescription>
          Describe the blog post you want to create and let AI generate content for you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Textarea
              placeholder="Describe the topic of your blog post... (e.g., 'Write about the future of React development')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerateContent} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Content...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Content
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GeminiContentGenerator;
