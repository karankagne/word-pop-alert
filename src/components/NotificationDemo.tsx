
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";
import WordPopNotification from "./WordPopNotification";

interface NotificationDemoProps {
  keywords: string[];
}

const NotificationDemo: React.FC<NotificationDemoProps> = ({ keywords }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [demoKeyword, setDemoKeyword] = useState("");

  const handleShowDemo = () => {
    if (keywords.length === 0) return;
    
    // Choose a random keyword from the list
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    setDemoKeyword(randomKeyword);
    setShowNotification(true);
    
    // Auto-hide notification after 4 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 4000);
  };

  return (
    <>
      <Card className="w-full animate-slide-in animation-delay-200 subtle-shadow">
        <CardHeader>
          <CardTitle className="text-2xl font-medium">Preview Notification</CardTitle>
          <CardDescription>
            See how notifications will appear when keywords are detected
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleShowDemo} 
            className="w-full flex items-center gap-2"
            disabled={keywords.length === 0}
            variant="secondary"
          >
            <Bell className="h-4 w-4" />
            Show Demo Notification
          </Button>
          
          <Separator className="my-4" />
          
          <p className="text-sm text-muted-foreground mt-4">
            {keywords.length === 0 
              ? "Add keywords in the keyword manager to enable the demo preview."
              : "Click the button above to preview how notifications will appear when one of your keywords is detected on a webpage."}
          </p>
        </CardContent>
      </Card>

      {showNotification && demoKeyword && (
        <WordPopNotification 
          keyword={demoKeyword} 
          context="Detected in the page content"
        />
      )}
    </>
  );
};

export default NotificationDemo;
