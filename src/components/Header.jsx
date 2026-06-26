import React from 'react';
import { PenSquare, Timer, EyeOff, Settings } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'notes', icon: <PenSquare size={18} />, label: 'Notes' },
    { id: 'timer', icon: <Timer size={18} />, label: 'Timer' },
    { id: 'focus', icon: <EyeOff size={18} />, label: 'Focus' },
    { id: 'settings', icon: <Settings size={18} />, label: 'Settings' }
  ];

  return (
    <div className="flex bg-black bg-opacity-20 border-b border-panel-border">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`flex-1 flex flex-col items-center justify-center py-2 gap-1 transition-colors ${
            activeTab === tab.id 
              ? 'text-white border-b-2 border-purple-500 bg-white bg-opacity-5' 
              : 'text-gray-400 hover:text-gray-200 hover:bg-white hover:bg-opacity-5 border-b-2 border-transparent'
          }`}
          onClick={() => setActiveTab(tab.id)}
          title={tab.label}
        >
          {tab.icon}
        </button>
      ))}
    </div>
  );
}
