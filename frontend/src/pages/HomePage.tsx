import { useEffect } from "react";
import ServiceManual from "@/components/Home/ServiceManual";
import { useNavigate } from "react-router-dom";
import {
  currentCabinetIdState,
  currentFloorNumberState,
  targetCabinetInfoState,
} from "@/recoil/atoms";
import { currentLocationFloorState } from "@/recoil/selectors";
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import "@/assets/css/homePage.css";
import useMenu from "@/hooks/useMenu";

const HomePage = () => {
  const floors = useRecoilValue<Array<number>>(currentLocationFloorState);
  const setCurrentFloor = useSetRecoilState<number>(currentFloorNumberState);
  const { closeAll } = useMenu();
  const navigator = useNavigate();
  const resetTargetCabinetInfo = useResetRecoilState(targetCabinetInfoState);
  const resetCurrentCabinetId = useResetRecoilState(currentCabinetIdState);

  useEffect(() => {
    closeAll();
    resetTargetCabinetInfo();
    resetCurrentCabinetId();

    return () => {
      closeAll();
      resetTargetCabinetInfo();
      resetCurrentCabinetId();
    };
  }, []);

  const lentStartHandler = () => {
    setCurrentFloor(floors[0]);
    navigator("/main");
  };

  return <ServiceManual lentStartHandler={lentStartHandler} />;
};

export default HomePage;
