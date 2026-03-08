import React, { useState, useEffect } from 'react';
import TimerCard from './components/TimerCard';
import TimerModal from './components/TimerModal';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const STORAGE_KEY = 'events_data';

function App() {
  const [timers, setTimers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTimer, setEditingTimer] = useState(null);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
  }, [timers]);

  useEffect(() => {
    const id = setInterval(() => forceUpdate(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const getTimeLeft = (timer, now) => {
    const baseTime = timer.isRunning ? now : (timer.pausedAt ?? now);
    return Math.max(0, Math.floor((timer.targetTimestamp - baseTime) / 1000));
  };

  const toggleTimer = (id) => {
    const now = Date.now();
    setTimers(prev => prev.map(t => {
      if (t.id !== id) return t;
      if (t.isRunning) return { ...t, isRunning: false, pausedAt: now };
      const elapsed = now - t.pausedAt;
      return { ...t, isRunning: true, targetTimestamp: t.targetTimestamp + elapsed, pausedAt: null };
    }));
  };

  const deleteTimer = (id) => {
    setTimers(prev => prev.filter(t => t.id !== id));
  };

  const openModal = (timer = null) => {
    setEditingTimer(timer);
    setIsModalOpen(true);
  };

  const saveTimer = (data) => {
    if (data.id) {
      setTimers(prev => prev.map(t => t.id === data.id ? { ...t, ...data } : t));
    } else {
      setTimers([...timers, { ...data, id: crypto.randomUUID(), isRunning: true, pausedAt: null, createdAt: Date.now() }]);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 p-8 sm:p-14 max-w-7xl mx-auto">
      <header className="mb-16 fade-in-up">
        <h1 className="text-4xl font-bold text-white tracking-tight">Countdowns</h1>
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mt-2">
          Your Event Collection
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {timers.map((timer) => (
          <div key={timer.id} className="fade-in-up">
            <TimerCard
              timer={{ ...timer, remainingSeconds: getTimeLeft(timer, Date.now()) }}
              onToggle={() => toggleTimer(timer.id)}
              onDelete={() => deleteTimer(timer.id)}
              onEdit={() => openModal(timer)}
            />
          </div>
        ))}

        {timers.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-3xl">
            <Plus className="w-10 h-10 text-zinc-400 mb-6" />
            <Button
              variant="outline"
              onClick={() => openModal()}
              className="border-zinc-700 text-zinc-200 hover:text-white rounded-xl"
            >
              Add Your First Event
            </Button>
          </div>
        )}
      </div>

      <div className="fixed bottom-10 right-10">
        <Button
          onClick={() => openModal()}
          size="icon"
          className="w-14 h-14 rounded-2xl bg-white text-black hover:bg-zinc-200 shadow-xl transition-all hover:scale-110 active:scale-95"
        >
          <Plus className="w-8 h-8" />
        </Button>
      </div>

      <TimerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={saveTimer}
        editingTimer={editingTimer}
      />
    </div>
  );
}

export default App;
