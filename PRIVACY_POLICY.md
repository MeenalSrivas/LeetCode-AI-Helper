# Privacy Policy for LeetCode AI Helper

**Last Updated:** April 2026

This Privacy Policy describes how the LeetCode AI Helper Chrome Extension ("the Extension") handles your data. We are committed to your privacy and security.

### 1. Data Collection
The Extension **does not** collect, store, or transmit any personal data, analytics, or usage metrics to the developer or any third-party servers.

### 2. API Keys and Local Storage
The Extension requires a Google Gemini API key to function. 
* Your API key is saved strictly on your local machine using Chrome's `chrome.storage.local` API. 
* Your key is **never** transmitted to the developer, our servers, or any external database. 
* You can delete your key at any time by uninstalling the extension or clearing your local extension storage.

### 3. Website Content and `activeTab` Permission
To provide context-aware assistance, the Extension reads the problem description text on `leetcode.com` when you actively click the "Ask AI" button. This text is sent directly to the Google Gemini API to generate a response. The Extension does not save this data, nor does it track your browsing history.

### 4. Third-Party Services
The Extension communicates directly with the official Google Gemini API to generate responses. Please refer to Google's Privacy Policy to understand how they handle data sent to their API.

### 5. Contact
If you have any questions about this Privacy Policy, please open an issue on the project's GitHub repository.
