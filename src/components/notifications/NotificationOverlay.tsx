
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface NotificationOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedKeyword: string;
  customMessage: string;
}

const NotificationOverlay: React.FC<NotificationOverlayProps> = ({
  open,
  onOpenChange,
  selectedKeyword,
  customMessage
}) => {
  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] h-auto max-h-[80vh] p-0 bg-transparent border-0 shadow-none">
        <div className="flex flex-col items-center justify-center w-full h-full bg-black/90 backdrop-blur-md rounded-lg p-4">
          <div className="w-full bg-background/10 border border-white/10 rounded-xl p-4 text-center">
            <div className="mb-2 flex justify-center items-center">
              <div className="h-2 w-2 rounded-full bg-pink-500 mr-2 animate-pulse"></div>
              <h2 className="text-lg font-semibold text-white">Breakup Buddy</h2>
            </div>
            
            <h3 className="text-xl font-bold my-3 text-white">{selectedKeyword}</h3>
            
            <p className="text-sm mb-4 text-white/90">
              {customMessage || `Remember: focusing on "${selectedKeyword}" right now might not help your healing process.`}
            </p>
            
            <div className="flex flex-col gap-2 w-full max-w-xs mx-auto">
              <Button 
                onClick={handleClose}
                className="bg-pink-500/80 hover:bg-pink-500 text-white text-sm"
                size="sm"
              >
                Continue Anyway
              </Button>
              <Button 
                onClick={handleClose}
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
  );
};

export default NotificationOverlay;
