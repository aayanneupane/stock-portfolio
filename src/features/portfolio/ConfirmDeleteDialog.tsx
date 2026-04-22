import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useState } from 'react';

interface ConfirmDeleteDialogProps {
  open: boolean;
  stockLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteDialog({
  open,
  stockLabel,
  onClose,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Stock</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to remove {stockLabel} from your portfolio?
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={isDeleting}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="error" disabled={isDeleting}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
