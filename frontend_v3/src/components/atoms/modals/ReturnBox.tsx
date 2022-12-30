import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import { Typography } from "@mui/material";
import CheckButton from "../buttons/CheckButton";
import { axiosReturn } from "../../../network/axios/axios.custom";
import { setUserCabinet } from "../../../redux/slices/userSlice";
import { useAppDispatch } from "../../../redux/hooks";
import { LentDto } from "../../../types/dto/lent.dto";

const BoxStyle = {
  wordBreak: "keep-all",
  position: "fixed" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "24rem",
  maxWidth: "70vw",
  bgcolor: "background.paper",
  border: 0,
  borderRadius: "1rem",
  outline: 0,
  boxShadow: 16,
  p: 3,
};

const HighlightBox = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  height: 6rem;
  padding: 0.75rem;
  box-sizing: border-box;
  justify-content: center;
  background-color: #fafafa;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
`;

const ButtonArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface ReturnBoxProps {
  // eslint-disable-next-line react/require-default-props
  handleClose: () => void;
  lentType: string | undefined;
  lentUser: LentDto[];
}

const ReturnBox = (props: ReturnBoxProps): JSX.Element => {
  const { handleClose, lentType, lentUser } = props;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = lentUser[0];
  const lentTime = dayjs(user.lent_time).format("YYYY/MM/DD HH:mm");

  const handleReturn = () => {
    axiosReturn()
      .then((response) => {
        dispatch(setUserCabinet(-1));
        navigate("/main");
      })
      .catch((error) => {
        console.error(error);
      });
    handleClose();
  };

  return (
    <Box sx={BoxStyle} className="ReturnBox">
      {lentType === "SHARE" && (
        <>
          <HighlightBox>
            <Typography color="red" align="center">
              🚨 주의 🚨
            </Typography>
            <Typography color="red" align="center">
              {user.intra_id} 님의 대여일:{" "}
            </Typography>
            <Typography color="red" align="center">
              {lentTime}
            </Typography>
          </HighlightBox>
          <Typography align="left">
            공유사물함 대여 후 {import.meta.env.VITE_SHARE_EARLY_RETURN_PERIOD}
            시간 이내에 반납 시,{" "}
            {import.meta.env.VITE_SHARE_EARLY_RETURN_PENALTY}시간 동안
            공유사물함 대여가 불가합니다.
          </Typography>
          <hr />
        </>
      )}
      <Typography
        id="modal-modal-title"
        align="center"
        variant="h6"
        component="h3"
        sx={{ mb: 1 }}
      >
        정말 반납하시겠습니까?
      </Typography>
      <ButtonArea className="ButtonArea">
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
  // eslint-disable-next-line react/default-props-match-prop-types
  handleClose: (): void => {},
};

export default ReturnBox;
