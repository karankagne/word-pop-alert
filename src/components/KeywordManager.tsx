
import React, { useState } from "react";
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

  // Sync keywords from props with context
  React.useEffect(() => {
    if (keywords !== keywordContext.keywords) {
      keywordContext.setKeywords(keywords);
    }
  }, [keywords, keywordContext]);

  // Sync keywords from context back to props
  React.useEffect(() => {
    if (keywordContext.keywords !== keywords) {
      setKeywords(keywordContext.keywords);
    }
  }, [keywordContext.keywords, setKeywords]);

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
