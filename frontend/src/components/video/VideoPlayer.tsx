import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Button,
  Alert,
  Typography,
} from '@mui/material';
import { PlayArrow, Lock } from '@mui/icons-material';
import ViewCounter from './ViewCounter';
import AccessCodeModal from './AccessCodeModal';
import { accessService } from '../../services/accessService';

interface VideoPlayerProps {
  videoUrl: string;
  lectureId: string;
  maxViews: number;
  currentViews: number;
  onViewRecorded: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  lectureId,
  maxViews,
  currentViews,
  onViewRecorded,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasAccess, setHasAccess] = useState(currentViews < maxViews);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [viewRecorded, setViewRecorded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable F12 and other dev tools shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
      await accessService.recordView(lectureId);
      setViewRecorded(true);
      onViewRecorded();
      if (videoRef.current) {
        videoRef.current.play();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to record view');
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
        <Button
          variant="contained"
          onClick={() => setShowCodeModal(true)}
        >
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

      <Paper sx={{ position: 'relative', mt: 2 }}>
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          style={{
            width: '100%',
            maxHeight: '600px',
          }}
          onPlay={handlePlay}
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
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrow />}
            onClick={handlePlay}
          >
            {hasAccess ? 'Start Watching' : 'Redeem Access Code'}
          </Button>
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

export default VideoPlayer;
