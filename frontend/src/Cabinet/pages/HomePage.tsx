import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import "@/Cabinet/assets/css/homePage.css";
import { currentFloorNumberState } from "@/Cabinet/recoil/atoms";
import { currentBuildingFloorState } from "@/Cabinet/recoil/selectors";
import ServiceManual from "@/Cabinet/components/Home/ServiceManual";
import useOAuthStatus from "@/Cabinet/hooks/useOAuthStatus";

const HomePage = () => {
  const floors = useRecoilValue<Array<number>>(currentBuildingFloorState);
  const setCurrentFloor = useSetRecoilState<number>(currentFloorNumberState);
  const navigator = useNavigate();

  useOAuthStatus();

  const lentStartHandler = () => {
    setCurrentFloor(floors[0]);
    navigator("/main");
  };

  return <ServiceManual lentStartHandler={lentStartHandler} />;
};

export default HomePage;
