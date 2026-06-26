// Interacts with YouTube DOM and video player

export function getVideoElement() {
  return document.querySelector('video');
}

export function getCurrentTime() {
  const video = getVideoElement();
  return video ? video.currentTime : 0;
}

export function seekToTime(seconds) {
  const video = getVideoElement();
  if (video) {
    video.currentTime = seconds;
    video.play();
  }
}

export function formatTime(seconds) {
  if (isNaN(seconds)) return '00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function getVideoId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('v');
}

// Focus Mode Injection
let focusStyleEl = null;

export function setFocusMode(activeToggles) {
  if (!focusStyleEl) {
    focusStyleEl = document.createElement('style');
    focusStyleEl.id = 'yt-study-companion-focus-styles';
    document.head.appendChild(focusStyleEl);
  }

  let css = '';
  if (activeToggles.hideSidebar) {
    css += '#secondary { display: none !important; }\n';
  }
  if (activeToggles.hideComments) {
    css += '#comments { display: none !important; }\n';
  }
  if (activeToggles.hideHome) {
    css += '#page-manager ytd-browse[page-subtype="home"] { display: none !important; }\n';
  }
  if (activeToggles.hideEndScreens) {
    css += '.ytp-ce-element { display: none !important; }\n';
  }

  focusStyleEl.textContent = css;
}
