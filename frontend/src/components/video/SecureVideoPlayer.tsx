import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Button,
  Alert,
  Typography,
  CircularProgress,
} from '@mui/material';
import { PlayArrow, Lock } from '@mui/icons-material';
import ViewCounter from './ViewCounter';
import AccessCodeModal from './AccessCodeModal';
import WatermarkOverlay from './WatermarkOverlay';
import { accessService } from '../../services/accessService';
import { drmService } from '../../services/drmService';
import { securityService } from '../../services/securityService';
import { useScreenCaptureDetection } from '../../hooks/useScreenCaptureDetection';
import { useDrmPlayer, DrmConfig } from '../../hooks/useDrmPlayer';
import { useAuth } from '../../context/AuthContext';

interface SecureVideoPlayerProps {
  videoId: string;
  lectureId: string;
  maxViews: number;
  currentViews: number;
  onViewRecorded: () => void;
  useDrm?: boolean;
}

const SecureVideoPlayer: React.FC<SecureVideoPlayerProps> = ({
  videoId,
  lectureId,
  maxViews,
  currentViews,
  onViewRecorded,
  useDrm = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAccess, setHasAccess] = useState(currentViews < maxViews);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [viewRecorded, setViewRecorded] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [drmConfig, setDrmConfig] = useState<DrmConfig | null>(null);
  const { user } = useAuth();

  // Screen capture detection
  useScreenCaptureDetection({
    lectureId,
    videoId,
    enabled: true,
    onViolationDetected: async (type, details) => {
      try {
        await securityService.reportViolation(lectureId, videoId, type, details);
      } catch (err) {
        console.error('Failed to report violation:', err);
      }
    },
  });

  // Load DRM configuration if enabled
  useEffect(() => {
    if (useDrm && hasAccess && !drmConfig) {
      const loadDrmConfig = async () => {
        try {
          const config = await drmService.getDrmConfig(videoId);
          setDrmConfig(config.drmConfig);
        } catch (err: any) {
          console.error('Failed to load DRM config:', err);
          setError('Failed to load DRM configuration');
        }
      };
      loadDrmConfig();
    }
  }, [useDrm, hasAccess, videoId, drmConfig]);

  // Initialize DRM player if enabled
  const { player, isLoading: drmLoading, error: drmError } = useDrmPlayer(
    useDrm && drmConfig ? videoRef.current : null,
    useDrm && drmConfig ? drmConfig : null,
    (err) => {
      setError(`DRM Error: ${err.message}`);
    }
  );

  // Enhanced security: Disable right-click, F12, etc.
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      securityService.reportViolation(lectureId, videoId, 'DevTools', {
        method: 'contextMenu',
        timestamp: new Date().toISOString(),
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
        securityService.reportViolation(lectureId, videoId, 'DevTools', {
          method: 'keyboard',
          key: e.key,
          timestamp: new Date().toISOString(),
        });
      }
    };

    // Disable text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, [lectureId, videoId]);

  const handlePlay = async () => {
    if (!hasAccess) {
      setShowCodeModal(true);
      return;
    }

    if (viewRecorded) {
      if (videoRef.current) {
        videoRef.current.play();
      }
      return;
    }

    try {
      setLoading(true);
      await accessService.recordView(lectureId);
      setViewRecorded(true);
      onViewRecorded();

      // Set video source
      if (useDrm && drmConfig) {
        // DRM player will handle loading
        if (videoRef.current) {
          videoRef.current.play();
        }
      } else {
        // Regular video playback
        if (videoRef.current) {
          videoRef.current.src = `/api/videos/${videoId}/stream`;
          videoRef.current.play();
        }
      }
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to record view');
      setLoading(false);
    }
  };

  const handleCodeSuccess = () => {
    setHasAccess(true);
    setShowCodeModal(false);
  };

  if (!hasAccess && currentViews >= maxViews) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Lock sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          View Limit Reached
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          You have reached the maximum number of views for this lecture.
        </Typography>
        <Button variant="contained" onClick={() => setShowCodeModal(true)}>
          Redeem Access Code
        </Button>
        <AccessCodeModal
          open={showCodeModal}
          onClose={() => setShowCodeModal(false)}
          lectureId={lectureId}
          onSuccess={handleCodeSuccess}
        />
      </Paper>
    );
  }

  return (
    <Box>
      <ViewCounter currentViews={currentViews} maxViews={maxViews} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {(drmError || drmLoading) && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {drmLoading ? 'Loading DRM content...' : drmError?.message}
        </Alert>
      )}

      <Paper sx={{ position: 'relative', mt: 2 }} ref={containerRef}>
        <video
          ref={videoRef}
          controls
          style={{
            width: '100%',
            maxHeight: '600px',
            display: 'block',
          }}
          onPlay={handlePlay}
          playsInline
        />
        <WatermarkOverlay
          studentId={user?._id || ''}
          studentEmail={user?.email || ''}
          enabled={hasAccess && viewRecorded}
          opacity={0.3}
          updateInterval={5000}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: hasAccess && viewRecorded ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 1,
          }}
        >
          {loading ? (
            <CircularProgress color="primary" />
          ) : (
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrow />}
              onClick={handlePlay}
            >
              {hasAccess ? 'Start Watching' : 'Redeem Access Code'}
            </Button>
          )}
        </Box>
      </Paper>

      <AccessCodeModal
        open={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        lectureId={lectureId}
        onSuccess={handleCodeSuccess}
      />
    </Box>
  );
};

export default SecureVideoPlayer;
