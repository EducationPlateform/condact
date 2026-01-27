import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { accessService } from '../../services/accessService';

interface AccessCodeModalProps {
  open: boolean;
  onClose: () => void;
  lectureId: string;
  onSuccess: () => void;
}

const AccessCodeModal: React.FC<AccessCodeModalProps> = ({
  open,
  onClose,
  lectureId,
  onSuccess,
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Please enter an access code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await accessService.redeemCode(lectureId, code.toUpperCase());
      setCode('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to redeem access code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Redeem Access Code</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Access Code"
          fullWidth
          variant="outlined"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="LECTURE-XXXX-XXXX"
          sx={{ mt: 2 }}
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Redeem'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccessCodeModal;
