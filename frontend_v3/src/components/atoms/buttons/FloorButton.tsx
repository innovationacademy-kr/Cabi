import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import React from "react";
import { CabinetLocationFloorDto } from "../../../types/dto/cabinet.dto";

interface FloorButtonProps {
  currentFloor: number;
  setFloor: (floor: number) => void;
  floorsByLocation: CabinetLocationFloorDto | undefined;
}

const FloorButton = (props: FloorButtonProps): JSX.Element => {
  const { currentFloor, setFloor, floorsByLocation } = props;
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const getFloor: string | null = e.currentTarget.getAttribute("button-key");
    if (getFloor) setFloor(parseInt(getFloor, 10));
  };
  return (
    <ButtonGroup color="primary">
      {floorsByLocation?.floors?.map((floor: number) => {
        return (
          <Button
            style={{ height: "1.7rem" }}
            variant={floor === currentFloor ? "outlined" : "contained"}
            color="info"
            key={floor}
            button-key={floor}
            onClick={handleClick}
          >
            {floor}F
          </Button>
        );
      })}
    </ButtonGroup>
  );
};

export default FloorButton;
