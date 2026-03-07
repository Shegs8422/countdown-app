import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const TimerModal = ({ isOpen, onClose, onSave, editingTimer }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState(undefined);
  const [time, setTime] = useState('12:00');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingTimer && isOpen) {
      setName(editingTimer.name);
      const targetDate = new Date(editingTimer.targetTimestamp);
      setDate(targetDate);
      setTime(format(targetDate, 'HH:mm'));
      setDescription(editingTimer.description || '');
    } else if (isOpen) {
      setName('');
      setDate(undefined);
      setTime('12:00');
      setDescription('');
    }
  }, [editingTimer, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !date || !time) return;

    const [hours, minutes] = time.split(':').map(Number);
    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes, 0, 0);

    const timestamp = combinedDate.getTime();
    const duration = Math.floor((timestamp - Date.now()) / 1000);
    
    onSave({
      name,
      targetTimestamp: timestamp,
      duration: duration > 0 ? duration : 0,
      description,
      id: editingTimer?.id
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-zinc-900 border-zinc-800 rounded-3xl gap-6 focus:outline-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            {editingTimer ? 'Edit Event' : 'New Event'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Event Name</Label>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What are we counting down to?"
              className="bg-zinc-800/50 border-zinc-800 rounded-2xl h-12 px-4 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-zinc-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-zinc-800/50 border-zinc-800 rounded-2xl h-12 px-4 hover:bg-zinc-800/70 hover:text-white",
                      !date && "text-zinc-600"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-zinc-400" />
                    {date ? format(date, "PPP") : <span>Set Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800 rounded-xl" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="p-3 text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Time</Label>
              <Input
                required
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-zinc-800/50 border-zinc-800 rounded-2xl h-12 px-4 text-white focus-visible:ring-1 focus-visible:ring-zinc-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Notes</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional notes..."
              className="bg-zinc-800/50 border-zinc-800 rounded-2xl px-4 py-3 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-zinc-700 min-h-[100px] resize-none"
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={!name || !date}
              className="w-full bg-white text-zinc-950 font-bold h-12 rounded-2xl hover:bg-zinc-200 active:scale-95 transition-all disabled:opacity-50"
            >
              {editingTimer ? 'Save Changes' : 'Create Timer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TimerModal;
