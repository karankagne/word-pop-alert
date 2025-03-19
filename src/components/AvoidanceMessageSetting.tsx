
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AvoidanceMessageSetting = () => {
  const [message, setMessage] = useState("");
  const { toast } = useToast();

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
    toast({
      title: "Message saved",
      description: "Your personal avoidance message has been updated.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Avoidance Message</CardTitle>
        <CardDescription>
          This message will appear when you visit a page containing your specified keywords.
          Make it personal and effective for your healing journey.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter a personal message to help you avoid temptation..."
            className="min-h-[120px]"
          />
          <Button 
            onClick={handleSaveMessage}
            className="w-full"
          >
            Save Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvoidanceMessageSetting;
