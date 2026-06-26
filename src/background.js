// Service worker for background tasks
chrome.runtime.onInstalled.addListener(() => {
  console.log('YouTube Study Companion Installed.');
});

// We can add alarm listeners here later if needed for the timer.
