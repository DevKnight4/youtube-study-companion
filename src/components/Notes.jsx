import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { getCurrentTime, formatTime, seekToTime, getVideoId } from '../utils/youtube';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');
  const [videoId, setVideoId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editNoteText, setEditNoteText] = useState('');

  useEffect(() => {
    const id = getVideoId();
    if (id) {
      setVideoId(id);
      storage.get(`notes_${id}`, []).then(setNotes);
    }
    
    // Listen for YouTube SPA navigation
    const handleUrlChange = () => {
      const newId = getVideoId();
      if (newId && newId !== videoId) {
        setVideoId(newId);
        storage.get(`notes_${newId}`, []).then(setNotes);
      }
    };
    
    window.addEventListener('yt-navigate-finish', handleUrlChange);
    return () => window.removeEventListener('yt-navigate-finish', handleUrlChange);
  }, [videoId]);

  const addNote = (e) => {
    e.preventDefault();
    if (!currentNote.trim()) return;

    const timestamp = Math.floor(getCurrentTime());
    const newNote = {
      id: Date.now().toString(),
      text: currentNote,
      time: timestamp
    };

    const updatedNotes = [...notes, newNote].sort((a, b) => a.time - b.time);
    setNotes(updatedNotes);
    storage.set(`notes_${videoId}`, updatedNotes);
    setCurrentNote('');
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter(n => n.id !== id);
    setNotes(updatedNotes);
    storage.set(`notes_${videoId}`, updatedNotes);
  };

  const startEditing = (note) => {
    setEditingId(note.id);
    setEditNoteText(note.text);
  };

  const saveEdit = (id) => {
    if (!editNoteText.trim()) return;
    const updatedNotes = notes.map(n => n.id === id ? { ...n, text: editNoteText } : n);
    setNotes(updatedNotes);
    storage.set(`notes_${videoId}`, updatedNotes);
    setEditingId(null);
    setEditNoteText('');
  };

  const handleKeyDown = (e) => {
    e.stopPropagation();
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      if (editingId) {
        saveEdit(editingId);
      } else {
        addNote(e);
      }
    }
  };

  const stopProp = (e) => e.stopPropagation();

  return (
    <div className="flex flex-col h-full gap-4">
      <form onSubmit={addNote} className="flex flex-col gap-2">
        <textarea
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          onKeyDown={handleKeyDown}
          onKeyUp={stopProp}
          onKeyPress={stopProp}
          placeholder="Take a note... (Ctrl+Enter to save)"
          className="w-full bg-white bg-opacity-10 border border-panel-border rounded-lg px-3 py-3 text-base text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none h-24"
        />
        <button 
          type="submit"
          className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full shadow-lg"
        >
          Add Note
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-3">
        {notes.length === 0 ? (
          <div className="text-center text-gray-400 text-sm mt-8">
            No notes for this video yet.
          </div>
        ) : (
          notes.map(note => (
            <div key={note.id} className="bg-white bg-opacity-5 p-3 rounded-lg border border-panel-border group">
              <div className="flex justify-between items-start mb-2">
                <button 
                  onClick={() => seekToTime(note.time)}
                  className="bg-purple-500 bg-opacity-20 text-purple-300 hover:text-purple-200 hover:bg-opacity-30 px-2 py-0.5 rounded text-xs font-mono transition-colors"
                >
                  {formatTime(note.time)}
                </button>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => startEditing(note)}
                    className="text-gray-400 hover:text-blue-400 text-xs font-medium"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteNote(note.id)}
                    className="text-gray-400 hover:text-red-400 text-xs font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {editingId === note.id ? (
                <div className="flex flex-col gap-2 mt-2">
                  <textarea
                    value={editNoteText}
                    onChange={(e) => setEditNoteText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onKeyUp={stopProp}
                    onKeyPress={stopProp}
                    className="w-full bg-black bg-opacity-30 border border-purple-500 rounded px-2 py-2 text-base text-white focus:outline-none resize-none h-20"
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditingId(null)} className="text-xs text-gray-400 hover:text-white px-2 py-1">Cancel</button>
                    <button onClick={() => saveEdit(note.id)} className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded shadow">Save</button>
                  </div>
                </div>
              ) : (
                <p className="text-base text-gray-200 leading-relaxed whitespace-pre-wrap">{note.text}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
