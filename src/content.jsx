import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const scrapeLeetCodeData = () => {
  // 1. Grab the title from the webpage title (e.g., "1. Two Sum - LeetCode")
  const rawTitle = document.title || "";
  const title = rawTitle.split('-')[0].trim(); 
  

  // 2. Grab the problem description
  // LeetCode uses dynamic class names, so we check a few reliable spots
  let description = "Description not found.";
  
  const metaDescription = document.querySelector('meta[name="description"]');
  const uiDescription = document.querySelector('.elfjS'); // Current LeetCode UI class for description text
  
  if (metaDescription && metaDescription.content) {
    description = metaDescription.content;
  } else if (uiDescription) {
    description = uiDescription.innerText;
  }

  return { title, description };
};

function ContentApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // --- UPDATED SEND LOGIC FOR GEMINI ---
  const handleSend = async () => {
    if (!message.trim()) return; 
    
    const userMessage = message;
    const newHistory = [...chatHistory, { role: 'user', content: userMessage }];
    setChatHistory([...newHistory, { role: 'assistant', content: 'Thinking... 🤔' }]);
    setMessage(''); 

    try {
      const result = await chrome.storage.local.get(['aiApiKey']);
      const apiKey = result.aiApiKey;

      if (!apiKey) {
        setChatHistory([...newHistory, { role: 'assistant', content: '⚠️ No API Key found!' }]);
        return;
      }

      const { title, description } = scrapeLeetCodeData();

      // NOTICE THE URL CHANGE HERE: We are calling Google now, not OpenAI!
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert Data Structures and Algorithms tutor. The user is working on the LeetCode problem "${title}". Context: ${description}. The user asks: "${userMessage}". Be concise, helpful, and format any code blocks clearly.`
            }]
          }]
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setChatHistory([...newHistory, { role: 'assistant', content: `⚠️ API Error: ${data.error?.message || 'Something went wrong'}` }]);
        return;
      }

      const aiReply = data.candidates[0].content.parts[0].text;
      setChatHistory([...newHistory, { role: 'assistant', content: aiReply }]);

    } catch (error) {
      console.error("Fetch error:", error);
      setChatHistory([...newHistory, { role: 'assistant', content: `⚠️ Network Error: Could not reach the AI.` }]);
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
      width: isExpanded ? '600px' : '350px',
      height: isExpanded ? 'auto' : 'auto',
      transition: 'all 0.3s ease',
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
      {/*Expand and shrink button*/}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: '1px solid #333',
        paddingBottom: '8px'
      }}>
        <span style={{ color: '#fff', fontWeight: 'bold' }}>Ask AI</span>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#FFA116',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {isExpanded ? '↙️ Shrink' : '↗️ Expand'}
        </button>
      </div>
      
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
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                          borderRadius: '6px',
                          margin: '8px 0',
                          backgroundColor: '#1e1e1e', // Matches your chat UI
                          padding: '12px'
                        }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code style={{
                        backgroundColor: '#444',
                        padding: '2px 4px',
                        borderRadius: '4px',
                        fontFamily: 'monospace'
                      }} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {msg.content}
              </ReactMarkdown>
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
wrapper.style.position = 'absolute';
wrapper.style.top = '10px';
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
    <div style={{ pointerEvents: 'auto' }}>
      <ContentApp />
    </div>
  </React.StrictMode>
);