import { useEffect } from "react";
import ServiceManual from "@/components/Home/ServiceManual";
import { useNavigate } from "react-router-dom";
import { currentFloorNumberState } from "@/recoil/atoms";
import { currentLocationFloorState } from "@/recoil/selectors";
import { useRecoilValue, useSetRecoilState } from "recoil";
import "@/assets/css/homePage.css";
import useMenu from "@/hooks/useMenu";

const HomePage = () => {
  const floors = useRecoilValue<Array<number>>(currentLocationFloorState);
  const setCurrentFloor = useSetRecoilState<number>(currentFloorNumberState);
  const { closeLeftNav, closeAll } = useMenu();
  const navigator = useNavigate();

  useEffect(() => {
    closeLeftNav();

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
