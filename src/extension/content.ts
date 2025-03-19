
// This is the content script for the Chrome extension
// It runs in the context of web pages and scans for keywords

let keywords: string[] = [];
let customMessages: { [key: string]: string } = {};
let lastDetectedKeywords: { [key: string]: number } = {};
const COOLDOWN_PERIOD = 30000; // 30 seconds cooldown for repeated notifications

// Load keywords and custom messages from chrome storage
function loadKeywords() {
  try {
    // For development, we use localStorage
    const savedKeywords = localStorage.getItem("wordPopKeywords");
    const savedMessages = localStorage.getItem("wordPopCustomMessages");
    
    if (savedKeywords) {
      keywords = JSON.parse(savedKeywords);
      console.log("Loaded keywords:", keywords);
    }
    
    if (savedMessages) {
      customMessages = JSON.parse(savedMessages);
      console.log("Loaded custom messages:", customMessages);
    } else {
      // Initialize default custom messages if not set
      customMessages = {};
      keywords.forEach(keyword => {
        customMessages[keyword] = `You've spotted "${keyword}" on this page!`;
      });
      localStorage.setItem("wordPopCustomMessages", JSON.stringify(customMessages));
    }
  } catch (error) {
    console.error("Error loading keywords or custom messages:", error);
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
        
        // For demo purposes, we'll create our own full-screen notification
        showFullScreenNotification(keyword);
      }
    }
  });
}

// Create and show a full-screen notification
function showFullScreenNotification(keyword: string) {
  // Get custom message for this keyword or use default
  const customMessage = customMessages[keyword] || `Detected "${keyword}" on this page!`;
  
  // Create overlay container
  const overlayElement = document.createElement("div");
  overlayElement.id = "wordpop-overlay";
  overlayElement.style.position = "fixed";
  overlayElement.style.top = "0";
  overlayElement.style.left = "0";
  overlayElement.style.width = "100%";
  overlayElement.style.height = "100%";
  overlayElement.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
  overlayElement.style.backdropFilter = "blur(8px)";
  overlayElement.style.zIndex = "2147483647"; // Max z-index
  overlayElement.style.display = "flex";
  overlayElement.style.flexDirection = "column";
  overlayElement.style.justifyContent = "center";
  overlayElement.style.alignItems = "center";
  overlayElement.style.padding = "2rem";
  overlayElement.style.animation = "fadeIn 0.3s ease-out forwards";
  
  // Create notification content
  const contentElement = document.createElement("div");
  contentElement.style.maxWidth = "600px";
  contentElement.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
  contentElement.style.borderRadius = "16px";
  contentElement.style.padding = "2rem";
  contentElement.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.2)";
  contentElement.style.textAlign = "center";
  contentElement.style.color = "white";
  
  contentElement.innerHTML = `
    <div style="margin-bottom: 1rem; display: flex; justify-content: center; align-items: center;">
      <div style="height: 12px; width: 12px; border-radius: 50%; background-color: #3b82f6; margin-right: 12px; animation: pulse 1.5s infinite;"></div>
      <h2 style="font-size: 24px; font-weight: 600; margin: 0;">WordPop Alert</h2>
    </div>
    <h3 style="font-size: 28px; font-weight: 700; margin: 1rem 0; color: #f0f0f0;">${keyword}</h3>
    <p style="font-size: 18px; margin: 1rem 0 2rem; line-height: 1.6;">${customMessage}</p>
    <button id="close-wordpop" style="background-color: rgba(59, 130, 246, 0.8); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-size: 16px; font-weight: 500; cursor: pointer; transition: all 0.2s;">Continue Browsing</button>
  `;
  
  overlayElement.appendChild(contentElement);
  
  // Add styles for animations
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.1); }
    }
    #close-wordpop:hover {
      background-color: rgba(59, 130, 246, 1);
      transform: translateY(-2px);
    }
  `;
  
  document.head.appendChild(styleElement);
  document.body.appendChild(overlayElement);
  
  // Add close handler
  const closeButton = document.getElementById("close-wordpop");
  closeButton?.addEventListener("click", () => {
    overlayElement.style.animation = "fadeOut 0.3s ease-out forwards";
    setTimeout(() => {
      if (document.body.contains(overlayElement)) {
        document.body.removeChild(overlayElement);
      }
    }, 300);
  });
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
