import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>Konfirmasi</DialogHeader>
      <DialogBody>
        Apakah yakin ini akan dihapus?
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={onClose}
          className="mr-1"
        >
          <span>Batal</span>
        </Button>
        <Button variant="gradient" color="black" onClick={onConfirm}>
          <span>Hapus</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
