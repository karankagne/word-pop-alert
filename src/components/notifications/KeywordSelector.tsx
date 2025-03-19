
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface KeywordSelectorProps {
  keywords: string[];
  selectedKeyword: string;
  onKeywordChange: (keyword: string) => void;
}

const KeywordSelector: React.FC<KeywordSelectorProps> = ({
  keywords,
  selectedKeyword,
  onKeywordChange
}) => {
  return (
    <div className="space-y-1">
      <Label htmlFor="keyword-select" className="text-xs">Select keyword to test</Label>
      <Select
        value={selectedKeyword}
        onValueChange={onKeywordChange}
      >
        <SelectTrigger id="keyword-select" className="h-8 text-xs">
          <SelectValue placeholder="Select a keyword" />
        </SelectTrigger>
        <SelectContent>
          {keywords.map((keyword) => (
            <SelectItem key={keyword} value={keyword} className="text-sm">
              {keyword}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default KeywordSelector;
