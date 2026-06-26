import React, { useState } from 'react';
import { storage } from '../utils/storage';

export default function Settings() {
  const [showConfirm, setShowConfirm] = useState(false);

  const clearData = async () => {
    await storage.clear();
    setShowConfirm(false);
    alert('All study data cleared.');
    window.location.reload(); // Quick way to reset state
  };

  const exportData = async () => {
    chrome.storage.local.get(null, (items) => {
      const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `study_companion_backup_${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-semibold mb-3 text-purple-400 uppercase tracking-wider">Data Management</h3>
        <div className="flex flex-col gap-2">
          <button 
            onClick={exportData}
            className="w-full text-left px-4 py-3 bg-white bg-opacity-5 hover:bg-opacity-10 rounded-lg text-sm transition-colors border border-panel-border"
          >
            Export All Data (JSON)
          </button>
          
          {showConfirm ? (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-3">
              <p className="text-sm text-red-200 mb-2">Are you sure? This cannot be undone.</p>
              <div className="flex gap-2">
                <button onClick={clearData} className="flex-1 bg-red-600 text-white text-xs py-2 rounded">Yes, clear data</button>
                <button onClick={() => setShowConfirm(false)} className="flex-1 bg-gray-600 text-white text-xs py-2 rounded">Cancel</button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setShowConfirm(true)}
              className="w-full text-left px-4 py-3 bg-white bg-opacity-5 hover:bg-opacity-10 rounded-lg text-sm text-red-400 transition-colors border border-panel-border"
            >
              Clear All Data
            </button>
          )}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-3 text-purple-400 uppercase tracking-wider">About</h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          YouTube Study Companion<br/>
          Version 1.0.0<br/>
          Designed for distraction-free learning.
        </p>
      </div>
    </div>
  );
}
