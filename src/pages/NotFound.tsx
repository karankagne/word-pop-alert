
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <span className="inline-block text-sm font-medium bg-destructive/10 text-destructive px-3 py-1 rounded-full mb-4">
          404 Error
        </span>
        
        <h1 className="text-4xl font-medium mb-3">Page Not Found</h1>
        
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/">
          <Button 
            variant="outline" 
            className="px-4 py-2 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
