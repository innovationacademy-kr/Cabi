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
import useLeftNav from "@/hooks/useLeftNav";
import useDetailInfo from "@/hooks/useDetailInfo";

const HomePage = () => {
  const floors = useRecoilValue<Array<number>>(currentLocationFloorState);
  const setCurrentFloor = useSetRecoilState<number>(currentFloorNumberState);
  const resetCurrentFloor = useResetRecoilState(currentFloorNumberState);
  const resetCurrentSection = useResetRecoilState(currentSectionNameState);
  const { closeLeftNav } = useLeftNav();
  const { closeDetailInfo } = useDetailInfo();
  const navigator = useNavigate();

  useEffect(() => {
    closeDetailInfo();
    closeLeftNav();
    resetCurrentFloor();
    resetCurrentSection();

    return () => {
      closeDetailInfo();
    };
  }, []);

  const lentStartHandler = () => {
    setCurrentFloor(floors[0]);
    navigator("/main");
  };

  return <ServiceManual lentStartHandler={lentStartHandler} />;
};

export default HomePage;
