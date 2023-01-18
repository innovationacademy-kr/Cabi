import { useEffect } from "react";
import ServiceManual from "@/components/Home/ServiceManual";
import { useNavigate } from "react-router-dom";
import {
  currentFloorNumberState,
  currentSectionNameState,
} from "@/recoil/atoms";
import { currentLocationFloorState } from "@/recoil/selectors";
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import "@/assets/css/homePage.css";
import useMenu from "@/hooks/useMenu";

const HomePage = () => {
  const floors = useRecoilValue<Array<number>>(currentLocationFloorState);
  const setCurrentFloor = useSetRecoilState<number>(currentFloorNumberState);
  const resetCurrentFloor = useResetRecoilState(currentFloorNumberState);
  const resetCurrentSection = useResetRecoilState(currentSectionNameState);
  const { closeLeftNav, closeAll } = useMenu();
  const navigator = useNavigate();

  useEffect(() => {
    closeLeftNav();
    resetCurrentFloor();
    resetCurrentSection();

    return () => {
      closeAll();
    };
  }, []);

  const lentStartHandler = () => {
    setCurrentFloor(floors[0]);
    navigator("/main");
  };

  return <ServiceManual lentStartHandler={lentStartHandler} />;
};

export default HomePage;
