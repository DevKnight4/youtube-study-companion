import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const formatTimer = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(25 * 60); // Default to 25 mins

  useEffect(() => {
    // Load timer state
    storage.get('timerState').then((state) => {
      if (state) {
        setDuration(state.duration);
        if (state.isRunning) {
          const passed = Math.floor((Date.now() - state.lastUpdated) / 1000);
          const newTimeLeft = Math.max(0, state.timeLeft - passed);
          setTimeLeft(newTimeLeft);
          setIsRunning(true);
        } else {
          setTimeLeft(state.timeLeft);
        }
      }
    });
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const next = prev - 1;
          if (next === 0) {
            setIsRunning(false);
            playAlarm();
          }
          return next;
        });
      }, 1000);
    }
    
    // Save state on unmount or tick (every 5 seconds to reduce storage writes)
    if (isRunning && timeLeft % 5 === 0) {
      storage.set('timerState', {
        timeLeft,
        duration,
        isRunning,
        lastUpdated: Date.now()
      });
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    const nextRunning = !isRunning;
    setIsRunning(nextRunning);
    storage.set('timerState', {
      timeLeft,
      duration,
      isRunning: nextRunning,
      lastUpdated: Date.now()
    });
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(duration);
    storage.set('timerState', {
      timeLeft: duration,
      duration,
      isRunning: false,
      lastUpdated: Date.now()
    });
  };

  const setPreset = (mins) => {
    const secs = mins * 60;
    setDuration(secs);
    setTimeLeft(secs);
    setIsRunning(false);
    storage.set('timerState', {
      timeLeft: secs,
      duration: secs,
      isRunning: false,
      lastUpdated: Date.now()
    });
  };

  const playAlarm = () => {
    // Simple beep sound using AudioContext
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
    
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  };

  // Calculate SVG circle dash offset
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / duration) * circumference;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      
      {/* Visual Timer */}
      <div className="relative flex items-center justify-center">
        <svg width="160" height="160" className="transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-current text-white text-opacity-10"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            className={`stroke-current ${timeLeft <= 60 ? 'text-red-500' : 'text-purple-500'} transition-all duration-1000 ease-linear`}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute text-4xl font-mono tracking-tighter font-light">
          {formatTimer(timeLeft)}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button 
          onClick={toggleTimer}
          className={`w-24 py-2 rounded-full font-medium transition-colors ${
            isRunning 
              ? 'bg-red-500 bg-opacity-20 text-red-400 hover:bg-opacity-30' 
              : 'bg-purple-600 hover:bg-purple-500 text-white'
          }`}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button 
          onClick={resetTimer}
          className="w-24 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full font-medium transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Presets */}
      <div className="flex gap-2 mt-4">
        <button onClick={() => setPreset(25)} className="text-xs bg-white bg-opacity-5 hover:bg-opacity-10 px-3 py-1 rounded">25m Study</button>
        <button onClick={() => setPreset(5)} className="text-xs bg-white bg-opacity-5 hover:bg-opacity-10 px-3 py-1 rounded">5m Break</button>
        <button onClick={() => setPreset(50)} className="text-xs bg-white bg-opacity-5 hover:bg-opacity-10 px-3 py-1 rounded">50m Study</button>
      </div>
    </div>
  );
}
