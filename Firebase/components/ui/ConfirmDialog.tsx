"use client";

import * as React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalContent,
  Button,
} from "@heroui/react";

interface ConfirmDialogProps {
  onClose?: () => void;
  onConfirm: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  message: string;
  deleteText?: string;
  alert?: React.ElementType | null;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  onClose,
  onConfirm,
  open,
  setOpen,
  title,
  message,
  deleteText = "Delete",
  alert = null,
}) => {
  const handleClose = () => {
    setOpen(false);
    if (typeof onClose === "function") {
      onClose();
    }
  };

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              {alert && React.createElement(alert)}
              <p>{message}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="success" variant="light" onPress={handleClose}>
                Go Back
              </Button>
              <Button color="danger" onPress={onConfirm}>
                {deleteText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmDialog;
