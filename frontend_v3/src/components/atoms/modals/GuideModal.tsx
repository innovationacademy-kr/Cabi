import * as React from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

interface GuideModalProps {
  box: JSX.Element;
  ModalButton: () => JSX.Element;
}

export default function GuideModal(props: GuideModalProps): JSX.Element {
  const { box, ModalButton } = props;
  const [open, setOpen] = React.useState(false);
  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>
        <ModalButton />
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>{React.cloneElement(box, { handleClose })}</div>
      </Modal>
    </div>
  );
}
