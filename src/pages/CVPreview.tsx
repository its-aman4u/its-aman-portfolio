import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

const CVPreview = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get("type");
  
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [pdfName, setPdfName] = useState<string>("");

  useEffect(() => {
    if (type === "fullstack") {
      setPdfUrl("/premium_fullstack_uiux.pdf");
      setPdfName("Aman_Singh_Fullstack_Engineer.pdf");
    } else {
      setPdfUrl("/ai_automation_architect_master.pdf");
      setPdfName("Aman_Singh_AI_Systems_Architect.pdf");
    }
  }, [type]);

  if (!pdfUrl) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cycle-light to-muted dark:from-cycle-dark dark:to-background -z-10"></div>
      
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {type === "fullstack" ? "Premium Full-Stack Developer CV" : "AI-Native Systems Architect CV"}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              View Aman Singh's professional background and verified accomplishments.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="glass-button border-white/20 flex-1 sm:flex-none" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button 
              className="bg-primary text-white hover:bg-primary/95 flex-1 sm:flex-none" 
              asChild
            >
              <a href={pdfUrl} download={pdfName}>
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </a>
            </Button>
          </div>
        </div>

        <Card className="glass-panel overflow-hidden border border-white/20 rounded-xl shadow-2xl bg-black/5 dark:bg-white/5 w-full h-[80vh] min-h-[600px] relative">
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4"></div>
              <p className="text-muted-foreground text-sm font-medium">Loading PDF viewer...</p>
            </div>
          </div>
          <iframe 
            src={`${pdfUrl}#view=FitH`} 
            className="w-full h-full border-0 rounded-xl bg-white" 
            title="CV Preview"
            style={{ display: "block" }}
          />
        </Card>
      </div>
    </div>
  );
};

export default CVPreview;
