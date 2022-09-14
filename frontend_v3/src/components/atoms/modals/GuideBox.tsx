import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CheckButton from "../buttons/CheckButton";

const boxStyle = {
  position: "fixed" as const, // eslint가 as "absolute" 를 as const 로 바꾸라고 합니다??
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: 3,
  boxShadow: 16,
  p: 4,
  color: "text.primary",
};

const Ul = styled.ul`
  text-align: left;
  font-size: 0.9rem;
  > li {
    margin-bottom: 0.8rem;
  }
`;

interface GuideBoxProps {
  handleClose: () => void;
}

const GuideBox = (props: GuideBoxProps): JSX.Element => {
  const { handleClose } = props;
  return (
    <Box sx={boxStyle}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        🗄 42cabi 이용 안내서
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        <Ul>
          <li>
            1인 당 1개의 사물함을 대여할 수 있고,
            <br />
            대여기간 동안 자유롭게 사용할 수 있습니다.
            <br />
          </li>
          <li>
            대여기간은 대여한 날로 부터 +30일 입니다.
            <br />
          </li>
          <li>
            반납 시 두고가는 소지품이 없는 지 확인해주세요!
            <br />
          </li>
          <li>
            대여하신 사물함의 비밀번호는 저장하지
            <br />
            않으니 따로 기록해주세요.
            <br />
          </li>
          <li>
            사물함에 상할 수 있는 음식물이나 사물함이 <br />
            오염 될 수 있는 물품 보관은 자제해주세요.
            <br />
          </li>
          <li>
            대여한 사물함이 잠겨 있거나 비밀번호를 <br />
            분실하셨다면 프론트의 Staff 혹은 42cabi 슬랙 채널로 문의해주세요.
            <br />
          </li>
        </Ul>
      </Typography>
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

// GuideBox.defaultProps = {
//   // eslint-disable-next-line react/default-props-match-prop-types
//   handleClose: () => {
//     console.log("closed");
//   },
// };

export default GuideBox;
