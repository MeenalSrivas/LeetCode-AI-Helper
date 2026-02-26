import { useState, useEffect } from 'react';
import { SiLeetcode } from "react-icons/si";
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState('');

  // Fetch the saved key when the popup opens
  useEffect(() => {
    if (chrome?.storage?.local) {
      chrome.storage.local.get(['aiApiKey']).then((result) => {
        if (result.aiApiKey) {
          setApiKey(result.aiApiKey);
        }
      });
    }
  }, []);

  // Save the key to Chrome's local storage
  const handleSave = () => {
    if (chrome?.storage?.local) {
      chrome.storage.local.set({ aiApiKey: apiKey }).then(() => {
        setStatus('Key saved successfully!');
        setTimeout(() => setStatus(''), 2000); // Clear message after 2s
      });
    } else {
      setStatus('Error: Chrome Storage API not found.');
    }
  };

  return (
    <div className="popup-container">
      <SiLeetcode className="logo" style={{ color: '#FFA116' }}/>
      <h2>LeetCode AI Helper</h2>
      <p>Enter your API Key to activate the assistant.</p>
      
      <input
        type="password"
        placeholder="sk-..."
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="api-input"
      />
      
      <button onClick={handleSave} className="save-btn">
        Save Key
      </button>
      
      {status && <p className="status-msg">{status}</p>}
    </div>
  );
}

export default App;