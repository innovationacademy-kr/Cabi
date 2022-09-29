import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import React from "react";
import { CabinetLocationFloorDto } from "../../../types/dto/cabinet.dto";

// XXX:
// 로그인 시 최초 API 호출로 4중 배열 불러오고, 버튼에서는 내부 커스텀 액션으로 필요한 정보만 나눠서 가져오기
// TODO:
// 1. 현재 건물 위치 알려주는 l_idx 변수명 더 구체적으로 변경하면 좋을 것 같습니다
// 2. location 변경 시 setLidx 함수를 통해 l_idx가 변경되고 있어,
// 버튼이 아닌 다른 컴포넌트에서 이 상태를 관리하도록 변경하는 게 좋을 것 같습니다
//   const [l_idx, setLidx] = useState<number>(0);
//   // TODO:
//   // 3. info 업데이트하기 위해 axios API 및 dispatch 호출
//   // TODO:
//   // 4. handleClick 이벤트 핸들러 구현

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
            variant={floor === currentFloor ? "outlined" : "contained"}
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
