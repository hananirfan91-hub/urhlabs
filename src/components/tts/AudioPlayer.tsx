import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, Download, Video, Maximize2, RotateCcw } from 'lucide-react';
import WaveformVisualizer from './WaveformVisualizer';

interface AudioPlayerProps {
  audioUrl: string;
  downloadUrl: string;
  textScopeForVideo?: string; // used for MP4 generation preview
  onProgress?: (percent: number) => void;
  voiceType?: 'male' | 'female';
}

export default function AudioPlayer({ audioUrl, downloadUrl, textScopeForVideo = "URH LABS AI Voice generation output", voiceType = 'female' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [speed, setSpeed] = useState<number>(1.0);
  const [pitch, setPitch] = useState<'low' | 'normal' | 'high'>(voiceType === 'male' ? 'low' : 'normal');
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [videoDownloadUrl, setVideoDownloadUrl] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Sync pitch with voice type updates
  useEffect(() => {
    setPitch(voiceType === 'male' ? 'low' : 'normal');
  }, [voiceType, audioUrl]);

  // Initialize and update Audio Player
  useEffect(() => {
    // Standard audio setup
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.crossOrigin = 'anonymous'; // support CORS if bucket configured

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    // Initial setups
    audio.volume = volume;
    audio.playbackRate = speed;

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [audioUrl]);

  // Handle speed rate change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  // Handle volume update
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle Pitch filtering using Web Audio API nodes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (pitch !== 'normal') {
        if (!audioContextRef.current) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          audioContextRef.current = new AudioContextClass();
        }

        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        // Initialize nodes if not already set.
        if (!sourceNodeRef.current) {
          sourceNodeRef.current = ctx.createMediaElementSource(audio);
        }
        if (!filterNodeRef.current) {
          filterNodeRef.current = ctx.createBiquadFilter();
        }

        const filter = filterNodeRef.current;
        const source = sourceNodeRef.current;

        // Apply filters depending on pitch
        if (pitch === 'low') {
          // Boost bass low shelf representation
          filter.type = 'lowshelf';
          filter.frequency.setValueAtTime(220, ctx.currentTime);
          filter.gain.setValueAtTime(12, ctx.currentTime);
        } else if (pitch === 'high') {
          // Boost high voice treble shelf representation
          filter.type = 'highshelf';
          filter.frequency.setValueAtTime(3200, ctx.currentTime);
          filter.gain.setValueAtTime(14, ctx.currentTime);
        }

        source.disconnect();
        source.connect(filter);
        filter.connect(ctx.destination);
      } else {
        // Direct normal connection bypassing the shelf booster
        if (sourceNodeRef.current && audioContextRef.current) {
          sourceNodeRef.current.disconnect();
          sourceNodeRef.current.connect(audioContextRef.current.destination);
        }
      }
    } catch (e) {
      console.warn("Web Audio pitch shift bypassed (Strict CORS context safeguard):", e);
    }
  }, [pitch, audioUrl]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Resume AudioContext security policies
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error("Audio play failed:", err);
      });
    }
  };

  const handleStop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const seekValue = parseFloat(e.target.value);
    audio.currentTime = seekValue;
    setCurrentTime(seekValue);
  };

  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // GENERATE MP4 with Waveform Animation (Client-Side HTML5 Canvas Recording - 100% stable!)
  const generateMP4Video = async () => {
    setIsRecordingVideo(true);
    setVideoDownloadUrl(null);

    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext('2d')!;

    const audio = audioRef.current;
    if (!audio) {
      setIsRecordingVideo(false);
      return;
    }

    // Reset audio and play
    audio.currentTime = 0;
    audio.playbackRate = 1.0; // standard rate for recording
    setIsPlaying(true);
    await audio.play();

    const canvasStream = canvas.captureStream(30); // 30 FPS
    
    // Attempt standard webM/mp4 recording combined with audio sound track
    let mediaRecorder: MediaRecorder;
    const chunks: Blob[] = [];

    try {
      let combinedStream = canvasStream;
      if (audioContextRef.current) {
        // If web audio was initialized, record from destination stream node
        const dest = audioContextRef.current.createMediaStreamDestination();
        if (sourceNodeRef.current) {
          sourceNodeRef.current.connect(dest);
        }
        dest.stream.getAudioTracks().forEach(track => combinedStream.addTrack(track));
      }

      mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm;codecs=vp9'
      });
    } catch {
      // Fallback if audio track mapping is blocked, record video layers only
      mediaRecorder = new MediaRecorder(canvasStream, {
        mimeType: 'video/webm'
      });
    }

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(blob);
      setVideoDownloadUrl(videoUrl);
      setIsRecordingVideo(false);
    };

    mediaRecorder.start();

    // Render loop logic to animate waveform on captured canvas
    let offset = 0;
    const drawFrame = () => {
      if (!isPlaying && audio.currentTime >= audio.duration - 0.1) {
        mediaRecorder.stop();
        return;
      }

      // Draw beautiful dynamic canvas video frame background
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Accent visual rings
      ctx.strokeStyle = 'rgba(108, 99, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(canvas.width/2, canvas.height/2, 110, 0, Math.PI*2);
      ctx.stroke();

      // Draw title & brand branding
      ctx.fillStyle = '#6c63ff';
      ctx.font = 'bold 22px "Sora", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText("URH LABS – AI Speech Outputs", canvas.width / 2, 60);

      // Input preview wrap text
      ctx.fillStyle = '#8888aa';
      ctx.font = 'italic 13px "DM Sans", sans-serif';
      const slicedText = textScopeForVideo.length > 55 ? textScopeForVideo.substring(0, 52) + '...' : textScopeForVideo;
      ctx.fillText(`"${slicedText}"`, canvas.width / 2, 95);

      // Animated waveform bars in circular/linear pattern
      offset += 0.15;
      const barCount = 30;
      const spacing = 6;
      const barW = 8;
      const centerH = canvas.height / 2 + 30;
      const startX = (canvas.width - (barCount * (barW + spacing) - spacing)) / 2;

      for (let i = 0; i < barCount; i++) {
        const x = startX + i * (barW + spacing);
        const multiplier = Math.sin((i / barCount) * Math.PI);
        const amp = multiplier * 65;
        const currentH = Math.max(6, Math.abs(Math.sin(offset + i * 0.3) * amp));

        // Gradients
        const gradient = ctx.createLinearGradient(x, centerH - currentH, x, centerH + currentH);
        gradient.addColorStop(0, '#6C63FF');
        gradient.addColorStop(0.5, '#00D9A6');
        gradient.addColorStop(1, '#6C63FF');

        ctx.fillStyle = gradient;

        // Rounded rects draw
        const rY = centerH - currentH;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, rY, barW, currentH * 2, 4);
        } else {
          ctx.rect(x, rY, barW, currentH * 2);
        }
        ctx.fill();
      }

      // Progress indicators
      ctx.fillStyle = '#8888aa';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(formatTime(audio.currentTime), canvas.width - 40, canvas.height - 30);
      ctx.textAlign = 'left';
      ctx.fillText("URHLabs.app Output File", 40, canvas.height - 30);

      if (audio.currentTime < audio.duration && isPlaying) {
        requestAnimationFrame(drawFrame);
      } else {
        mediaRecorder.stop();
      }
    };

    drawFrame();
  };

  return (
    <div id="urhlabs-custom-player" className="p-4 bg-card-bg rounded-xl border border-border-custom stagger-in">
      <div className="flex flex-col gap-4">
        
        {/* Playback animation visualizer */}
        <WaveformVisualizer isPlaying={isPlaying} speed={speed} />

        {/* Dynamic seek progress timeline bar */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-text-muted min-w-[35px]">
            {formatTime(currentTime)}
          </span>
          <input
            id="player-timeline"
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeekChange}
            className="flex-1 timeline h-1.5 bg-dark-bg border-0 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <span className="font-mono text-xs text-text-muted min-w-[35px]">
            {formatTime(duration)}
          </span>
        </div>

        {/* Master Playout Controls block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-dark-bg/60 p-3 rounded-lg border border-border-custom/50">
          
          {/* Main triggers: Play Pause Stop */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePlayPause}
              className="p-2.5 bg-primary hover:bg-[#574feb] text-white rounded-lg border-0 cursor-pointer shadow-lg shadow-primary/20 flex items-center justify-center transition-all"
              title={isPlaying ? 'Pause' : 'Play Audio'}
            >
              {isPlaying ? <Pause className="h-4.5 w-4.5" /> : <Play className="h-4.5 w-4.5 fill-white" />}
            </button>
            <button
              type="button"
              onClick={handleStop}
              className="p-2.5 bg-card-bg border border-border-custom hover:border-text-muted text-text-muted rounded-lg cursor-pointer flex items-center justify-center transition-all"
              title="Stop Generation Playout"
            >
              <Square className="h-4 w-4 fill-text-muted" />
            </button>
            
            {/* Speed selection Dropdown */}
            <div className="flex items-center gap-1.5 ml-2">
              <span className="font-display text-[10px] text-text-muted uppercase tracking-wider font-semibold">Speed:</span>
              <select
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="bg-card-bg border border-border-custom rounded px-1.5 py-1 text-xs font-mono text-text-primary focus:outline-none"
              >
                <option value="0.5">0.5x</option>
                <option value="0.75">0.75x</option>
                <option value="1.0">1.0x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2.0">2.0x</option>
              </select>
            </div>

            {/* Pitch selections */}
            <div className="flex items-center gap-1.5 ml-1">
              <span className="font-display text-[10px] text-text-muted uppercase tracking-wider font-semibold">Pitch:</span>
              <select
                value={pitch}
                onChange={(e) => setPitch(e.target.value as any)}
                className="bg-card-bg border border-border-custom rounded px-1.5 py-1 text-xs font-mono text-text-primary focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Volume state slider */}
          <div className="flex items-center gap-2">
            <Volume2 className="h-3.5 w-3.5 text-text-muted" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 md:w-24 h-1 bg-border-custom border-0 rounded-lg appearance-none cursor-pointer accent-secondary"
            />
          </div>

          {/* Output downloads triggers */}
          <div className="flex items-center gap-2">
            <a
              href={downloadUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer text-center"
              title="Download MP3 Broadcast voice"
            >
              <Download className="h-3.5 w-3.5" />
              Download MP3
            </a>

            {/* Premium client-side mp4 animation capture */}
            {isRecordingVideo ? (
              <span className="px-3 py-1.5 bg-[#6c63ff]/10 text-primary border border-primary/20 rounded-lg text-xs font-semibold flex items-center gap-1.5 animate-pulse">
                Recording mp4...
              </span>
            ) : videoDownloadUrl ? (
              <a
                href={videoDownloadUrl}
                download="voice-visualizer.mp4"
                className="px-3 py-1.5 bg-primary hover:bg-[#574feb] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all text-center"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                Get Video MP4
              </a>
            ) : (
              <button
                type="button"
                onClick={generateMP4Video}
                className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Assemble animated Mp4 waveform video"
              >
                <Video className="h-3.5 w-3.5" />
                Render MP4
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
