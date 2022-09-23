import * as React from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

interface GuideModalProps {
  box: JSX.Element;
  button: JSX.Element;
}

export default function GuideModal(props: GuideModalProps): JSX.Element {
  const { box, button } = props;
  const [open, setOpen] = React.useState(false);
  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);

  return (
    <div className="modalButton">
      <Button sx={{ padding: 0 }} onClick={handleOpen}>
        {button}
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
