
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

interface KeywordContextType {
  keywords: string[];
  customMessages: { [key: string]: string };
  setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
  setCustomMessages: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  addKeyword: (keyword: string) => void;
  removeKeyword: (keyword: string) => void;
  updateKeyword: (oldKeyword: string, newKeyword: string) => void;
  saveCustomMessage: (keyword: string, message: string) => void;
}

const KeywordContext = createContext<KeywordContextType | undefined>(undefined);

export const KeywordProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [customMessages, setCustomMessages] = useState<{ [key: string]: string }>({});

  // Load keywords and custom messages from localStorage
  useEffect(() => {
    const savedKeywords = localStorage.getItem("wordPopKeywords");
    if (savedKeywords) {
      try {
        setKeywords(JSON.parse(savedKeywords));
      } catch (error) {
        console.error("Error parsing saved keywords:", error);
      }
    }

    const savedMessages = localStorage.getItem("wordPopCustomMessages");
    if (savedMessages) {
      try {
        setCustomMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error("Error parsing saved custom messages:", error);
      }
    }
  }, []);

  // Save custom messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("wordPopCustomMessages", JSON.stringify(customMessages));
  }, [customMessages]);

  // Save keywords to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("wordPopKeywords", JSON.stringify(keywords));
  }, [keywords]);

  const addKeyword = (keyword: string) => {
    if (!keyword.trim()) return;
    
    // Check if keyword already exists
    if (keywords.includes(keyword.trim())) {
      toast.error("This keyword already exists!");
      return;
    }
    
    const updatedKeywords = [...keywords, keyword.trim()];
    setKeywords(updatedKeywords);
    
    // Initialize custom message for new keyword
    setCustomMessages(prev => ({
      ...prev,
      [keyword.trim()]: `You've spotted "${keyword.trim()}" on this page!`
    }));
    
    toast.success("Keyword added successfully!");
  };

  const removeKeyword = (keyword: string) => {
    const updatedKeywords = keywords.filter(k => k !== keyword);
    setKeywords(updatedKeywords);
    
    // Remove custom message for this keyword
    const updatedMessages = { ...customMessages };
    delete updatedMessages[keyword];
    setCustomMessages(updatedMessages);
    
    toast.success("Keyword removed!");
  };

  const updateKeyword = (oldKeyword: string, newKeyword: string) => {
    if (!newKeyword.trim()) return false;

    // Check if new keyword already exists (except the one being edited)
    if (keywords.some(k => k !== oldKeyword && k === newKeyword.trim())) {
      toast.error("This keyword already exists!");
      return false;
    }

    const updatedKeywords = keywords.map(k => 
      k === oldKeyword ? newKeyword.trim() : k
    );
    setKeywords(updatedKeywords);
    
    // Update custom message key
    const updatedMessages = { ...customMessages };
    updatedMessages[newKeyword.trim()] = customMessages[oldKeyword] || `You've spotted "${newKeyword.trim()}" on this page!`;
    if (oldKeyword !== newKeyword.trim()) {
      delete updatedMessages[oldKeyword];
    }
    setCustomMessages(updatedMessages);
    
    toast.success("Keyword updated!");
    return true;
  };

  const saveCustomMessage = (keyword: string, message: string) => {
    if (!keyword || !message.trim()) return;
    
    setCustomMessages(prev => ({
      ...prev,
      [keyword]: message.trim()
    }));
    
    toast.success("Custom message saved!");
  };

  return (
    <KeywordContext.Provider value={{ 
      keywords, 
      customMessages, 
      setKeywords, 
      setCustomMessages,
      addKeyword,
      removeKeyword,
      updateKeyword,
      saveCustomMessage
    }}>
      {children}
    </KeywordContext.Provider>
  );
};

export const useKeywords = () => {
  const context = useContext(KeywordContext);
  if (context === undefined) {
    throw new Error("useKeywords must be used within a KeywordProvider");
  }
  return context;
};
