import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { HeartCrack } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
            <div className="space-y-1">
              <Label htmlFor="keyword-select" className="text-xs">Select keyword to test</Label>
              <Select
                value={selectedKeyword}
                onValueChange={setSelectedKeyword}
              >
                <SelectTrigger id="keyword-select" className="h-8 text-xs">
                  <SelectValue placeholder="Select a keyword" />
                </SelectTrigger>
                <SelectContent>
                  {keywords.map((keyword) => (
                    <SelectItem key={keyword} value={keyword} className="text-sm">
                      {keyword}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full h-8 text-sm bg-pink-500 hover:bg-pink-600" 
              onClick={handleTest}
              disabled={!selectedKeyword}
              size="sm"
            >
              Test Alert
            </Button>
          </div>
        )}
      </CardContent>

      {/* Full-screen notification overlay dialog */}
      <Dialog open={showOverlay} onOpenChange={setShowOverlay}>
        <DialogContent className="max-w-[90vw] h-auto max-h-[80vh] p-0 bg-transparent border-0 shadow-none">
          <div className="flex flex-col items-center justify-center w-full h-full bg-black/90 backdrop-blur-md rounded-lg p-4">
            <div className="w-full bg-background/10 border border-white/10 rounded-xl p-4 text-center">
              <div className="mb-2 flex justify-center items-center">
                <div className="h-2 w-2 rounded-full bg-pink-500 mr-2 animate-pulse"></div>
                <h2 className="text-lg font-semibold text-white">Breakup Buddy</h2>
              </div>
              
              <h3 className="text-xl font-bold my-3 text-white">{selectedKeyword}</h3>
              
              <p className="text-sm mb-4 text-white/90">
                {customMessages[selectedKeyword] || `Remember: focusing on "${selectedKeyword}" right now might not help your healing process.`}
              </p>
              
              <div className="flex flex-col gap-2 w-full max-w-xs mx-auto">
                <Button 
                  onClick={() => setShowOverlay(false)}
                  className="bg-pink-500/80 hover:bg-pink-500 text-white text-sm"
                  size="sm"
                >
                  Continue Anyway
                </Button>
                <Button 
                  onClick={() => setShowOverlay(false)}
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-sm"
                  size="sm"
                >
                  Leave This Page
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default NotificationDemo;
