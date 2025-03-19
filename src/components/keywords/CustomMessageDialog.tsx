
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useKeywords } from "@/contexts/KeywordContext";

interface CustomMessageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedKeyword: string;
}

const CustomMessageDialog: React.FC<CustomMessageDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedKeyword,
}) => {
  const { customMessages, saveCustomMessage } = useKeywords();
  const [customMessage, setCustomMessage] = useState("");

  // Update message when selected keyword changes
  useEffect(() => {
    if (selectedKeyword) {
      setCustomMessage(customMessages[selectedKeyword] || `You've spotted "${selectedKeyword}" on this page!`);
    }
  }, [selectedKeyword, customMessages]);

  const handleSave = () => {
    saveCustomMessage(selectedKeyword, customMessage);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Message</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomMessageDialog;
