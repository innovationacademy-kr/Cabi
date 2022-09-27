import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { axiosLogout } from "../../../network/axios/axios.custom";
import { useAppDispatch } from "../../../redux/hooks";
import { userInfoInitialize } from "../../../redux/slices/userSlice";

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  background-color: transparent;
`;

const logoutStyle = {
  color: "rgba(0, 0, 0, 0.87)",
  fontFamily: "Roboto ,sans-serif",
  fontWeight: "400",
};

const MenuButton = (): JSX.Element => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const dispatch = useAppDispatch();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  // TODO (seuan)
  // Guide Modal 이슈 해결 후 추가 예정 -> MenuItem에서 제거.
  // const handleGuide = (): void => {
  //   console.log("Guide");
  // };

  const handleReport = (): void => {
    const slackUrl = "https://42born2code.slack.com/archives/C02V6GE8LD7";
    window.open(slackUrl);
  };

  const handleCircle = (): void => {
    const circleUrl = "https://forms.gle/6GHUnNfyJeD55sB67";
    window.open(circleUrl);
  };

  const handleLogout = (): void => {
    axiosLogout()
      .then((response) => {
        dispatch(userInfoInitialize());
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <Button onClick={handleClick}>
        <FontAwesomeIcon icon={faBars} />
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleClose}>내 사물함</MenuItem>
        {/* <MenuItem onClick={handleGuide}>이용안내</MenuItem> */}
        <MenuItem onClick={handleReport}>슬랙문의</MenuItem>
        <MenuItem onClick={handleCircle}>사물함 신청</MenuItem>
        <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
      </Menu>
    </div>
  );
};

export default MenuButton;
