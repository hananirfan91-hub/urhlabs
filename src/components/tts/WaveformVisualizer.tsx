import { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  isPlaying: boolean;
  speed?: number;
}

export default function WaveformVisualizer({ isPlaying, speed = 1.0 }: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI screens
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    observer.observe(canvas);

    let offset = 0;
    const barCount = 42;
    const barHeights = Array.from({ length: barCount }, () => Math.random() * 20 + 5);

    const draw = () => {
      if (!canvas || !ctx) return;
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, w, h);

      const spacing = 4;
      const totalBarWidth = (w - spacing * (barCount - 1));
      const barWidth = totalBarWidth / barCount;

      offset += isPlaying ? 0.15 * speed : 0.02;

      for (let i = 0; i < barCount; i++) {
        // Calculate a nice symmetric wave
        const multiplier = Math.sin((i / barCount) * Math.PI);
        let currentHeight = barHeights[i];

        if (isPlaying) {
          // Dynamic swing when audio is active
          const noise = Math.sin(offset + i * 0.4) * Math.cos(offset * 0.8 + i * 0.1);
          currentHeight = multiplier * (h * 0.72) + noise * 12;
          currentHeight = Math.max(4, Math.min(h * 0.85, currentHeight));
        } else {
          // Low quiet idle pulse
          const idleNoise = Math.sin(offset + i * 0.1) * 3;
          currentHeight = multiplier * 6 + 2 + idleNoise;
          currentHeight = Math.max(3, currentHeight);
        }

        const x = i * (barWidth + spacing);
        const y = (h - currentHeight) / 2;

        // Gradient coloring combining Electric Violet and Cyber Teal
        const gradient = ctx.createLinearGradient(0, y, 0, y + currentHeight);
        gradient.addColorStop(0, '#6C63FF'); // Violet
        gradient.addColorStop(1, '#00D9A6'); // Teal

        ctx.fillStyle = gradient;
        
        // Draw round-ended bars
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth, currentHeight, barWidth / 2);
        } else {
          ctx.rect(x, y, barWidth, currentHeight);
        }
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      observer.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, speed]);

  return (
    <div id="visualizer-container" className="w-full h-16 bg-dark-bg/40 rounded-lg p-2 border border-border-custom/50 flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
