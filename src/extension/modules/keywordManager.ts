
// This module handles all keyword-related functionality
// Including loading, storing, and detecting keywords

let keywords: string[] = [];
let customMessages: { [key: string]: string } = {};
let userAvoidanceMessage: string = "Remember why you're here. Take a deep breath and focus on yourself.";
let lastDetectedKeywords: { [key: string]: number } = {};
const COOLDOWN_PERIOD = 30000; // 30 seconds cooldown for repeated notifications

/**
 * Load keywords, custom messages, and user avoidance message from storage
 */
export function loadKeywords(): Promise<void> {
  console.log("Breakup Buddy: Loading keywords and messages");
  
  return new Promise((resolve) => {
    // In production environment, we should use chrome.storage.sync.get
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get(['wordPopKeywords', 'wordPopCustomMessages', 'wordPopAvoidanceMessage'], (result) => {
        if (result.wordPopKeywords) {
          keywords = result.wordPopKeywords;
          console.log("Breakup Buddy: Loaded keywords from chrome storage:", keywords);
        } else {
          // Try fallback to localStorage
          fallbackToLocalStorage();
        }
        
        if (result.wordPopCustomMessages) {
          customMessages = result.wordPopCustomMessages;
          console.log("Breakup Buddy: Loaded custom messages from chrome storage:", customMessages);
        } else {
          // Initialize default custom messages if not set
          initializeDefaultMessages();
        }
        
        if (result.wordPopAvoidanceMessage) {
          userAvoidanceMessage = result.wordPopAvoidanceMessage;
          console.log("Breakup Buddy: Loaded avoidance message from chrome storage:", userAvoidanceMessage);
        }
        
        resolve();
      });
    } else {
      // For development, we use localStorage
      fallbackToLocalStorage();
      resolve();
    }
  });
}

/**
 * Initialize default custom messages for keywords
 */
function initializeDefaultMessages(): void {
  customMessages = {};
  keywords.forEach(keyword => {
    customMessages[keyword] = `Remember: focusing on "${keyword}" right now might not help your healing process.`;
  });
}

/**
 * Fallback to localStorage when chrome storage is not available
 */
function fallbackToLocalStorage(): void {
  // Fallback to localStorage for development or if chrome.storage fails
  const savedKeywords = localStorage.getItem("wordPopKeywords");
  const savedMessages = localStorage.getItem("wordPopCustomMessages");
  const savedAvoidanceMessage = localStorage.getItem("wordPopAvoidanceMessage");
  
  if (savedKeywords) {
    keywords = JSON.parse(savedKeywords);
    console.log("Breakup Buddy: Loaded keywords from localStorage:", keywords);
  }
  
  if (savedMessages) {
    customMessages = JSON.parse(savedMessages);
    console.log("Breakup Buddy: Loaded custom messages from localStorage:", customMessages);
  } else {
    // Initialize default custom messages if not set
    initializeDefaultMessages();
    localStorage.setItem("wordPopCustomMessages", JSON.stringify(customMessages));
  }
  
  if (savedAvoidanceMessage) {
    userAvoidanceMessage = savedAvoidanceMessage;
    console.log("Breakup Buddy: Loaded avoidance message from localStorage:", userAvoidanceMessage);
  } else {
    // Set default avoidance message if not set
    localStorage.setItem("wordPopAvoidanceMessage", userAvoidanceMessage);
  }
}

/**
 * Scan the page text for keywords
 * @param pageText The text content of the page to scan
 * @returns Array of found keywords
 */
export function findKeywordsInText(pageText: string): string[] {
  if (keywords.length === 0) {
    console.log("Breakup Buddy: No keywords to scan for");
    return [];
  }
  
  console.log("Breakup Buddy: Scanning page for keywords:", keywords);
  
  const lowerPageText = pageText.toLowerCase();
  const foundKeywords: string[] = [];
  const now = Date.now();
  
  // Check each keyword
  for (const keyword of keywords) {
    if (!keyword) continue; // Skip empty keywords
    
    const lowercaseKeyword = keyword.toLowerCase().trim();
    
    // Improved detection for both exact and partial matches
    if (
      lowerPageText.includes(lowercaseKeyword) || 
      lowerPageText.includes(encodeURIComponent(lowercaseKeyword)) ||
      new RegExp(`\\b${lowercaseKeyword}\\b`).test(lowerPageText)
    ) {
      console.log(`Breakup Buddy: FOUND keyword "${keyword}" on page!`);
      
      // Check if this keyword was recently detected
      if (!lastDetectedKeywords[keyword] || (now - lastDetectedKeywords[keyword] > COOLDOWN_PERIOD)) {
        // Update the last detection time
        lastDetectedKeywords[keyword] = now;
        foundKeywords.push(keyword);
      } else {
        console.log(`Breakup Buddy: Keyword "${keyword}" detected, but within cooldown period`);
      }
    }
  }
  
  if (foundKeywords.length > 0) {
    console.log("Breakup Buddy: Found keywords after filtering cooldown:", foundKeywords);
  }
  
  return foundKeywords;
}

/**
 * Update keywords when storage changes
 * @param changes The changes object from chrome.storage.onChanged
 */
export function handleStorageChanges(changes: { [key: string]: { oldValue?: any; newValue?: any } }): void {
  console.log("Breakup Buddy: Storage changed", changes);
  
  if (changes.wordPopKeywords) {
    keywords = changes.wordPopKeywords.newValue || [];
    console.log("Breakup Buddy: Updated keywords from storage change:", keywords);
  }
  
  if (changes.wordPopCustomMessages) {
    customMessages = changes.wordPopCustomMessages.newValue || {};
  }
  
  if (changes.wordPopAvoidanceMessage) {
    userAvoidanceMessage = changes.wordPopAvoidanceMessage.newValue || "";
  }
}

/**
 * Get the current avoidance message
 */
export function getAvoidanceMessage(): string {
  return userAvoidanceMessage;
}

/**
 * Get custom message for a keyword
 * @param keyword The keyword to get a message for
 */
export function getCustomMessage(keyword: string): string {
  return customMessages[keyword] || `Remember: focusing on "${keyword}" right now might not help your healing process.`;
}
