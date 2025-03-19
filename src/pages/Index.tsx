
import React, { useState, useEffect } from "react";
import KeywordManager from "@/components/KeywordManager";
import NotificationDemo from "@/components/NotificationDemo";
import ExtensionInfo from "@/components/ExtensionInfo";
import AvoidanceMessageSetting from "@/components/AvoidanceMessageSetting";
import { Separator } from "@/components/ui/separator";
import { HeartCrack } from "lucide-react";
import { KeywordProvider } from "@/contexts/KeywordContext";

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
    <KeywordProvider>
      <div className="bg-background">
        <div className="px-4 py-4 mx-auto">
          <header className="mb-4 text-center">
            <h1 className="text-2xl font-medium tracking-tight mb-1 flex items-center justify-center gap-2">
              <HeartCrack className="h-5 w-5 text-pink-500" />
              <span>Breakup <span className="text-pink-500">Buddy</span></span>
            </h1>
            <p className="text-xs text-muted-foreground">
              Helps you avoid content about your ex
            </p>
          </header>

          <Separator className="my-4" />
          
          <div className="space-y-4">
            <KeywordManager keywords={keywords} setKeywords={setKeywords} />
            <AvoidanceMessageSetting />
            <NotificationDemo keywords={keywords} />
          </div>

          <Separator className="my-4" />
          
          <footer className="text-center text-xs text-muted-foreground">
            <p>Remember, healing takes time.</p>
          </footer>
        </div>
      </div>
    </KeywordProvider>
  );
};

export default Index;
