
import React, { useState, useEffect } from "react";
import KeywordManager from "@/components/KeywordManager";
import NotificationDemo from "@/components/NotificationDemo";
import ExtensionInfo from "@/components/ExtensionInfo";
import { Separator } from "@/components/ui/separator";
import { HeartCrack } from "lucide-react";

const Index = () => {
  const [keywords, setKeywords] = useState<string[]>([]);

  // Load saved keywords on component mount
  useEffect(() => {
    const savedKeywords = localStorage.getItem("wordPopKeywords");
    if (savedKeywords) {
      try {
        setKeywords(JSON.parse(savedKeywords));
      } catch (error) {
        console.error("Error parsing saved keywords:", error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto max-w-4xl">
        <header className="mb-8 text-center">
          <div className="inline-block mb-2">
            <span className="text-xs font-medium bg-pink-500/10 text-pink-500 px-3 py-1 rounded-full">
              Breakup Support Tool
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-3 flex items-center justify-center gap-3">
            <HeartCrack className="h-8 w-8 text-pink-500" />
            <span>Breakup <span className="text-pink-500">Buddy</span></span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Helps you avoid content about your ex during the healing process
          </p>
        </header>

        <Separator className="my-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 space-y-6">
            <KeywordManager keywords={keywords} setKeywords={setKeywords} />
          </div>
          
          <div className="md:col-span-5 space-y-6">
            <NotificationDemo keywords={keywords} />
            <ExtensionInfo />
          </div>
        </div>

        <Separator className="my-8" />
        
        <footer className="text-center text-sm text-muted-foreground pb-8">
          <p>&copy; {new Date().getFullYear()} Breakup Buddy. All rights reserved.</p>
          <p className="text-xs mt-1">Remember, healing takes time.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
