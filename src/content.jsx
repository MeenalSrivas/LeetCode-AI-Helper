import React from 'react';
import ReactDOM from 'react-dom/client';

function ContentApp() {
  return (
    <div style={{
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
      zIndex: 99999 
    }}>
      Ask AI 🤖
    </div>
  );
}

// 1. Create the container div
const rootElement = document.createElement('div');
rootElement.id = 'leetcode-ai-helper-root';

// 2. Append it DIRECTLY to LeetCode's body (No Shadow DOM)
document.body.appendChild(rootElement);

// 3. Mount React directly to that div
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ContentApp />
  </React.StrictMode>
);