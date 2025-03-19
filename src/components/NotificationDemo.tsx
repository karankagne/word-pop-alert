
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Lightbulb } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface NotificationDemoProps {
  keywords: string[];
}

const NotificationDemo: React.FC<NotificationDemoProps> = ({ keywords }) => {
  const [selectedKeyword, setSelectedKeyword] = useState<string>(keywords[0] || "");
  const [showOverlay, setShowOverlay] = useState(false);
  const [customMessages, setCustomMessages] = useState<{ [key: string]: string }>({});

  // Load custom messages from localStorage
  React.useEffect(() => {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Test Notifications
        </CardTitle>
        <CardDescription>
          Preview how your alert will appear when keywords are detected
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {keywords.length === 0 ? (
          <div className="bg-muted/50 p-4 rounded-lg text-center text-muted-foreground">
            Add keywords to test notifications
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keyword-select">Select a keyword to test</Label>
              <Select
                value={selectedKeyword}
                onValueChange={setSelectedKeyword}
              >
                <SelectTrigger id="keyword-select">
                  <SelectValue placeholder="Select a keyword" />
                </SelectTrigger>
                <SelectContent>
                  {keywords.map((keyword) => (
                    <SelectItem key={keyword} value={keyword}>
                      {keyword}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full" 
              onClick={handleTest}
              disabled={!selectedKeyword}
            >
              Test Full-Screen Alert
            </Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="text-sm text-muted-foreground">
        <p>
          These alerts will appear when the extension detects your keywords
        </p>
      </CardFooter>

      {/* Full-screen notification overlay dialog */}
      <Dialog open={showOverlay} onOpenChange={setShowOverlay}>
        <DialogContent className="max-w-full h-[90vh] sm:max-w-full m-4 p-0 bg-transparent border-0 shadow-none">
          <div className="flex flex-col items-center justify-center w-full h-full bg-black/90 backdrop-blur-md rounded-lg p-6">
            <div className="max-w-2xl w-full bg-background/10 border border-white/10 rounded-2xl p-8 text-center">
              <div className="mb-4 flex justify-center items-center">
                <div className="h-3 w-3 rounded-full bg-primary mr-3 animate-pulse"></div>
                <h2 className="text-2xl font-semibold text-white">WordPop Alert</h2>
              </div>
              
              <h3 className="text-3xl font-bold my-6 text-white">{selectedKeyword}</h3>
              
              <p className="text-xl mb-8 text-white/90">
                {customMessages[selectedKeyword] || `You've spotted "${selectedKeyword}" on this page!`}
              </p>
              
              <Button 
                size="lg"
                onClick={() => setShowOverlay(false)}
                className="bg-primary/80 hover:bg-primary text-white font-medium px-6 py-3 text-lg"
              >
                Continue Browsing
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default NotificationDemo;
