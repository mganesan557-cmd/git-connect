import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

const PlaybackControls = ({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedChange,
}: PlaybackControlsProps) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1">
        <Button size="icon" variant="outline" onClick={onReset} className="h-7 w-7 rounded-lg">
          <RotateCcw className="h-3 w-3" />
        </Button>
        <Button size="icon" variant="outline" onClick={onStepBackward} disabled={currentStep <= 0} className="h-7 w-7 rounded-lg">
          <SkipBack className="h-3 w-3" />
        </Button>
        <Button
          size="icon"
          onClick={isPlaying ? onPause : onPlay}
          disabled={currentStep >= totalSteps - 1 && !isPlaying}
          className="h-7 w-7 rounded-lg"
        >
          {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        </Button>
        <Button size="icon" variant="outline" onClick={onStepForward} disabled={currentStep >= totalSteps - 1} className="h-7 w-7 rounded-lg">
          <SkipForward className="h-3 w-3" />
        </Button>
      </div>

      <span className="text-[10px] font-mono text-muted-foreground ml-1">
        {totalSteps > 0 ? `${currentStep + 1}/${totalSteps}` : "0/0"}
      </span>

      <div className="flex items-center gap-1.5 ml-auto">
        <span className="text-[10px] font-mono text-muted-foreground">Speed</span>
        <input
          type="range"
          min="0.25"
          max="3"
          step="0.25"
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="w-16 h-1 accent-foreground"
        />
        <span className="text-[10px] font-mono text-muted-foreground w-8">{speed}x</span>
      </div>
    </div>
  );
};

export default PlaybackControls;
