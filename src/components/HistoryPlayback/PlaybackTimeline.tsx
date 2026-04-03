import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
interface PlaybackTimelineProps {
  progress: number;
  setProgress: (val: number | ((prev: number) => number)) => void;
  playing: boolean;
  setPlaying: (val: boolean | ((prev: boolean) => boolean)) => void;
  speed: number;
  setSpeed: (val: number) => void;
  historyPath: any[];
}
export function PlaybackTimeline({
  progress, setProgress, playing, setPlaying, speed, setSpeed, historyPath
}: PlaybackTimelineProps) {
  return (
    <div className="bg-white border-t border-slate-200 px-6 py-4 shrink-0">
      {}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          <span>08:00</span>
          <span>09:00</span>
          <span>10:00</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={e => { setProgress(Number(e.target.value)); setPlaying(false); }}
            className="w-full h-2 appearance-none rounded-full cursor-pointer"
            style={{
              background: `linear-gradient(to right, #1E40AF ${progress}%, #E2E8F0 ${progress}%)`,
              accentColor: '#1E40AF',
            }}
          />
          {}
          <div className="absolute top-0 left-0 right-0 h-2 pointer-events-none flex items-center">
            {historyPath.map((_, i) => {
              const pct = (i / (historyPath.length - 1)) * 100;
              return (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-white border border-slate-300"
                  style={{ left: `calc(${pct}% - 3px)` }}
                />
              );
            })}
          </div>
        </div>
      </div>
      {}
      <div className="flex items-center gap-3 justify-center">
        <button
          onClick={() => { setProgress(0); setPlaying(false); }}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <SkipBack size={18} />
        </button>
        <button
          onClick={() => setPlaying(p => !p)}
          className="w-10 h-10 rounded-xl text-white flex items-center justify-center shadow-md transition-colors"
          style={{ background: 'linear-gradient(135deg, #1E40AF, #2563EB)' }}
        >
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button
          onClick={() => { setProgress(100); setPlaying(false); }}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <SkipForward size={18} />
        </button>
        {}
        <div className="ml-4 flex items-center gap-2 border-l border-slate-200 pl-4">
          <span className="text-slate-500" style={{ fontSize: 12 }}>Speed:</span>
          {[0.5, 1, 2, 4].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${speed === s ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
              style={{ fontSize: 12 }}
            >
              {s}×
            </button>
          ))}
        </div>
        {}
        <div className="ml-auto text-slate-400" style={{ fontSize: 12 }}>
          {Math.round(progress)}% complete
        </div>
      </div>
    </div>
  );
}
