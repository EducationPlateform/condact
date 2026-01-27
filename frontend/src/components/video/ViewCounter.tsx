import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Visibility } from '@mui/icons-material';

interface ViewCounterProps {
  currentViews: number;
  maxViews: number;
}

const ViewCounter: React.FC<ViewCounterProps> = ({ currentViews, maxViews }) => {
  const remainingViews = maxViews - currentViews;
  const color = remainingViews > 0 ? 'success' : 'error';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Visibility />
      <Typography variant="body2">
        Views: {currentViews} / {maxViews}
      </Typography>
      <Chip
        label={`${remainingViews} remaining`}
        color={color}
        size="small"
      />
    </Box>
  );
};

export default ViewCounter;
