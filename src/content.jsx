import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

function ContentApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  // Handles adding the user's message to the chat
  const handleSend = () => {
    if (!message.trim()) return; // Prevent sending empty spaces
    
    // Add the user's message to the history
    setChatHistory([...chatHistory, { role: 'user', content: message }]);
    setMessage(''); // Clear the input field
    
    // NOTE: This is exactly where we will later add the code to 
    // fetch the problem description and call the AI API!
  };

  // Allows hitting "Enter" to send
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // --- STATE 1: The Closed Button ---
  if (!isOpen) {
    return (
      <div 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: '#FFA116', 
          color: '#000000',
          padding: '12px 20px',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontFamily: 'sans-serif',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          zIndex: 999999,
          fontSize: '15px',
        }}
      >
        Ask AI 🤖
      </div>
    );
  }

  // --- STATE 2: The Open Input Bar (and Chat History) ---
  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      width: '400px',
      backgroundColor: '#1e1e1e',
      borderRadius: '12px',
      padding: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      zIndex: 999999,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      
      {/* Dynamic Chat History Area (Only shows if there are messages) */}
      {chatHistory.length > 0 && (
        <div style={{ 
          maxHeight: '300px', 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px',
          paddingRight: '4px'
        }}>
          {chatHistory.map((msg, index) => (
            <div key={index} style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.role === 'user' ? '#FFA116' : '#2d2d2d',
              color: msg.role === 'user' ? '#000000' : '#ffffff',
              padding: '8px 12px',
              borderRadius: '8px',
              maxWidth: '85%',
              fontSize: '14px',
              lineHeight: '1.4'
            }}>
              {msg.content}
            </div>
          ))}
        </div>
      )}

      {/* The Horizontal Input Bar */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
        <input 
          type="text" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..." 
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid #404040',
            backgroundColor: '#2d2d2d',
            color: '#ffffff',
            outline: 'none',
            fontSize: '14px'
          }}
        />
        
        <button 
          onClick={handleSend}
          style={{
            backgroundColor: '#FFA116',
            color: '#000000',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Send
        </button>

        <button 
          onClick={() => setIsOpen(false)}
          title="Close"
          style={{
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            fontSize: '20px',
            padding: '0 4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// --- MOUNTING LOGIC ---

// 1. Clean up old injections during hot-reloads
const existingContainer = document.getElementById('leetcode-ai-helper-wrapper');
if (existingContainer) {
  existingContainer.remove();
}

// 2. Create the wrapper
const wrapper = document.createElement('div');
wrapper.id = 'leetcode-ai-helper-wrapper';
// Let clicks pass through the invisible wrapper so it doesn't block the screen
wrapper.style.position = 'fixed';
wrapper.style.top = '0';
wrapper.style.left = '0';
wrapper.style.width = '100%';
wrapper.style.height = '100%';
wrapper.style.pointerEvents = 'none'; 
wrapper.style.zIndex = '999999';

document.body.appendChild(wrapper);

// 3. Mount React inside the wrapper
const root = createRoot(wrapper);
root.render(
  <React.StrictMode>
    {/* Re-enable pointer events ONLY for our actual React components */}
    <div style={{ pointerEvents: 'auto', width: '100%', height: '100%' }}>
      <ContentApp />
    </div>
  </React.StrictMode>
);