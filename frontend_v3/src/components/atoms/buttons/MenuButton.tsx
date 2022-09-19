import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { axiosLogout } from "../../../network/axios/axios.custom";

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  background-color: transparent;
`;

// TODO: hybae
// event handler 추가
const MenuButton = (): JSX.Element => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  // TODO (seuan)
  // Guide Modal 이슈 해결 후 추가 예정
  const handleGuide = (): void => {
    console.log("Guide");
  };

  const handleReport = (): void => {
    window.open("https://42born2code.slack.com/archives/C02V6GE8LD7");
  };

  const handleLogout = (): void => {
    axiosLogout()
      .then((response) => {
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        // navigate("/");
      });
  };
  return (
    <div>
      <Button onClick={handleClick}>
        <FontAwesomeIcon icon={faBars} />
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleClose}>내 사물함</MenuItem>
        <MenuItem onClick={handleGuide}>이용안내</MenuItem>
        <MenuItem onClick={handleReport}>슬랙문의</MenuItem>
        <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
      </Menu>
    </div>
  );
};

export default MenuButton;
