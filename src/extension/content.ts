
// This would be the content script for the Chrome extension
// It runs in the context of web pages and scans for keywords

let keywords: string[] = [];
let lastDetectedKeywords: { [key: string]: number } = {};
const COOLDOWN_PERIOD = 30000; // 30 seconds cooldown for repeated notifications

// Load keywords from chrome storage
function loadKeywords() {
  // In a real extension, this would use chrome.storage.sync.get
  // For demo purposes, we'll use localStorage
  try {
    const savedKeywords = localStorage.getItem("wordPopKeywords");
    if (savedKeywords) {
      keywords = JSON.parse(savedKeywords);
      console.log("Loaded keywords:", keywords);
    }
  } catch (error) {
    console.error("Error loading keywords:", error);
  }
}

// Check if the page contains any of the keywords
function scanPageForKeywords() {
  if (keywords.length === 0) return;
  
  // Get the text content of the page
  const pageText = document.body.innerText.toLowerCase();
  
  // Check each keyword
  keywords.forEach(keyword => {
    const lowercaseKeyword = keyword.toLowerCase();
    
    if (pageText.includes(lowercaseKeyword)) {
      // Check if this keyword was recently detected
      const now = Date.now();
      if (!lastDetectedKeywords[keyword] || (now - lastDetectedKeywords[keyword] > COOLDOWN_PERIOD)) {
        // Update the last detection time
        lastDetectedKeywords[keyword] = now;
        
        // In a real extension, this would send a message to the background script
        // chrome.runtime.sendMessage({ type: "WORD_DETECTED", keyword });
        
        // For demo purposes, we'll just create our own notification
        showNotification(keyword);
      }
    }
  });
}

// Create and show a notification
function showNotification(keyword: string) {
  // Create notification element
  const notificationElement = document.createElement("div");
  notificationElement.style.position = "fixed";
  notificationElement.style.top = "20px";
  notificationElement.style.right = "20px";
  notificationElement.style.zIndex = "10000";
  notificationElement.style.maxWidth = "300px";
  notificationElement.style.backgroundColor = "rgba(255, 255, 255, 0.85)";
  notificationElement.style.backdropFilter = "blur(10px)";
  notificationElement.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
  notificationElement.style.borderRadius = "12px";
  notificationElement.style.padding = "16px";
  notificationElement.style.animation = "slideIn 0.3s ease-out forwards";
  
  // Create notification content
  notificationElement.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
      <div style="display: flex; align-items: center;">
        <div style="height: 8px; width: 8px; border-radius: 50%; background-color: #3b82f6; margin-right: 8px; animation: pulse 1.5s infinite;"></div>
        <h3 style="font-size: 14px; font-weight: 500;">Keyword Detected</h3>
      </div>
      <button id="close-notification" style="background: none; border: none; cursor: pointer; padding: 4px;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    <p style="font-size: 16px; font-weight: 500; margin-top: 4px;">"${keyword}"</p>
    <p style="font-size: 12px; color: #666; margin-top: 4px;">Detected on this page</p>
  `;
  
  // Add styles for the animation
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    @keyframes slideIn {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;
  
  document.head.appendChild(styleElement);
  document.body.appendChild(notificationElement);
  
  // Add close handler
  const closeButton = notificationElement.querySelector("#close-notification");
  closeButton?.addEventListener("click", () => {
    notificationElement.style.animation = "slideOut 0.3s ease-out forwards";
    setTimeout(() => {
      document.body.removeChild(notificationElement);
    }, 300);
  });
  
  // Auto-remove after 4 seconds
  setTimeout(() => {
    if (document.body.contains(notificationElement)) {
      notificationElement.style.animation = "slideOut 0.3s ease-out forwards";
      setTimeout(() => {
        if (document.body.contains(notificationElement)) {
          document.body.removeChild(notificationElement);
        }
      }, 300);
    }
  }, 4000);
}

// Initialize
loadKeywords();

// Scan the page initially and on content changes
scanPageForKeywords();

// Set up a MutationObserver to detect content changes
const observer = new MutationObserver(() => {
  scanPageForKeywords();
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true
});

// Rescan periodically for dynamic content
setInterval(scanPageForKeywords, 5000);
