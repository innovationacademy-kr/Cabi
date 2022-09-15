import { axiosReturn } from "../../../network/axios/axios.custom";
import { useNavigate } from "react-router-dom";
import CheckButton from "./../buttons/CheckButton";
import Box from "@mui/material/Box";
import styled from "@emotion/styled";

const BoxStyle = {
  position: "fixed" as const,
  display: "box",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "10rem",
  height: "6rem",
  bgcolor: "background.paper",
  border: 0,
  borderRadius: "1rem",
  outline: 0,
  boxShadow: 16,
  p: 4,
};

const ButtonArea = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface ReturnBoxProps {
  lent_id: number;
  handleClose: () => void;
}

const ReturnBox = (props: ReturnBoxProps): JSX.Element => {
  const { lent_id, handleClose } = props;

  const navigate = useNavigate();

  const handleReturn = () => {
    axiosReturn(lent_id)
      .then((response) => {
        navigate("/login");
      })
      .catch((error) => {
        console.error(error);
      });
    handleClose();
  };

  return (
    <Box sx={BoxStyle}>
      <p>정말 반납하시겠습니까?</p>
      <ButtonArea>
        <CheckButton
          color="secondary"
          variant="contained"
          content="취소"
          onClick={handleClose}
        />
        <CheckButton
          color="primary"
          variant="contained"
          content="반납"
          onClick={handleReturn}
        />
      </ButtonArea>
    </Box>
  );
};

ReturnBox.defaultProps = {
  handleClose: () => {
    console.log("handlClose");
  },
};

export default ReturnBox;
