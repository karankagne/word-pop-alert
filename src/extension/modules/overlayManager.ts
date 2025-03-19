
// This module handles the UI overlay/popup functionality

/**
 * Creates and displays the avoidance screen overlay
 * @param detectedKeywords Array of detected keywords to display
 * @param avoidanceMessage The main message to display
 * @param onClose Callback to execute when the overlay is closed
 */
export function showAvoidanceScreen(
  detectedKeywords: string[] = [], 
  avoidanceMessage: string,
  onClose?: () => void
): void {
  // Remove any existing overlay first
  const existingOverlay = document.getElementById("wordpop-overlay");
  if (existingOverlay) {
    document.body.removeChild(existingOverlay);
  }
  
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
  overlayElement.style.animation = "fadeIn 0.3s ease-out forwards";
  
  // Create message content
  const messageElement = document.createElement("div");
  messageElement.style.maxWidth = "600px";
  messageElement.style.textAlign = "center";
  messageElement.style.color = "white";
  
  // Show detected keywords if available
  let keywordsHtml = '';
  if (detectedKeywords.length > 0) {
    keywordsHtml = `
      <div style="margin-top: 1rem; padding: 1rem; background-color: rgba(236, 72, 153, 0.2); border-radius: 8px; max-width: 300px; margin: 1rem auto;">
        <p style="font-size: 14px; margin-bottom: 0.5rem; opacity: 0.8;">Detected sensitive content:</p>
        <p style="font-weight: 600; font-size: 16px;">${detectedKeywords.join(', ')}</p>
      </div>
    `;
  }
  
  messageElement.innerHTML = `
    <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 1.5rem; color: #f0f0f0;">
      <span style="color: rgb(236, 72, 153);">Stop</span> and breathe
    </h2>
    <p style="font-size: 20px; margin: 1rem 0 2rem; line-height: 1.6;">${avoidanceMessage}</p>
    ${keywordsHtml}
    <div style="display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 300px; margin: 0 auto;">
      <button id="leave-page" style="background-color: rgba(236, 72, 153, 0.8); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-size: 16px; font-weight: 500; cursor: pointer; transition: all 0.2s;">Leave This Page</button>
      <button id="close-wordpop" style="background-color: rgba(255, 255, 255, 0.15); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-size: 16px; font-weight: 500; cursor: pointer; transition: all 0.2s;">Continue Anyway</button>
    </div>
  `;
  
  overlayElement.appendChild(messageElement);
  
  // Add styles for animations
  addOverlayStyles();
  
  // Add to the DOM
  document.body.appendChild(overlayElement);
  
  // Add event listeners
  attachOverlayEventListeners(overlayElement, onClose);
}

/**
 * Add CSS styles for the overlay
 */
function addOverlayStyles(): void {
  // Remove existing styles if they exist
  const existingStyles = document.getElementById("wordpop-styles");
  if (existingStyles) {
    existingStyles.remove();
  }
  
  const styleElement = document.createElement("style");
  styleElement.id = "wordpop-styles";
  styleElement.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.98); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes fadeOut {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(0.98); }
    }
    #close-wordpop:hover {
      background-color: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
    }
    #leave-page:hover {
      background-color: rgba(236, 72, 153, 1);
      transform: translateY(-2px);
    }
    
    /* Pulsing effect for the detected keywords */
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(236, 72, 153, 0); }
      100% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); }
    }
  `;
  
  document.head.appendChild(styleElement);
}

/**
 * Attach event listeners to overlay buttons
 */
function attachOverlayEventListeners(overlayElement: HTMLElement, onClose?: () => void): void {
  // Add close handler
  const closeButton = document.getElementById("close-wordpop");
  closeButton?.addEventListener("click", () => {
    overlayElement.style.animation = "fadeOut 0.3s ease-out forwards";
    setTimeout(() => {
      if (document.body.contains(overlayElement)) {
        document.body.removeChild(overlayElement);
      }
      // Execute onClose callback if provided
      if (onClose) {
        onClose();
      }
    }, 300);
  });
  
  // Add leave page handler
  const leaveButton = document.getElementById("leave-page");
  leaveButton?.addEventListener("click", () => {
    // Execute onClose callback if provided
    if (onClose) {
      onClose();
    }
    window.history.back(); // Go back to previous page
  });
}

/**
 * Create and add a test button to the page (for development environments)
 */
export function addTestButton(testHandler: () => void): void {
  // Add test button to page
  const testButton = document.createElement('button');
  testButton.innerText = 'Test Breakup Buddy Popup';
  testButton.style.position = 'fixed';
  testButton.style.bottom = '20px';
  testButton.style.right = '20px';
  testButton.style.zIndex = '9999';
  testButton.style.padding = '10px';
  testButton.style.backgroundColor = '#ec4899';
  testButton.style.color = 'white';
  testButton.style.border = 'none';
  testButton.style.borderRadius = '4px';
  testButton.style.cursor = 'pointer';
  
  testButton.addEventListener('click', testHandler);
  
  // Add after a slight delay to ensure the page is loaded
  setTimeout(() => {
    document.body.appendChild(testButton);
  }, 1000);
}
