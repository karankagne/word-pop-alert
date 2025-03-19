
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { HeartCrack } from "lucide-react";
import KeywordSelector from "./notifications/KeywordSelector";
import TestAlertButton from "./notifications/TestAlertButton";
import NotificationOverlay from "./notifications/NotificationOverlay";

interface NotificationDemoProps {
  keywords: string[];
}

const NotificationDemo: React.FC<NotificationDemoProps> = ({ keywords }) => {
  const [selectedKeyword, setSelectedKeyword] = useState<string>(keywords[0] || "");
  const [showOverlay, setShowOverlay] = useState(false);
  const [customMessages, setCustomMessages] = useState<{ [key: string]: string }>({});

  // Load custom messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("wordPopCustomMessages");
    if (savedMessages) {
      try {
        setCustomMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error("Error parsing saved custom messages:", error);
      }
    }
  }, []);

  const handleTest = () => {
    if (selectedKeyword) {
      setShowOverlay(true);
    }
  };

  return (
    <Card className="shadow-none border-none">
      <CardHeader className="p-3 pb-2">
        <CardTitle className="text-base flex items-center gap-1">
          <HeartCrack className="h-4 w-4 text-pink-500" />
          Test Alert
        </CardTitle>
        <CardDescription className="text-xs">
          Preview how alerts will appear
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-3 pt-0 space-y-2">
        {keywords.length === 0 ? (
          <div className="bg-muted/50 p-2 rounded-lg text-center text-xs text-muted-foreground">
            Add keywords to test notifications
          </div>
        ) : (
          <div className="space-y-2">
            <KeywordSelector 
              keywords={keywords}
              selectedKeyword={selectedKeyword}
              onKeywordChange={setSelectedKeyword}
            />

            <TestAlertButton 
              onClick={handleTest}
              disabled={!selectedKeyword}
            />
          </div>
        )}
      </CardContent>

      <NotificationOverlay
        open={showOverlay}
        onOpenChange={setShowOverlay}
        selectedKeyword={selectedKeyword}
        customMessage={customMessages[selectedKeyword] || ""}
      />
    </Card>
  );
};

export default NotificationDemo;
