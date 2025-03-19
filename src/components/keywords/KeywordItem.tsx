
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Check, X, MessageSquare } from "lucide-react";
import { useKeywords } from "@/contexts/KeywordContext";
import { toast } from "sonner";

interface KeywordItemProps {
  keyword: string;
  onEditMessage: (keyword: string) => void;
}

const KeywordItem: React.FC<KeywordItemProps> = ({ keyword, onEditMessage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(keyword);
  const { removeKeyword, updateKeyword } = useKeywords();

  const handleEditSave = () => {
    if (editValue.trim() === '') {
      toast.error("Keyword cannot be empty");
      return;
    }
    
    if (editValue !== keyword) {
      updateKeyword(keyword, editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(keyword);
    setIsEditing(false);
  };

  const handleRemove = () => {
    removeKeyword(keyword);
    toast.success(`Removed "${keyword}"`);
  };

  const handleMessageEdit = () => {
    onEditMessage(keyword);
  };

  return (
    <div className="p-2 bg-muted/50 rounded-md flex items-center justify-between gap-2 group">
      {isEditing ? (
        <input
          className="flex-1 bg-background border border-input px-2 py-1 text-xs rounded-sm"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && handleEditSave()}
        />
      ) : (
        <div className="flex-1 text-sm truncate">{keyword}</div>
      )}
      
      <div className="flex gap-1">
        {isEditing ? (
          <>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-6 w-6" 
              onClick={handleEditSave}
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-6 w-6" 
              onClick={handleCancel}
            >
              <X className="h-3 w-3" />
            </Button>
          </>
        ) : (
          <>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" 
              onClick={handleMessageEdit}
              title="Edit custom message"
            >
              <MessageSquare className="h-3 w-3" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" 
              onClick={() => setIsEditing(true)}
              title="Rename keyword"
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive" 
              onClick={handleRemove}
              title="Delete keyword"
            >
              <Trash className="h-3 w-3" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default KeywordItem;
