
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Edit, Save, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useKeywords } from "@/contexts/KeywordContext";

interface KeywordItemProps {
  keyword: string;
  onEditMessage: (keyword: string) => void;
}

const KeywordItem: React.FC<KeywordItemProps> = ({ keyword, onEditMessage }) => {
  const { updateKeyword, removeKeyword } = useKeywords();
  const [isEditing, setIsEditing] = useState(false);
  const [editedKeyword, setEditedKeyword] = useState(keyword);

  const handleSave = () => {
    if (updateKeyword(keyword, editedKeyword)) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedKeyword(keyword);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between p-2 rounded-lg border group hover:bg-accent/50 text-sm">
      {isEditing ? (
        <Input
          value={editedKeyword}
          onChange={(e) => setEditedKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          autoFocus
          className="flex-1 mr-1 h-7 text-sm"
        />
      ) : (
        <span className="font-medium text-sm">{keyword}</span>
      )}
      
      <div className="flex items-center">
        {isEditing ? (
          <>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleSave}
              className="h-6 w-6"
            >
              <Save className="h-3 w-3" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleCancel}
              className="h-6 w-6"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </>
        ) : (
          <>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => onEditMessage(keyword)}
              title="Edit custom message"
              className="h-6 w-6"
            >
              <MessageSquare className="h-3 w-3" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => setIsEditing(true)}
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
              <AlertDialogAction onClick={() => removeKeyword(keyword)}>
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default KeywordItem;
