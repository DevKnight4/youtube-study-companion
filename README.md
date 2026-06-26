# YouTube Study Companion 🎓🎥

An advanced Chrome Extension designed to boost productivity and focus while studying or taking courses on YouTube. It injects a draggable, floating control panel directly onto YouTube video pages, allowing you to take timestamped notes, manage a Pomodoro timer, toggle Focus Mode, and customize settings without leaving your video.

<p align="center"> 
  <img width="1041" height="356" alt="Screenshot 2026-06-26 143904" src="https://github.com/user-attachments/assets/12f542af-8848-4fb2-99a6-b83346cb2071" />
</p>


<!-- <img width="435" height="612" alt="image" src="https://github.com/user-attachments/assets/1008aca9-d9de-41d0-9d3c-f3ed3c5c62bd" />
<img width="425" height="616" alt="image" src="https://github.com/user-attachments/assets/bad07d40-c745-4873-81b7-392fad70af6d" /> -->






## 🚀 Key Features

*   **📍 Timestamped Note-Taking:** Type notes with instant timestamp integration. Clicking on a note's timestamp seeks the YouTube video directly to that moment. Notes can be edited and deleted.

<p align="center">
  <img width="1907" height="910" alt="image" src="https://github.com/user-attachments/assets/c38d79f7-31de-463b-b81f-6e0fd2ca5b70" />
</p>


*   **⏱️ Pomodoro Timer:** A customizable study/break timer to keep you on track, integrated into the floating panel.
*   **👁️ Focus Mode:** Toggle to clean up the YouTube interface by hiding distracting elements like the recommendation sidebar, comments, and homepage feed, keeping your focus purely on the lecture.

<table>
<tr>
<td align="center">

### ⏱ Pomodoro Timer
<img width="400" height="500" alt="image" src="https://github.com/user-attachments/assets/bad07d40-c745-4873-81b7-392fad70af6d" />


</td>

<td align="center">

### 🎯 Focus Mode
<img width="400" height="500" alt="image" src="https://github.com/user-attachments/assets/1008aca9-d9de-41d0-9d3c-f3ed3c5c62bd" />

</td>
</tr>
</table>


*   **🎛️ Drag-and-Drop Panel:** Smooth, interactive floating UI that can be repositioned anywhere on the screen so it never blocks your view.
*   **🎨 Custom Premium Styling:** Built with Tailwind CSS and fully isolated using **Shadow DOM** to prevent CSS leakage or pollution between YouTube's stylesheets and the extension.

## 🛠️ System Architecture

```text
                User opens YouTube
                        │
                        ▼
          Content Script Injected
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
   Create Shadow DOM             Observe DOM Changes
        │                               │
        ▼                               ▼
  Mount React App               MutationObserver
        │                               │
        ├──────────┬──────────┐         │
        ▼          ▼          ▼         ▼
     Notes     Pomodoro    Focus Mode  Hide Distractions
                                         • Comments
                                         • Recommendations
                                         • End Screens
                        │
                        ▼
               Enhanced Learning Experience
```

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
git clone https://github.com/DevKnight4/youtube-study-companion.git
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

