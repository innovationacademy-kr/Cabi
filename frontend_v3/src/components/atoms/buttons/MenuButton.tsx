import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { axiosLogout } from "../../../network/axios/axios.custom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { userInfoInitialize } from "../../../redux/slices/userSlice";
import instance from "../../../network/axios/axios.instance";
import { removeCookie } from "../../../network/react-cookie/cookie";

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  background-color: transparent;
`;

const MenuButton = (): JSX.Element => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleMyCabinet = (): void => {
    if (window.location.pathname === "/lent") navigate("/main");
    else navigate("/lent");
  };

  const handleReport = (): void => {
    const slackUrl = "https://42born2code.slack.com/archives/C02V6GE8LD7";
    window.open(slackUrl);
  };

  const handleCircle = (): void => {
    const circleUrl = "https://forms.gle/6GHUnNfyJeD55sB67";
    window.open(circleUrl);
  };

  const handleLogout = (): void => {
    if (import.meta.env.VITE_IS_LOCAL === "true") {
      removeCookie("access_token");
    } else {
      removeCookie("access_token", { path: "/", domain: "cabi.42seoul.io" });
    }
    navigate("/");
  };

  // 베타테스트용 페널티 해제 메뉴
  const axiosRemovePenaltyURL = "/v3/api/betatest/deletebanlog";
  const axiosRemovePenalty = async (): Promise<any> => {
    try {
      const response = await instance.delete(axiosRemovePenaltyURL);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleRemovePenalty = (): void => {
    axiosRemovePenalty()
      .then((response) => {
        if (response.status === 204) {
          alert("패널티가 없습니다. 대여가 안될 시에는 문의 부탁드립니다.");
        } else {
          alert("페널티가 정상적으로 해제 되었습니다.");
        }
      })
      .catch((error) => {
        alert(
          "오류가 발생했습니다. 지속적으로 문제 발생 시 꼭 제보 부탁드립니다!"
        );
        console.error(error);
      });
  };

  return (
    <div>
      <Button onClick={handleClick}>
        <FontAwesomeIcon icon={faBars} />
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {user?.cabinet_id !== -1 && (
          <MenuItem onClick={handleMyCabinet}>
            {window.location.pathname === "/lent" ? "전체 사물함" : "내 사물함"}
          </MenuItem>
        )}
        <MenuItem onClick={handleReport}>슬랙문의</MenuItem>
        <MenuItem onClick={handleCircle}>사물함 신청</MenuItem>
        <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
        {import.meta.env.VITE_UNBAN === 'true' && (
          <MenuItem onClick={handleRemovePenalty}>정지 해제</MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default MenuButton;
