
// This would be the background script for the Chrome extension
// It runs in the background and manages the extension's state

// Listen for installation or update
chrome.runtime.onInstalled.addListener(() => {
  console.log("WordPop Alert extension installed or updated");
  
  // Initialize default settings if not already set
  chrome.storage.sync.get(["wordPopKeywords"], (result) => {
    if (!result.wordPopKeywords) {
      chrome.storage.sync.set({ wordPopKeywords: [] });
    }
  });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "WORD_DETECTED") {
    // In a real extension, this would show a chrome.notifications alert
    // or send a message to the popup to display the notification
    console.log(`Detected keyword: ${message.keyword} on ${sender.tab?.url}`);
    
    // Send response to acknowledge receipt
    sendResponse({ received: true });
  }
  
  // Return true to indicate that the response will be sent asynchronously
  return true;
});
