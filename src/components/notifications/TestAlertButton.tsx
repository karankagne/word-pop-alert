
import React from "react";
import { Button } from "@/components/ui/button";

interface TestAlertButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const TestAlertButton: React.FC<TestAlertButtonProps> = ({ onClick, disabled }) => {
  return (
    <Button 
      className="w-full h-8 text-sm bg-pink-500 hover:bg-pink-600" 
      onClick={onClick}
      disabled={disabled}
      size="sm"
    >
      Test Alert
    </Button>
  );
};

export default TestAlertButton;
