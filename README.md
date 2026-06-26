# YouTube Study Companion 🎓🎥

An advanced Chrome Extension designed to boost productivity and focus while studying or taking courses on YouTube. It injects a draggable, floating control panel directly onto YouTube video pages, allowing you to take timestamped notes, manage a Pomodoro timer, toggle Focus Mode, and customize settings without leaving your video.

![YouTube Study Companion Screenshot](https://raw.githubusercontent.com/your-username/youtube-study-companion/main/assets/screenshot.png) *(Replace this with a screenshot of your working extension!)*

## 🚀 Key Features

*   **📍 Timestamped Note-Taking:** Type notes with instant timestamp integration. Clicking on a note's timestamp seeks the YouTube video directly to that moment. Notes can be edited and deleted.
*   **⏱️ Pomodoro Timer:** A customizable study/break timer to keep you on track, integrated into the floating panel.
*   **👁️ Focus Mode:** Toggle to clean up the YouTube interface by hiding distracting elements like the recommendation sidebar, comments, and homepage feed, keeping your focus purely on the lecture.
*   **🎛️ Drag-and-Drop Panel:** Smooth, interactive floating UI that can be repositioned anywhere on the screen so it never blocks your view.
*   **🎨 Custom Premium Styling:** Built with Tailwind CSS and fully isolated using **Shadow DOM** to prevent CSS leakage or pollution between YouTube's stylesheets and the extension.

## 🛠️ Technical Architecture

This project is a modern React application built as a Chrome Extension content script, resolving common architectural challenges:

1.  **Shadow DOM Isolation:** To prevent YouTube's global styles from corrupting the extension's UI (and vice-versa), the entire React application is mounted inside a Shadow Root. Tailwind CSS styles are compiled and injected directly into the shadow tree.
2.  **Event Propagation Handling:** YouTube aggressively listens for keyboard shortcuts globally (like `Space` to pause/play, `f` for fullscreen, numbers to skip). This extension implements event interceptors and propagation blocks on inputs/textareas to ensure keyboard events inside the panel behave correctly.
3.  **Vite Build Configuration:** Vite's default bundle format uses ES modules, which are not directly supported by standard Chrome content scripts. This project implements a custom double-build configuration (`vite.popup.config.js` and `vite.content.config.js`) to bundle the popup and compile the content script into an isolated IIFE format.

## 📦 Tech Stack

*   **Frontend Library:** React (Functional Components, Hooks)
*   **Styling:** Tailwind CSS v3
*   **Icons:** Lucide React
*   **Build Tooling:** Vite, PostCSS, Autoprefixer
*   **APIs:** Chrome Extensions API (Manifest V3)

---

## 🔧 Installation & Setup

Since this is a custom Chrome Extension (not currently published on the Chrome Web Store), you can load it locally as an **Unpacked Extension**.

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v16+ recommended).

### 2. Clone the Repository & Install Dependencies
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/youtube-study-companion.git
cd youtube-study-companion
npm install
```

### 3. Build the Extension
Compile the assets and JavaScript files for both the popup and content script:
```bash
npm run build
```
This generates a `dist/` directory containing the production-ready code.

### 4. Load into Chrome
1.  Open Google Chrome and navigate to `chrome://extensions/`.
2.  Enable **Developer mode** (toggle switch in the top-right corner).
3.  Click the **Load unpacked** button in the top-left.
4.  Select the `dist` folder inside your project directory.
5.  Open any YouTube video and start studying!

---

## 📁 Directory Structure

```text
├── dist/                  # Compiled files loaded into Chrome
├── src/
│   ├── components/        # React components (Timer, Notes, FocusToggle, etc.)
│   ├── styles/            # Tailwind CSS source styling
│   ├── content.jsx        # Content script entry (renders Shadow DOM + React)
│   └── popup.jsx          # Extension toolbar popup entry
├── manifest.json          # Chrome Extension Manifest configuration
├── tailwind.config.js     # Tailwind CSS theme configuration
├── vite.content.config.js # Vite configuration for bundling the Content Script (IIFE)
├── vite.popup.config.js   # Vite configuration for bundling the Toolbar Popup
└── package.json           # Scripts and dependencies
```

