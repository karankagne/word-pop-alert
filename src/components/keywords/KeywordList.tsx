
import React from "react";
import KeywordItem from "./KeywordItem";
import { useKeywords } from "@/contexts/KeywordContext";

interface KeywordListProps {
  onEditMessage: (keyword: string) => void;
}

const KeywordList: React.FC<KeywordListProps> = ({ onEditMessage }) => {
  const { keywords } = useKeywords();

  if (keywords.length === 0) {
    return (
      <div className="text-center py-2 text-xs text-muted-foreground">
        No keywords added yet
      </div>
    );
  }

  return (
    <div className="space-y-1 mt-2 max-h-[180px] overflow-y-auto">
      {keywords.map((keyword) => (
        <KeywordItem 
          key={keyword} 
          keyword={keyword} 
          onEditMessage={onEditMessage}
        />
      ))}
    </div>
  );
};

export default KeywordList;
