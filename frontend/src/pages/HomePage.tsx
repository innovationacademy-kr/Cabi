import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { currentFloorNumberState } from "@/recoil/atoms";
import { currentLocationFloorState } from "@/recoil/selectors";
import ServiceManual from "@/components/Home/ServiceManual";
import "@/assets/css/homePage.css";

const HomePage = () => {
  const floors = useRecoilValue<Array<number>>(currentLocationFloorState);
  const setCurrentFloor = useSetRecoilState<number>(currentFloorNumberState);
  const navigator = useNavigate();

  const lentStartHandler = () => {
    setCurrentFloor(floors[0]);
    navigator("/main");
  };

  return <ServiceManual lentStartHandler={lentStartHandler} />;
};

export default HomePage;
