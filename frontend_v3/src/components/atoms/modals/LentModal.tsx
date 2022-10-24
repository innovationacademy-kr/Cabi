import React, { useState } from "react";
import styled from "@emotion/styled";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { UserDto } from "../../../types/dto/user.dto";
import CheckButton from "../buttons/CheckButton";

const ModalBox = styled.div`
  position: fixed;
  top: 50%;
  left: calc(50% - 270px);
  transform: translate(-50%, -50%);
  width: 15rem;
  height: ${(props): string =>
    props.typeof === "SHARE" ? `${20 + (props.results || 1) * 2}rem` : `15rem`};
  background-color: white;
  outline: 0;
  boxshadow: 16;
  border-radius: 1rem;
  padding: 0.5rem;
`;

interface LentModalProps {
  handleClose: () => void;
  cabinet_number: number;
  lender: UserDto[];
  cabinet_type: string;
}

const LentModal = (props: LentModalProps): JSX.Element => {
  const { handleClose, cabinet_number, lender, cabinet_type } = props;
  const [checked, setChecked] = useState(false);

  const handleCheck = (): void => {
    setChecked(!checked);
  };
  return (
    <ModalBox typeof={cabinet_type} results={lender.length}>
      <p>[{cabinet_number}]번 사물함을 대여합니다.</p>
      <p>대여기간은 +${import.meta.env.VITE_PRIVATE_LENT_PERIOD}일 입니다.</p>
      <p>이용 중 귀중품 분실에 책임지지 않습니다.</p>
      {cabinet_type === "SHARE" && (
        <>
          <p>대여자 목록</p>
          {lender.map((item) => (
            <p>{item.intra_id}</p>
          ))}
        </>
      )}
      <FormGroup>
        <FormControlLabel
          control={<Checkbox onClick={handleCheck} />}
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
            onClick={handleClose}
          />
        </div>
      </FormGroup>
    </ModalBox>
  );
};

export default LentModal;
