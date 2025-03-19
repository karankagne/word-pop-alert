
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { X, Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface KeywordManagerProps {
  keywords: string[];
  setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
}

const KeywordManager: React.FC<KeywordManagerProps> = ({ keywords, setKeywords }) => {
  const [newKeyword, setNewKeyword] = useState("");
  const { toast } = useToast();

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    
    if (keywords.includes(newKeyword.trim())) {
      toast({
        title: "Keyword already exists",
        description: `"${newKeyword.trim()}" is already in your list.`,
        variant: "destructive",
      });
      return;
    }
    
    setKeywords([...keywords, newKeyword.trim()]);
    setNewKeyword("");
    
    toast({
      title: "Keyword added",
      description: `"${newKeyword.trim()}" added to monitoring list.`,
    });
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
    
    toast({
      title: "Keyword removed",
      description: `"${keyword}" removed from monitoring list.`,
    });
  };

  const handleSaveKeywords = () => {
    // In a real extension, this would save to chrome.storage.sync
    localStorage.setItem("wordPopKeywords", JSON.stringify(keywords));
    
    toast({
      title: "Keywords saved",
      description: `${keywords.length} keywords saved successfully.`,
    });
  };

  return (
    <Card className="w-full animate-slide-in subtle-shadow">
      <CardHeader>
        <CardTitle className="text-2xl font-medium">Keyword Manager</CardTitle>
        <CardDescription>
          Add words or phrases you want to monitor for on web pages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-6">
          <Input
            placeholder="Enter keyword or phrase..."
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddKeyword()}
            className="flex-1"
          />
          <Button onClick={handleAddKeyword} size="icon" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <Separator className="my-4" />
        
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-3 text-muted-foreground">Active Keywords</h3>
          {keywords.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No keywords added yet. Add your first keyword above.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2 mt-2">
              {keywords.map((keyword) => (
                <Badge 
                  key={keyword} 
                  variant="secondary"
                  className="px-3 py-1.5 flex items-center gap-1 animate-scale-in"
                >
                  {keyword}
                  <button 
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveKeywords} 
          className="w-full flex items-center gap-2"
          disabled={keywords.length === 0}
        >
          <Save className="h-4 w-4" />
          Save Keywords
        </Button>
      </CardFooter>
    </Card>
  );
};

export default KeywordManager;
