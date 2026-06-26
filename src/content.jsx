import React from 'react';
import { createRoot } from 'react-dom/client';
import tailwindStyles from './styles/tailwind.css?inline';
import FloatingPanel from './components/FloatingPanel';

function injectStudyCompanion() {
  if (document.getElementById('yt-study-companion-root')) return;

  const container = document.createElement('div');
  container.id = 'yt-study-companion-root';
  // Append to body but make sure it has absolute positioning and high z-index
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.pointerEvents = 'none'; // allow clicking through empty space
  container.style.zIndex = '999999';
  document.body.appendChild(container);

  const shadowRoot = container.attachShadow({ mode: 'open' });
  
  // Inject Tailwind CSS into Shadow DOM
  const styleSheet = document.createElement('style');
  styleSheet.textContent = tailwindStyles;
  shadowRoot.appendChild(styleSheet);

  const reactRootDiv = document.createElement('div');
  reactRootDiv.style.pointerEvents = 'auto'; // allow clicking on our panel
  shadowRoot.appendChild(reactRootDiv);

  const root = createRoot(reactRootDiv);
  root.render(<FloatingPanel />);
}

// Observe body for changes in case YouTube's SPA navigation resets our root
const observer = new MutationObserver(() => {
  if (!document.getElementById('yt-study-companion-root')) {
    injectStudyCompanion();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// Initial injection
injectStudyCompanion();
