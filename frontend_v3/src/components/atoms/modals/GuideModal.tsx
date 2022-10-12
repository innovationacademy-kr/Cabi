import * as React from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import CabinetStatus from "../../../types/enum/cabinet.status.enum";

interface GuideModalProps {
  box: JSX.Element;
  button: JSX.Element;
  status?: CabinetStatus;
}

const GuideModal = (props: GuideModalProps): JSX.Element => {
  const { box, button, status } = props;
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);

  const handleOpen = (): void => {
    if (box.props.cabinet_id === user?.cabinet_id) navigate("/lent");
    switch (status) {
      case CabinetStatus.BANNED:
        alert("🚨 사용 불가능한 사물함입니다 🚨");
        break;
      case CabinetStatus.BROKEN:
        alert("🚨 고장난 사물함입니다 🚨");
        break;
      case CabinetStatus.SET_EXPIRE_FULL:
        alert("🚨 대여 완료 된 사물합입니다 🚨");
        break;
      case CabinetStatus.EXPIRED:
        alert("🚨 대여 완료 된 사물합입니다 🚨");
        break;
      default:
        setOpen(true);
    }
  };
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
};

GuideModal.defaultProps = {
  status: CabinetStatus.AVAILABLE,
};

export default GuideModal;
