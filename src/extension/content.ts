
// This is the content script for the Chrome extension
// It runs in the context of web pages and scans for keywords

let keywords: string[] = [];
let customMessages: { [key: string]: string } = {};
let lastDetectedKeywords: { [key: string]: number } = {};
let userAvoidanceMessage: string = "Remember why you're here. Take a deep breath and focus on yourself.";
const COOLDOWN_PERIOD = 30000; // 30 seconds cooldown for repeated notifications

// Load keywords, custom messages, and user avoidance message from chrome storage
function loadKeywords() {
  try {
    // For development, we use localStorage
    const savedKeywords = localStorage.getItem("wordPopKeywords");
    const savedMessages = localStorage.getItem("wordPopCustomMessages");
    const savedAvoidanceMessage = localStorage.getItem("wordPopAvoidanceMessage");
    
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
        customMessages[keyword] = `Remember: focusing on "${keyword}" right now might not help your healing process.`;
      });
      localStorage.setItem("wordPopCustomMessages", JSON.stringify(customMessages));
    }
    
    if (savedAvoidanceMessage) {
      userAvoidanceMessage = savedAvoidanceMessage;
      console.log("Loaded avoidance message:", userAvoidanceMessage);
    } else {
      // Set default avoidance message if not set
      localStorage.setItem("wordPopAvoidanceMessage", userAvoidanceMessage);
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
        
        // Show immediate avoidance screen
        showAvoidanceScreen();
      }
    }
  });
}

// Create and show the immediate black screen with user's message
function showAvoidanceScreen() {
  // Create overlay container
  const overlayElement = document.createElement("div");
  overlayElement.id = "wordpop-overlay";
  overlayElement.style.position = "fixed";
  overlayElement.style.top = "0";
  overlayElement.style.left = "0";
  overlayElement.style.width = "100%";
  overlayElement.style.height = "100%";
  overlayElement.style.backgroundColor = "rgba(0, 0, 0, 0.95)";
  overlayElement.style.zIndex = "2147483647"; // Max z-index
  overlayElement.style.display = "flex";
  overlayElement.style.flexDirection = "column";
  overlayElement.style.justifyContent = "center";
  overlayElement.style.alignItems = "center";
  overlayElement.style.padding = "2rem";
  overlayElement.style.animation = "fadeIn 0.2s ease-out forwards";
  
  // Create message content
  const messageElement = document.createElement("div");
  messageElement.style.maxWidth = "600px";
  messageElement.style.textAlign = "center";
  messageElement.style.color = "white";
  
  messageElement.innerHTML = `
    <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 1.5rem; color: #f0f0f0;">Stop</h2>
    <p style="font-size: 20px; margin: 1rem 0 2rem; line-height: 1.6;">${userAvoidanceMessage}</p>
    <div style="display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 300px; margin: 0 auto;">
      <button id="leave-page" style="background-color: rgba(236, 72, 153, 0.8); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-size: 16px; font-weight: 500; cursor: pointer; transition: all 0.2s;">Leave This Page</button>
      <button id="close-wordpop" style="background-color: rgba(255, 255, 255, 0.15); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-size: 16px; font-weight: 500; cursor: pointer; transition: all 0.2s;">Continue Anyway</button>
    </div>
  `;
  
  overlayElement.appendChild(messageElement);
  
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
    #close-wordpop:hover {
      background-color: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
    }
    #leave-page:hover {
      background-color: rgba(236, 72, 153, 1);
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
  
  // Add leave page handler
  const leaveButton = document.getElementById("leave-page");
  leaveButton?.addEventListener("click", () => {
    window.history.back(); // Go back to previous page
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
