import * as React from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import GuideBox from "./GuideBox";

export default function GuideModal(): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen} variant="contained" color="primary">
        Open modal
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <GuideBox />
        </div>
      </Modal>
    </div>
  );
}
