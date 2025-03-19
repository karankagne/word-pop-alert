
// This is the content script for the Chrome extension
// It runs in the context of web pages and scans for keywords

import { loadKeywords, findKeywordsInText, handleStorageChanges, getAvoidanceMessage } from './modules/keywordManager';
import { showAvoidanceScreen, addTestButton } from './modules/overlayManager';

// Log for debugging
console.log("Breakup Buddy: Content script loaded and running");

// Add global state to track if we're currently showing the overlay
let isOverlayShowing = false;
let keywords: string[] = [];

/**
 * Scan the page for keywords
 */
function scanPageForKeywords(): void {
  // Don't scan if the overlay is already showing
  if (isOverlayShowing) {
    console.log("Breakup Buddy: Overlay already showing, skipping scan");
    return;
  }
  
  // Get the text content of the page including title, URL and body
  const pageText = document.title + ' ' + window.location.href + ' ' + document.body.innerText;
  
  // Make sure we have keywords to check against
  if (!keywords || keywords.length === 0) {
    console.log("Breakup Buddy: No keywords loaded yet, skipping scan");
    return;
  }

  // Find keywords in the page text
  const foundKeywords = findKeywordsInText(pageText);
  
  // If we found keywords, show the avoidance screen
  if (foundKeywords.length > 0) {
    console.log("Breakup Buddy: Showing avoidance screen for keywords:", foundKeywords);
    isOverlayShowing = true;
    showAvoidanceScreen(
      foundKeywords, 
      getAvoidanceMessage(),
      () => { 
        console.log("Breakup Buddy: Overlay closed");
        isOverlayShowing = false; 
      }
    );
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
  loadKeywords().then((loadedKeywords) => {
    console.log("Breakup Buddy: Keywords loaded:", loadedKeywords);
    keywords = loadedKeywords;
    
    // Add a small delay to ensure the page is fully loaded
    setTimeout(() => {
      scanPageForKeywords();
    }, 500);
  }).catch(error => {
    console.error("Breakup Buddy: Error loading keywords:", error);
  });
  
  // Set up a MutationObserver to detect content changes
  const observer = new MutationObserver((mutations) => {
    let shouldRescan = false;
    
    // Check if any of the mutations affect text content
    for (const mutation of mutations) {
      if (
        mutation.type === 'childList' || 
        mutation.type === 'characterData' ||
        (mutation.target && mutation.target.nodeType === Node.TEXT_NODE)
      ) {
        shouldRescan = true;
        break;
      }
    }
    
    if (shouldRescan && !isOverlayShowing) {
      console.log("Breakup Buddy: Content changed, rescanning page");
      scanPageForKeywords();
    }
  });
  
  // Start observing with more specific options
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: false,
    attributeOldValue: false,
    characterDataOldValue: false
  });
  
  // Rescan periodically for dynamic content (every 3 seconds)
  setInterval(() => {
    if (!isOverlayShowing) {
      scanPageForKeywords();
    }
  }, 3000);
  
  // Synchronize with storage changes
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.onChanged.addListener((changes) => {
      console.log("Breakup Buddy: Storage changed", changes);
      const updatedKeywords = handleStorageChanges(changes);
      if (updatedKeywords) {
        keywords = updatedKeywords;
      }
      
      // Re-scan the page with the updated keywords
      if (!isOverlayShowing) {
        scanPageForKeywords();
      }
    });
  }
  
  // Add development environment test functionality
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Breakup Buddy: Development mode detected - adding test functionality');
    
    addTestButton(() => {
      console.log("Breakup Buddy: Test button clicked");
      isOverlayShowing = true;
      showAvoidanceScreen(
        ['test keyword'], 
        getAvoidanceMessage(),
        () => { 
          console.log("Breakup Buddy: Test overlay closed");
          isOverlayShowing = false; 
        }
      );
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
  
  // If document is already complete, initialize immediately
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log("Breakup Buddy: Document already loaded, initializing immediately");
    initializeContentScript();
  }
}

// Start the extension
setupEventListeners();
