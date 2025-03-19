
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Keywords
          <Badge className="ml-2 bg-primary/20 text-primary" variant="secondary">
            {keywords.length}
          </Badge>
        </CardTitle>
        <CardDescription>
          Add keywords you want to be notified about when they appear on websites
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Enter a keyword..."
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
          />
          <Button onClick={handleAddKeyword} size="icon">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2 mt-4">
          {keywords.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No keywords added yet
            </div>
          ) : (
            keywords.map((keyword) => (
              <div 
                key={keyword} 
                className="flex items-center justify-between p-3 rounded-lg border group hover:bg-accent/50"
              >
                {editingKeyword === keyword ? (
                  <Input
                    value={editingKeyword}
                    onChange={(e) => setEditingKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateKeyword(keyword)}
                    autoFocus
                    className="flex-1 mr-2"
                  />
                ) : (
                  <span className="font-medium">{keyword}</span>
                )}
                
                <div className="flex items-center space-x-1">
                  {editingKeyword === keyword ? (
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => handleUpdateKeyword(keyword)}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  ) : (
                    <>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => openMessageDialog(keyword)}
                        title="Edit custom message"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => setEditingKeyword(keyword)}
                        title="Edit keyword"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove "{keyword}" from your keywords list.
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
      
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <p>Click on <MessageSquare className="inline h-3 w-3" /> to customize alert messages</p>
      </CardFooter>

      {/* Custom Message Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customize Alert Message</DialogTitle>
            <DialogDescription>
              This message will be shown when "{selectedKeyword}" is detected
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="custom-message">Alert Message</Label>
              <Textarea
                id="custom-message"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={4}
                placeholder="Enter your custom alert message..."
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
