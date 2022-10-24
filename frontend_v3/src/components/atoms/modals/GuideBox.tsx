import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material";
import CheckButton from "../buttons/CheckButton";

const boxStyle = {
  position: "fixed" as const, // eslint가 as "absolute" 를 as const 로 바꾸라고 합니다??
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "24rem",
  maxWidth: "70vw",
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: 3,
  boxShadow: 16,
  p: 4,
  color: "text.primary",
  "@media (max-width: 281px)": {
    padding: "20px",
  },
};

const descriptionStyle = {
  mb: 2,
  fontWeight: "500",
  "@media (max-width: 281px)": {
    fontSize: "0.75rem",
  },
  margin: "0.3rem",
  whiteSpace: "pre-line",
  wordBreak: "keep-all",
};

const theme = createTheme();

theme.typography.h5 = {
  "@media (max-width: 281px)": {
    fontSize: "1rem",
  },
};

interface GuideBoxProps {
  handleClose: () => void;
}

// todo (seuan)
// 가이드 사항을 읽은 것에 대해 동의 여부를 체크하는 기능이 필요할 때를 대비하여 CheckButton으로 Button을 생성했습니다.
const descriptionList = [
  "● 개인 사물함",
  `1개의 사물함을 ${
    import.meta.env.VITE_PRIVATE_LENT_PERIOD
  }일간 대여 가능합니다\n\n● 공유 사물함`,
  `1개의 사물함을 최대 3인이 ${
    import.meta.env.VITE_SHARE_LENT_PERIOD
  }일간 대여 가능합니다`,
  "사물함 제목 및 메모는 대여자들끼리 공유됩니다",
  `대여 후 ${import.meta.env.VITE_SHARE_EARLY_RETURN_PERIOD}시간 내 반납 시, ${
    import.meta.env.VITE_SHARE_EARLY_RETURN_PENALTY
  }시간 동안 공유 사물함 대여가 불가능합니다\n\n● 동아리 사물함`,
  "동아리 전용 사물함 사용은 새로운 기수가 들어올 때 갱신됩니다",
  "비어있는 동아리 사물함 대여는 슬랙 캐비넷 채널로 문의주세요",
  "동아리 사물함은 상세페이지가 제공되지 않습니다.",
  "비밀번호는 동아리 인원끼리 협의하여 이용해주세요\n\n비밀번호 분실 및 사물함 고장은 1층 데스크로 문의해주세요",
];

const GuideBox = (props: GuideBoxProps): JSX.Element => {
  const { handleClose } = props;
  return (
    <Box sx={boxStyle}>
      <ThemeProvider theme={theme}>
        <Typography
          id="modal-modal-title"
          variant="h5"
          component="h2"
          sx={{ mb: 1, fontWeight: "bold" }}
        >
          🗄 42cabi 이용 안내서
        </Typography>
      </ThemeProvider>
      {descriptionList.map((msg, idx) => (
        <Typography
          key={idx}
          id="modal-modal-description"
          variant="body2"
          sx={descriptionStyle}
        >
          {msg}
        </Typography>
      ))}
      <Typography id="modal-modal-footer" align="center">
        <CheckButton
          color="primary"
          variant="contained"
          content="Ok! 알았어요!"
          onClick={handleClose}
        />
      </Typography>
    </Box>
  );
};

GuideBox.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  handleClose: (): void => {},
};

export default GuideBox;
