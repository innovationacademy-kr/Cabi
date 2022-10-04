import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import styled from "@emotion/styled";
import { axiosLentId } from "../../../network/axios/axios.custom";
import CheckButton from "../buttons/CheckButton";
import { UserDto } from "../../../types/dto/user.dto";
import { useAppDispatch } from "../../../redux/hooks";
import { setUserCabinet } from "../../../redux/slices/userSlice";

const LentBoxContainer = styled.div``;

const BoxStyle = {
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
  p: 4,
};

const CenterAlignStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

// TODO:
// cabinetInfo는 API로 받아와야 함
const cabinetInfo = {
  cabinet_id: 0,
  cabinet_num: 0,
  location: "새롬관",
  floor: 2,
  section: "OA",
  activation: false,
};

// XXX: cabinet_id, isLentAble
// cabinet_id: 모달이 띄워지는 시점에 사용자가 누른 사물함의 id입니다.
// 이것도 리덕스에 저장해서 사용해야 할까요? 아니면 props로 넘겨주는 게 나을까요?
// isLentable: 현재 접속한 사용자가 새 사물함을 대여가능한 상태인지 여부를 나타내는 값입니다.
// 리덕스에 저장 후 Selector로 가져와서 사용하게 될 것 같습니다.

interface LentBoxProps {
  // eslint-disable-next-line react/require-default-props
  handleClose: () => void;
  cabinet_number: number;
  cabinet_id: number;
  lender: UserDto[];
  cabinet_type: string;
  isLentAble: boolean;
}

const LentBox = (props: LentBoxProps): JSX.Element => {
  const {
    handleClose,
    isLentAble,
    cabinet_number,
    lender,
    cabinet_type,
    cabinet_id,
  } = props;
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleCheckClick = (): void => {
    setChecked(!checked);
  };

  const handleLent = (): void => {
    axiosLentId(cabinet_id)
      .then(() => {
        dispatch(setUserCabinet(cabinet_id));
        navigate("/Lent");
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
    handleClose();
  };

  const sharedCabinetMessage: string[] = [
    "대여기간은 3인이 모두 공유하는 순간부터 +45일 입니다.",
    "대여 후 72시간 이내 취소(반납) 시, 72시간의 대여 불가 패널티가 적용됩니다.",
    "'내 사물함' 페이지의 메모 내용은 공유 인원끼리 공유됩니다.",
    "이용 중 귀중품 분실 및 메모 내용의 유출에 책임지지 않습니다.",
  ];
  const personalCabinetMessage: string[] = [
    "대여기간은 +30일 입니다.",
    "이용 중 귀중품 분실 및 메모 내용의 유출에 책임지지 않습니다.",
  ];

  const LentAble: JSX.Element = (
    <Box sx={BoxStyle}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        [{cabinet_number}]번 사물함을 대여합니다.
      </Typography>
      {(cabinet_type === "SHARE"
        ? sharedCabinetMessage
        : personalCabinetMessage
      ).map((message: string, i: number) => (
        <Typography
          key={i}
          id="modal-modal-description"
          sx={{ mt: 2 }}
          align="left"
        >
          {message}
        </Typography>
      ))}
      {cabinet_type === "SHARE" && lender?.length > 0 && (
        <>
          <p>대여자 목록</p>
          {lender.map((item) => (
            <p>{item.intra_id}</p>
          ))}
        </>
      )}
      <FormGroup sx={CenterAlignStyle}>
        <FormControlLabel
          control={<Checkbox onClick={handleCheckClick} />}
          label="알겠습니다. 대여할게요!"
        />
        <div>
          <CheckButton
            color="secondary"
            variant="contained"
            content="취소"
            onClick={handleClose}
          />
          <CheckButton
            color="primary"
            variant="contained"
            content="대여"
            isChecked={checked}
            onClick={handleLent}
          />
        </div>
      </FormGroup>
    </Box>
  );

  const LentUnableContent = "현재 대여가 불가능한 사물함입니다";
  const LentUnable: JSX.Element = (
    <Box sx={BoxStyle}>
      <Typography
        id="modal-modal-title"
        variant="h6"
        component="h2"
        align="center"
      >
        {LentUnableContent}
      </Typography>
      <div style={CenterAlignStyle}>
        <CheckButton
          color="primary"
          variant="contained"
          content="확인"
          onClick={handleClose}
        />
      </div>
    </Box>
  );

  return (
    <LentBoxContainer>{isLentAble ? LentAble : LentUnable}</LentBoxContainer>
  );
};

LentBox.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  handleClose: () => {
    console.log("closed");
  },
};

export default LentBox;
