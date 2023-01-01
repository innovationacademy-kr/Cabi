import React from "react";
import HomeInfoContainer from "@/containers/HomeInfoContainer";
import { useNavigate } from "react-router-dom";
import { currentFloorNumberState } from "@/recoil/atoms";
import { currentLocationFloorState } from "@/recoil/selectors";
import { useRecoilValue, useSetRecoilState } from "recoil";

const HomeInfo = () => {
  const floors = useRecoilValue<Array<number>>(currentLocationFloorState);
  const setCurrentFloor = useSetRecoilState<number>(currentFloorNumberState);
  const navigator = useNavigate();

  const lentStartHandler = () => {
    setCurrentFloor(floors[0]);
    navigator("/main");
  };

  return <HomeInfoContainer lentStartHandler={lentStartHandler} />;
};

export default HomeInfo;
