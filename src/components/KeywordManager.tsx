
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AddKeywordForm from "./keywords/AddKeywordForm";
import KeywordList from "./keywords/KeywordList";
import CustomMessageDialog from "./keywords/CustomMessageDialog";
import { useKeywords } from "@/contexts/KeywordContext";

interface KeywordManagerProps {
  keywords: string[];
  setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
}

const KeywordManager: React.FC<KeywordManagerProps> = ({ keywords, setKeywords }) => {
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const keywordContext = useKeywords();

  // Only sync from props to context on initial mount
  useEffect(() => {
    if (keywords.length > 0) {
      keywordContext.setKeywords(keywords);
    }
    // This effect should only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync from context to props only when context keywords change
  useEffect(() => {
    // Prevent unnecessary updates by checking if arrays are different
    if (JSON.stringify(keywordContext.keywords) !== JSON.stringify(keywords)) {
      setKeywords(keywordContext.keywords);
    }
    // Only depend on keywordContext.keywords
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keywordContext.keywords]);

  const openMessageDialog = (keyword: string) => {
    setSelectedKeyword(keyword);
    setIsMessageDialogOpen(true);
  };

  return (
    <Card className="shadow-none border-none">
      <CardHeader className="p-3 pb-2">
        <CardTitle className="text-base flex items-center">
          Keywords
          <Badge className="ml-2 bg-primary/20 text-primary text-xs" variant="secondary">
            {keywordContext.keywords.length}
          </Badge>
        </CardTitle>
        <CardDescription className="text-xs">
          Add words you want to filter out
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3 p-3 pt-0">
        <AddKeywordForm />
        <KeywordList onEditMessage={openMessageDialog} />
      </CardContent>

      <CustomMessageDialog
        isOpen={isMessageDialogOpen}
        onOpenChange={setIsMessageDialogOpen}
        selectedKeyword={selectedKeyword}
      />
    </Card>
  );
};

export default KeywordManager;
