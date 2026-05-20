import { useState, useCallback, MouseEvent } from 'react';

export interface UseVideoControlsReturn {
  isPlaying: boolean;
  showControls: boolean;
  handleWrapperClick: (e: MouseEvent<HTMLDivElement>) => void;
  handleVideoClick: (e: MouseEvent<HTMLVideoElement>) => void;
  setShowControls: (v: boolean) => void;
  setIsPlaying: (v: boolean) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const useVideoControls = (): UseVideoControlsReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleWrapperClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    handlePlay();
  };

  const handleVideoClick = (e: MouseEvent<HTMLVideoElement>) => {
    e.stopPropagation();
    if (videoRef.current) {
      const rect = videoRef.current.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      if (showControls && clickY > rect.height - 50) {
        return; // let native controls handle
      }
    }
    handlePlay();
  };

  return {
    isPlaying,
    showControls,
    handleWrapperClick,
    handleVideoClick,
    setShowControls,
    setIsPlaying,
    videoRef,
  };
};
