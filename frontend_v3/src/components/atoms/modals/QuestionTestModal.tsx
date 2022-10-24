/* eslint-disable */
import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

// TODO: gyuwlee(?)
// 본 테스트 모달 제거하고, QuestionButton 눌렀을 때 나올 모달창 구현

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

interface TestModalProps {
  open: boolean;
  handleClick: () => void;
}

export default function TestModal(props: TestModalProps) {
  return (
    <BootstrapDialog
      onClose={props.handleClick}
      aria-labelledby="customized-dialog-title"
      open={props.open}
    >
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={props.handleClick}
      >
        🗄 42cabi 이용 안내서
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          - 1인 당 1개의 사물함을 대여할 수 있고, 대여기간 동안 자유롭게 사용할
          수 있습니다.
        </Typography>
        <Typography gutterBottom>
          - 대여기간은 대여한 날로 부터 +$
          {import.meta.env.VITE_PRIVATE_LENT_PERIOD}일 입니다.
        </Typography>
        <Typography gutterBottom>
          - 반납 시 두고가는 소지품이 없는 지 확인해주세요!
        </Typography>
        <Typography gutterBottom>
          - 대여하신 사물함의 비밀번호는 저장하지 않으니 따로 기록해주세요.
        </Typography>
        <Typography gutterBottom>
          - 사물함에 상할 수 있는 음식물이나 사물함이 오염 될 수 있는 물품
          보관은 자제해주세요.
        </Typography>
        <Typography gutterBottom>
          - 대여한 사물함이 잠겨 있거나 비밀번호를 분실하셨다면 프론트의 Staff
          혹은 42cabi 슬랙 채널로 문의해주세요.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.handleClick}>
          OK! 알았어요!
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
