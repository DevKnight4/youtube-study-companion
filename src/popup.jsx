import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/popup.css';

function Popup() {
  return (
    <div className="popup-container">
      <h2>Study Companion Active</h2>
      <p>Open YouTube to access your notes, focus mode, and timer.</p>
      <button onClick={() => chrome.tabs.create({ url: 'https://www.youtube.com' })}>
        Open YouTube
      </button>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<Popup />);
