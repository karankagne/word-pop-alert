
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useKeywords } from "@/contexts/KeywordContext";

const AddKeywordForm: React.FC = () => {
  const [newKeyword, setNewKeyword] = useState("");
  const { addKeyword } = useKeywords();

  const handleSubmit = () => {
    addKeyword(newKeyword);
    setNewKeyword("");
  };

  return (
    <div className="flex space-x-1">
      <Input
        placeholder="Enter a keyword..."
        value={newKeyword}
        onChange={(e) => setNewKeyword(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        className="h-8 text-sm"
      />
      <Button onClick={handleSubmit} size="sm" className="px-2">
        <PlusCircle className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default AddKeywordForm;
