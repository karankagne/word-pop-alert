import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AvoidanceMessageSetting = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Load saved avoidance message
    const savedMessage = localStorage.getItem("wordPopAvoidanceMessage");
    if (savedMessage) {
      setMessage(savedMessage);
    } else {
      // Set default message if none exists
      const defaultMessage = "Remember why you're here. Take a deep breath and focus on yourself.";
      setMessage(defaultMessage);
      localStorage.setItem("wordPopAvoidanceMessage", defaultMessage);
    }
  }, []);

  const handleSaveMessage = () => {
    // Save the message to localStorage
    localStorage.setItem("wordPopAvoidanceMessage", message);
    
    // Show success toast
    toast.success("Personal message saved");
  };

  return (
    <Card className="shadow-none border-none">
      <CardHeader className="p-3 pb-2">
        <CardTitle className="text-base">Your Avoidance Message</CardTitle>
        <CardDescription className="text-xs">
          Shown when a filtered keyword is detected
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="space-y-2">
          <Textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter a personal message..."
            className="min-h-[80px] text-sm"
          />
          <Button 
            onClick={handleSaveMessage}
            className="w-full h-8 text-sm"
            size="sm"
          >
            Save Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvoidanceMessageSetting;
