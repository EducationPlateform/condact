import { useEffect, useRef, useCallback } from 'react';
import { securityService } from '../services/securityService';

export interface ScreenCaptureDetectionOptions {
  lectureId: string;
  videoId?: string;
  enabled?: boolean;
  onViolationDetected?: (type: string, details: any) => void;
}

export const useScreenCaptureDetection = ({
  lectureId,
  videoId,
  enabled = true,
  onViolationDetected,
}: ScreenCaptureDetectionOptions) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previousCanvasHashRef = useRef<string | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastVisibilityChangeRef = useRef<number>(Date.now());

  const reportViolation = useCallback(
    async (type: string, details: any) => {
      try {
        await securityService.reportViolation(lectureId, videoId || null, type, details);
        onViolationDetected?.(type, details);
      } catch (error) {
        console.error('Failed to report violation:', error);
      }
    },
    [lectureId, videoId, onViolationDetected]
  );

  // Detect getDisplayMedia (screen sharing/recording)
  useEffect(() => {
    if (!enabled) return;

    const originalGetDisplayMedia = navigator.mediaDevices?.getDisplayMedia;
    if (!originalGetDisplayMedia) return;

    navigator.mediaDevices.getDisplayMedia = async function (constraints) {
      await reportViolation('ScreenRecording', {
        method: 'getDisplayMedia',
        constraints,
        timestamp: new Date().toISOString(),
      });
      // Still allow the call but log it
      return originalGetDisplayMedia.call(this, constraints);
    };

    return () => {
      if (originalGetDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia = originalGetDisplayMedia;
      }
    };
  }, [enabled, reportViolation]);

  // Detect Print Screen key
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Print Screen key (different codes for different browsers)
      if (
        e.key === 'PrintScreen' ||
        (e.ctrlKey && e.key === 'Print') ||
        (e.keyCode === 44) // Print Screen key code
      ) {
        e.preventDefault();
        reportViolation('Screenshot', {
          method: 'printScreen',
          key: e.key,
          timestamp: new Date().toISOString(),
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, reportViolation]);

  // Detect clipboard access (possible screenshot paste)
  useEffect(() => {
    if (!enabled) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            reportViolation('Screenshot', {
              method: 'clipboardPaste',
              type: items[i].type,
              timestamp: new Date().toISOString(),
            });
          }
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [enabled, reportViolation]);

  // Detect tab visibility changes (possible screenshot when tab hidden)
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        lastVisibilityChangeRef.current = Date.now();
      } else {
        // If tab was hidden for a very short time, might be screenshot
        const hiddenDuration = Date.now() - lastVisibilityChangeRef.current;
        if (hiddenDuration > 0 && hiddenDuration < 500) {
          reportViolation('TabSwitch', {
            method: 'visibilityChange',
            hiddenDuration,
            timestamp: new Date().toISOString(),
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [enabled, reportViolation]);

  // Canvas fingerprinting for screenshot detection
  useEffect(() => {
    if (!enabled) return;

    // Create hidden canvas for fingerprinting
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvasRef.current = canvas;

    // Draw unique pattern
    ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`ID:${lectureId}`, 10, 30);

    const getCanvasHash = (): string => {
      return canvas.toDataURL();
    };

    previousCanvasHashRef.current = getCanvasHash();

    // Periodically check canvas for changes (screenshot detection)
    detectionIntervalRef.current = setInterval(() => {
      const currentHash = getCanvasHash();
      if (previousCanvasHashRef.current && currentHash !== previousCanvasHashRef.current) {
        // Canvas changed unexpectedly - possible screenshot
        reportViolation('Screenshot', {
          method: 'canvasFingerprinting',
          timestamp: new Date().toISOString(),
        });
      }
      previousCanvasHashRef.current = currentHash;
    }, 2000); // Check every 2 seconds

    // Make canvas visible but off-screen for detection
    canvas.style.position = 'fixed';
    canvas.style.top = '-9999px';
    canvas.style.left = '-9999px';
    document.body.appendChild(canvas);

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, [enabled, lectureId, reportViolation]);

  // Detect dev tools
  useEffect(() => {
    if (!enabled) return;

    let devToolsOpen = false;
    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;

      if (widthThreshold || heightThreshold) {
        if (!devToolsOpen) {
          devToolsOpen = true;
          reportViolation('DevTools', {
            method: 'windowSize',
            timestamp: new Date().toISOString(),
          });
        }
      } else {
        devToolsOpen = false;
      }
    };

    const interval = setInterval(checkDevTools, 1000);
    return () => clearInterval(interval);
  }, [enabled, reportViolation]);

  // Detect right-click context menu (already handled in VideoPlayer, but log here too)
  useEffect(() => {
    if (!enabled) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      reportViolation('DevTools', {
        method: 'contextMenu',
        timestamp: new Date().toISOString(),
      });
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [enabled, reportViolation]);
};
