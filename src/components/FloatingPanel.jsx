import React, { useState, useEffect } from 'react';
import Header from './Header';
import Notes from './Notes';
import Timer from './Timer';
import FocusToggle from './FocusToggle';
import Settings from './Settings';
import { storage } from '../utils/storage';

export default function FloatingPanel() {
  const [activeTab, setActiveTab] = useState('notes');
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    storage.get('panelState').then((state) => {
      if (state) {
        setPosition(state.position || { x: 20, y: 20 });
        setIsMinimized(state.isMinimized || false);
      }
    });
  }, []);

  const handlePointerDown = (e) => {
    // Only drag from the header area
    if (e.target.closest('.drag-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      // Prevent text selection while dragging
      e.target.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(window.innerWidth - 350, e.clientX - dragOffset.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 50, e.clientY - dragOffset.y));
      setPosition({ x: newX, y: newY });
    }
  };

  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);
      storage.set('panelState', { position, isMinimized });
    }
  };

  const toggleMinimize = () => {
    const newMinimized = !isMinimized;
    setIsMinimized(newMinimized);
    storage.set('panelState', { position, isMinimized: newMinimized });
  };

  if (isMinimized) {
    return (
      <div 
        className="glass-panel p-2 cursor-pointer fixed hover:bg-opacity-90 flex items-center justify-center transition-all"
        style={{ left: position.x, top: position.y, width: '48px', height: '48px', zIndex: 99999 }}
        onClick={toggleMinimize}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <span className="text-xl drag-handle drag-handle-minimized">🎓</span>
      </div>
    );
  }

  return (
    <div 
      className="glass-panel text-white fixed flex flex-col transition-opacity overflow-hidden"
      style={{ left: position.x, top: position.y, width: '350px', height: '500px', zIndex: 99999 }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div 
        className="drag-handle bg-black bg-opacity-40 p-3 flex justify-between items-center cursor-move"
        onPointerDown={handlePointerDown}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🎓</span>
          <span className="font-semibold tracking-wide">Study Companion</span>
        </div>
        <button 
          onClick={toggleMinimize} 
          className="text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-10 p-1 rounded transition-colors"
        >
          ─
        </button>
      </div>
      
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'notes' && <Notes />}
        {activeTab === 'timer' && <Timer />}
        {activeTab === 'focus' && <FocusToggle />}
        {activeTab === 'settings' && <Settings />}
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
