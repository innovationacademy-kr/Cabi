import React from "react";
import styled from "@emotion/styled";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.4rem;
  padding: 0.4rem 0.9rem;
  font-weight: 400;
  font-size: 0.8rem;
  color: black;
  background-color: transparent;
`;

const BuildingButton = (): JSX.Element => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  // todo : seuan
  // 차후 새롬관, 마루관에 따라 다르게 보여줘야할 경우 건물의 정보를 받아와야합니다.
  // 현재는 새롬관(default)만 존재하므로 고려하지 않아도 됩니다.
  const handleBuilding = (): void => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button onClick={handleClick}>
        <FontAwesomeIcon icon={faSortDown} />
        &nbsp;새롬관
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleBuilding}>
        <MenuItem onClick={handleBuilding}>새롬관</MenuItem>
        <MenuItem onClick={handleBuilding}>마루관</MenuItem>
      </Menu>
    </div>
  );
};

export default BuildingButton;
