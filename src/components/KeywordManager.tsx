import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, X, MessageSquare, Edit, Save, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface KeywordManagerProps {
  keywords: string[];
  setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
}

const KeywordManager: React.FC<KeywordManagerProps> = ({ keywords, setKeywords }) => {
  const [newKeyword, setNewKeyword] = useState("");
  const [editingKeyword, setEditingKeyword] = useState<string | null>(null);
  const [customMessages, setCustomMessages] = useState<{ [key: string]: string }>({});
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [customMessage, setCustomMessage] = useState("");

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

  // Save custom messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("wordPopCustomMessages", JSON.stringify(customMessages));
  }, [customMessages]);

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    
    // Check if keyword already exists
    if (keywords.includes(newKeyword.trim())) {
      toast.error("This keyword already exists!");
      return;
    }
    
    const updatedKeywords = [...keywords, newKeyword.trim()];
    setKeywords(updatedKeywords);
    
    // Initialize custom message for new keyword
    setCustomMessages(prev => ({
      ...prev,
      [newKeyword.trim()]: `You've spotted "${newKeyword.trim()}" on this page!`
    }));
    
    // Save to localStorage
    localStorage.setItem("wordPopKeywords", JSON.stringify(updatedKeywords));
    
    setNewKeyword("");
    toast.success("Keyword added successfully!");
  };

  const handleRemoveKeyword = (keyword: string) => {
    const updatedKeywords = keywords.filter(k => k !== keyword);
    setKeywords(updatedKeywords);
    
    // Remove custom message for this keyword
    const updatedMessages = { ...customMessages };
    delete updatedMessages[keyword];
    setCustomMessages(updatedMessages);
    
    // Save to localStorage
    localStorage.setItem("wordPopKeywords", JSON.stringify(updatedKeywords));
    
    toast.success("Keyword removed!");
  };

  const handleUpdateKeyword = (oldKeyword: string) => {
    if (!editingKeyword || !editingKeyword.trim()) {
      setEditingKeyword(null);
      return;
    }

    // Check if new keyword already exists (except the one being edited)
    if (keywords.some(k => k !== oldKeyword && k === editingKeyword.trim())) {
      toast.error("This keyword already exists!");
      setEditingKeyword(null);
      return;
    }

    const updatedKeywords = keywords.map(k => 
      k === oldKeyword ? editingKeyword.trim() : k
    );
    setKeywords(updatedKeywords);
    
    // Update custom message key
    const updatedMessages = { ...customMessages };
    updatedMessages[editingKeyword.trim()] = customMessages[oldKeyword] || `You've spotted "${editingKeyword.trim()}" on this page!`;
    if (oldKeyword !== editingKeyword.trim()) {
      delete updatedMessages[oldKeyword];
    }
    setCustomMessages(updatedMessages);
    
    // Save to localStorage
    localStorage.setItem("wordPopKeywords", JSON.stringify(updatedKeywords));
    
    setEditingKeyword(null);
    toast.success("Keyword updated!");
  };

  const openMessageDialog = (keyword: string) => {
    setSelectedKeyword(keyword);
    setCustomMessage(customMessages[keyword] || `You've spotted "${keyword}" on this page!`);
    setIsMessageDialogOpen(true);
  };

  const saveCustomMessage = () => {
    if (!selectedKeyword || !customMessage.trim()) return;
    
    setCustomMessages(prev => ({
      ...prev,
      [selectedKeyword]: customMessage.trim()
    }));
    
    setIsMessageDialogOpen(false);
    toast.success("Custom message saved!");
  };

  return (
    <Card className="shadow-none border-none">
      <CardHeader className="p-3 pb-2">
        <CardTitle className="text-base flex items-center">
          Keywords
          <Badge className="ml-2 bg-primary/20 text-primary text-xs" variant="secondary">
            {keywords.length}
          </Badge>
        </CardTitle>
        <CardDescription className="text-xs">
          Add words you want to filter out
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3 p-3 pt-0">
        <div className="flex space-x-1">
          <Input
            placeholder="Enter a keyword..."
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
            className="h-8 text-sm"
          />
          <Button onClick={handleAddKeyword} size="sm" className="px-2">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-1 mt-2 max-h-[180px] overflow-y-auto">
          {keywords.length === 0 ? (
            <div className="text-center py-2 text-xs text-muted-foreground">
              No keywords added yet
            </div>
          ) : (
            keywords.map((keyword) => (
              <div 
                key={keyword} 
                className="flex items-center justify-between p-2 rounded-lg border group hover:bg-accent/50 text-sm"
              >
                {editingKeyword === keyword ? (
                  <Input
                    value={editingKeyword}
                    onChange={(e) => setEditingKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateKeyword(keyword)}
                    autoFocus
                    className="flex-1 mr-1 h-7 text-sm"
                  />
                ) : (
                  <span className="font-medium text-sm">{keyword}</span>
                )}
                
                <div className="flex items-center">
                  {editingKeyword === keyword ? (
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => handleUpdateKeyword(keyword)}
                      className="h-6 w-6"
                    >
                      <Save className="h-3 w-3" />
                    </Button>
                  ) : (
                    <>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => openMessageDialog(keyword)}
                        title="Edit custom message"
                        className="h-6 w-6"
                      >
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => setEditingKeyword(keyword)}
                        title="Edit keyword"
                        className="h-6 w-6"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-destructive hover:text-destructive h-6 w-6"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-[90vw]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove keyword?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove "{keyword}" from your list.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRemoveKeyword(keyword)}>
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="sm:max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Custom Message for "{selectedKeyword}"</DialogTitle>
            <DialogDescription>
              This message will be shown when this keyword is detected.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-3">
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={4}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Enter custom message for this keyword..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveCustomMessage}>Save Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default KeywordManager;
