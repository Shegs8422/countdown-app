import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Trash2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

const TimerCard = ({ timer, onToggle, onDelete, onEdit }) => {
  const { name, remainingSeconds, isRunning, description } = timer;
  
  const getStatus = () => {
    if (remainingSeconds < 3600) return 'Urgent';
    if (remainingSeconds < 86400) return 'Soon';
    return 'Upcoming';
  };

  const status = getStatus();

  const statusStyles = {
    'Urgent': 'text-red-500 bg-red-500',
    'Soon': 'text-amber-400 bg-amber-400',
    'Upcoming': 'text-emerald-400 bg-emerald-400'
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={cn(
      "relative border-border bg-card/50 backdrop-blur-sm transition-all hover:scale-[1.01] shadow-lg group",
      status === 'Urgent' && "animate-pulse-subtle"
    )}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-1">
            <Badge variant="outline" className={cn("border-none px-0 text-[10px] font-black uppercase tracking-widest", statusStyles[status].split(' ')[0])}>
              {status}
            </Badge>
            <span className="text-[13px] font-bold text-zinc-400 uppercase tracking-wider">{name}</span>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8 text-zinc-500 hover:text-white">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-zinc-500 hover:text-red-400">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center py-6">
          <span className={cn(
            "tabular-nums font-black text-6xl tracking-tighter transition-colors duration-500",
            isRunning ? "text-white" : "text-zinc-700"
          )}>
            {formatTime(remainingSeconds)}
          </span>
          {description && (
            <p className="mt-4 text-xs text-zinc-500 text-center line-clamp-2 max-w-[200px]">
              {description}
            </p>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <Button 
            onClick={onToggle}
            size="icon"
            className={cn(
              "w-14 h-14 rounded-2xl transition-all active:scale-95 shadow-md",
              isRunning 
                ? "bg-zinc-800 text-white/50 hover:text-white" 
                : `${statusStyles[status].split(' ')[1]} text-black`
            )}
          >
            {isRunning ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current ml-1" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimerCard;
