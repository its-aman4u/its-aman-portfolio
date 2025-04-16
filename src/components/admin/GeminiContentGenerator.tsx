
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { LucideSparkles, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GeminiContentGeneratorProps {
  onInsertContent?: (content: string) => void;
}

const GeminiContentGenerator: React.FC<GeminiContentGeneratorProps> = ({ onInsertContent }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setGeneratedContent('');

    try {
      const { data, error } = await supabase.functions.invoke('gemini-content', {
        body: { prompt }
      });

      if (error) throw error;
      setGeneratedContent(data.content);
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast.success('Content copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    if (onInsertContent) {
      onInsertContent(generatedContent);
      toast.success('Content inserted into editor');
    }
  };

  const promptExamples = [
    "Generate a blog post about the latest trends in React development for 2025",
    "Write an SEO-optimized article about responsive web design best practices",
    "Create a detailed tutorial on using TypeScript with React",
    "Draft a blog post about the benefits of server-side rendering in modern web applications",
    "Write a technical explanation of the MERN stack for beginners"
  ];

  const insertPrompt = (example: string) => {
    setPrompt(example);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LucideSparkles className="h-5 w-5 text-primary" />
          AI Content Generator
        </CardTitle>
        <CardDescription>
          Generate blog content using Gemini AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generate">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="prompt" className="text-sm font-medium">Your Prompt:</label>
              <Textarea 
                id="prompt"
                placeholder="Describe what kind of content you want to generate..." 
                className="min-h-[100px]"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={handleGenerate} 
              className="w-full"
              disabled={isLoading || !prompt}
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  <LucideSparkles className="mr-2 h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>
            
            {generatedContent && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Generated Content:</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCopy}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    {onInsertContent && (
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={handleInsert}
                      >
                        Insert
                      </Button>
                    )}
                  </div>
                </div>
                <div className="bg-muted/50 border rounded-md p-4 max-h-[300px] overflow-y-auto whitespace-pre-line text-sm">
                  {generatedContent}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="examples" className="mt-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium mb-2">Prompt Examples:</h3>
              <div className="grid gap-2">
                {promptExamples.map((example, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="justify-start h-auto py-2 px-3 text-left"
                    onClick={() => insertPrompt(example)}
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
            
            <Alert className="mt-4">
              <AlertDescription className="text-xs text-muted-foreground">
                Click on any example to use it as your prompt. You can then modify it to fit your specific needs.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground border-t pt-4">
        Powered by Google Gemini AI
      </CardFooter>
    </Card>
  );
};

export default GeminiContentGenerator;
