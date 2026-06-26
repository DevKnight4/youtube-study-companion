import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { setFocusMode } from '../utils/youtube';

export default function FocusToggle() {
  const [toggles, setToggles] = useState({
    hideSidebar: false,
    hideComments: false,
    hideHome: false,
    hideEndScreens: false
  });

  useEffect(() => {
    storage.get('focusState').then((state) => {
      if (state) {
        setToggles(state);
        setFocusMode(state);
      }
    });
  }, []);

  const handleToggle = (key) => {
    const newToggles = { ...toggles, [key]: !toggles[key] };
    setToggles(newToggles);
    storage.set('focusState', newToggles);
    setFocusMode(newToggles);
  };

  const ToggleSwitch = ({ id, label, description }) => (
    <div className="flex items-center justify-between p-3 bg-white bg-opacity-5 rounded-lg border border-panel-border">
      <div className="flex flex-col">
        <span className="font-medium text-sm">{label}</span>
        <span className="text-xs text-gray-400">{description}</span>
      </div>
      <button 
        onClick={() => handleToggle(id)}
        className={`w-12 h-6 rounded-full p-1 transition-colors relative ${
          toggles[id] ? 'bg-purple-600' : 'bg-gray-700'
        }`}
      >
        <div 
          className={`w-4 h-4 bg-white rounded-full transition-transform ${
            toggles[id] ? 'transform translate-x-6' : ''
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-gray-300 mb-2">Turn off distractions to maintain focus.</p>
      
      <ToggleSwitch 
        id="hideSidebar" 
        label="Hide Recommendations" 
        description="Removes the related videos sidebar."
      />
      <ToggleSwitch 
        id="hideComments" 
        label="Hide Comments" 
        description="Hides the entire comments section."
      />
      <ToggleSwitch 
        id="hideHome" 
        label="Hide Home Feed" 
        description="Removes videos from the YouTube homepage."
      />
      <ToggleSwitch 
        id="hideEndScreens" 
        label="Hide End Screens" 
        description="Removes suggested videos at the end."
      />
    </div>
  );
}
