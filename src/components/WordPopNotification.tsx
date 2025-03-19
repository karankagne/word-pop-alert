
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface WordPopNotificationProps {
  keyword: string;
  context?: string;
  onClose?: () => void;
}

const WordPopNotification: React.FC<WordPopNotificationProps> = ({ 
  keyword, 
  context = "", 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Slight delay before showing to allow animation to work
    const showTimer = setTimeout(() => setIsVisible(true), 100);
    
    return () => clearTimeout(showTimer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Delay the actual removal to allow animation to complete
    setTimeout(() => onClose && onClose(), 300);
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <Card 
        className={cn(
          "glassmorphism p-4 flex flex-col overflow-hidden transition-all duration-300 transform",
          isVisible 
            ? "translate-y-0 opacity-100" 
            : "translate-y-4 opacity-0"
        )}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></div>
            <h3 className="font-medium text-sm">Keyword Detected</h3>
          </div>
          <button 
            onClick={handleClose}
            className="rounded-full hover:bg-muted/80 p-1"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
        
        <div className="mt-1">
          <p className="text-base font-medium">"{keyword}"</p>
          {context && (
            <p className="text-xs text-muted-foreground mt-1">{context}</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default WordPopNotification;
