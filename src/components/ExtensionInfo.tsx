
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal, BookOpen, Github } from "lucide-react";

const ExtensionInfo: React.FC = () => {
  return (
    <Card className="w-full animate-slide-in animation-delay-400 subtle-shadow">
      <CardHeader>
        <CardTitle className="text-2xl font-medium">About WordPop</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="about">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="tech">Tech</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="mt-4 space-y-4">
            <p className="text-sm">
              WordPop monitors web pages for your specified keywords and provides elegant notifications 
              when they appear. Perfect for researchers, writers, investors, or anyone who needs to stay 
              alert for specific terms.
            </p>
            
            <Separator />
            
            <div className="text-xs text-muted-foreground flex items-center justify-between">
              <span>Version 1.0.0</span>
              <a 
                href="#" 
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Github className="h-3 w-3" />
                <span>Source Code</span>
              </a>
            </div>
          </TabsContent>
          
          <TabsContent value="usage" className="mt-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-1">
                <Terminal className="h-3 w-3" />
                <span>Getting Started</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                1. Add keywords you want to monitor<br />
                2. Save your keywords<br />
                3. Browse the web normally<br />
                4. Receive elegant notifications when keywords are found
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                <span>Tips</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                • For case-sensitive matches, add keywords exactly as they should appear<br />
                • Use short phrases (1-3 words) for best performance<br />
                • For proper names, add variations (e.g., "John" and "John Smith")
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="tech" className="mt-4 space-y-4">
            <p className="text-sm">
              WordPop is built with modern web technologies and designed with care to provide 
              a beautiful, minimal user experience with maximum functionality.
            </p>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="text-xs border rounded-md p-2">
                <span className="font-medium block">Frontend</span>
                <span className="text-muted-foreground">React + TypeScript</span>
              </div>
              <div className="text-xs border rounded-md p-2">
                <span className="font-medium block">Styling</span>
                <span className="text-muted-foreground">Tailwind CSS</span>
              </div>
              <div className="text-xs border rounded-md p-2">
                <span className="font-medium block">UI Components</span>
                <span className="text-muted-foreground">shadcn/ui</span>
              </div>
              <div className="text-xs border rounded-md p-2">
                <span className="font-medium block">Backend</span>
                <span className="text-muted-foreground">Chrome Extension API</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ExtensionInfo;
