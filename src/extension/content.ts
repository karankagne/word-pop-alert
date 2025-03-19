
// This is the content script for the Chrome extension
// It runs in the context of web pages and scans for keywords

import { loadKeywords, findKeywordsInText, handleStorageChanges, getAvoidanceMessage } from './modules/keywordManager';
import { showAvoidanceScreen, addTestButton } from './modules/overlayManager';

// Log for debugging
console.log("Breakup Buddy: Content script loaded and running");

/**
 * Scan the page for keywords
 */
function scanPageForKeywords(): void {
  // Get the text content of the page
  const pageText = document.body.innerText;
  
  // Find keywords in the page text
  const foundKeywords = findKeywordsInText(pageText);
  
  // If we found keywords, show the avoidance screen
  if (foundKeywords.length > 0) {
    console.log("Breakup Buddy: Showing avoidance screen for keywords:", foundKeywords);
    showAvoidanceScreen(foundKeywords, getAvoidanceMessage());
  } else {
    console.log("Breakup Buddy: No keywords found on this page");
  }
}

/**
 * Initialize the content script
 */
function initializeContentScript(): void {
  console.log("Breakup Buddy: Initializing content script");
  
  // Load keywords and then scan the page
  loadKeywords().then(() => {
    scanPageForKeywords();
  });
  
  // Set up a MutationObserver to detect content changes
  const observer = new MutationObserver(() => {
    console.log("Breakup Buddy: Content changed, rescanning page");
    scanPageForKeywords();
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
  
  // Rescan periodically for dynamic content (every 2 seconds)
  setInterval(scanPageForKeywords, 2000);
  
  // Synchronize with storage changes
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.onChanged.addListener((changes) => {
      handleStorageChanges(changes);
      
      // Re-scan the page with the updated keywords
      scanPageForKeywords();
    });
  }
  
  // Add development environment test functionality
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Breakup Buddy: Development mode detected - adding test functionality');
    
    addTestButton(() => {
      showAvoidanceScreen(['test keyword'], getAvoidanceMessage());
    });
  }
}

/**
 * Setup event listeners for document loading
 */
function setupEventListeners(): void {
  // Make sure we load keywords ASAP
  document.addEventListener('DOMContentLoaded', () => {
    console.log("Breakup Buddy: DOMContentLoaded event fired");
    initializeContentScript();
  });
  
  // Initialize immediately - this is important for pages that are already loaded
  initializeContentScript();
}

// Start the extension
setupEventListeners();
