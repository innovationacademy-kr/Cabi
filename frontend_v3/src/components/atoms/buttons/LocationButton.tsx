import React from "react";
import styled from "@emotion/styled";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useAppSelector } from "../../../redux/hooks";

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

interface LocationButtonProps {
  currentLocation: string;
  setCurrentLocation: (location: string) => void;
}

const LocationButton = (props: LocationButtonProps): JSX.Element => {
  const { currentLocation, setCurrentLocation } = props;
  const locations = useAppSelector((state) => state.cabinet.location);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleBuilding = (e: any): void => {
    const getLocation: string | null =
      e.currentTarget.getAttribute("button-key");
    if (getLocation) setCurrentLocation(getLocation);
    setAnchorEl(null);
  };

  return (
    <div>
      <Button onClick={handleClick}>
        <FontAwesomeIcon icon={faSortDown} />
        &nbsp;{currentLocation}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleBuilding}>
        {locations?.map((location: string) => {
          return (
            <MenuItem
              button-key={location}
              key={location}
              onClick={handleBuilding}
            >
              {location}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

export default LocationButton;
