import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const style = {
  position: "absolute" as const, // eslint가 as "absolute" 를 as const 로 바꾸라고 합니다??
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 16,
  p: 4,
};

const GuideBox = (): JSX.Element => {
  return (
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        GuideBox
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        🎉✨🦄🎊따라라란🎉✨🦄🎊
      </Typography>
    </Box>
  );
};

export default GuideBox;
