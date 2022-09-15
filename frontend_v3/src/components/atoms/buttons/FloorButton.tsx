import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import React, { useState } from "react";
import { useAppSelector } from "../../../redux/hooks";

const FloorButton = () => {
  // XXX:
  // 로그인 시 최초 API 호출로 4중 배열 불러오고, 버튼에서는 내부 커스텀 액션으로 필요한 정보만 나눠서 가져오기
  const info = useAppSelector((state) => state.cabinet);

  // TODO:
  // 1. 현재 건물 위치 알려주는 l_idx 변수명 더 구체적으로 변경하면 좋을 것 같습니다
  // 2. location 변경 시 setLidx 함수를 통해 l_idx가 변경되고 있어,
  // 버튼이 아닌 다른 컴포넌트에서 이 상태를 관리하도록 변경하는 게 좋을 것 같습니다
  const [l_idx, setLidx] = useState<number>(0);

  // TODO:
  // 3. info 업데이트하기 위해 axios API 및 dispatch 호출

  // TODO:
  // 4. handleClick 이벤트 핸들러 구현
  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>
  ): void => {
    console.log("clicked");
  };

  return (
    <ButtonGroup variant="contained" color="primary">
      {info.floor[l_idx].map((floor: number) => {
        return (
          <Button key={floor} onClick={handleClick}>
            {floor}F
          </Button>
        );
      })}
    </ButtonGroup>
  );
};

export default FloorButton;
