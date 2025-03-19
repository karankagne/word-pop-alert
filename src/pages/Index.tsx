
import React, { useState, useEffect } from "react";
import KeywordManager from "@/components/KeywordManager";
import NotificationDemo from "@/components/NotificationDemo";
import ExtensionInfo from "@/components/ExtensionInfo";
import { Separator } from "@/components/ui/separator";

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
            <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
              Chrome Extension
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-3">
            Word<span className="text-primary">Pop</span> Alert
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Get elegant, minimal notifications when specific words appear on your screen
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
          <p>&copy; {new Date().getFullYear()} WordPop Alert. All rights reserved.</p>
          <p className="text-xs mt-1">Designed for Chrome and chromium-based browsers.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
