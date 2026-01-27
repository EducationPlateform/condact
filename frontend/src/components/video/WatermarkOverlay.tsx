import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

interface WatermarkOverlayProps {
  studentId: string;
  studentEmail: string;
  enabled?: boolean;
  opacity?: number;
  updateInterval?: number;
}

const WatermarkOverlay: React.FC<WatermarkOverlayProps> = ({
  studentId,
  studentEmail,
  enabled = true,
  opacity = 0.3,
  updateInterval = 5000,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Array<{ x: number; y: number; rotation: number }>>([]);

  useEffect(() => {
    if (!enabled || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const updateCanvasSize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    updateCanvasSize();

    // Generate random positions for watermarks
    const generatePositions = () => {
      const newPositions: Array<{ x: number; y: number; rotation: number }> = [];
      const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'];
      
      positions.forEach((pos) => {
        let x = 0;
        let y = 0;
        const rotation = Math.random() * 20 - 10; // Random rotation between -10 and 10 degrees

        switch (pos) {
          case 'top-left':
            x = 20 + Math.random() * 50;
            y = 20 + Math.random() * 50;
            break;
          case 'top-right':
            x = canvas.width - 200 - Math.random() * 50;
            y = 20 + Math.random() * 50;
            break;
          case 'bottom-left':
            x = 20 + Math.random() * 50;
            y = canvas.height - 80 - Math.random() * 50;
            break;
          case 'bottom-right':
            x = canvas.width - 200 - Math.random() * 50;
            y = canvas.height - 80 - Math.random() * 50;
            break;
          case 'center':
            x = canvas.width / 2 - 100 + (Math.random() * 100 - 50);
            y = canvas.height / 2 - 40 + (Math.random() * 100 - 50);
            break;
        }
        newPositions.push({ x, y, rotation });
      });
      setPositions(newPositions);
    };

    generatePositions();

    const drawWatermarks = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const timestamp = new Date().toLocaleString();

      positions.forEach((pos) => {
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate((pos.rotation * Math.PI) / 180);

        // Draw watermark text
        ctx.font = '14px Arial';
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.strokeStyle = `rgba(0, 0, 0, ${opacity * 0.5})`;
        ctx.lineWidth = 2;

        const text1 = studentId;
        const text2 = studentEmail;
        const text3 = timestamp;

        // Draw with stroke for better visibility
        ctx.strokeText(text1, 0, 15);
        ctx.fillText(text1, 0, 15);
        ctx.strokeText(text2, 0, 35);
        ctx.fillText(text2, 0, 35);
        ctx.strokeText(text3, 0, 55);
        ctx.fillText(text3, 0, 55);

        ctx.restore();
      });
    };

    drawWatermarks();

    // Update watermark positions and timestamp periodically
    const interval = setInterval(() => {
      generatePositions();
      drawWatermarks();
    }, updateInterval);

    // Handle window resize
    const handleResize = () => {
      updateCanvasSize();
      generatePositions();
      drawWatermarks();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [enabled, studentId, studentEmail, opacity, updateInterval, positions]);

  if (!enabled) return null;

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
};

export default WatermarkOverlay;
