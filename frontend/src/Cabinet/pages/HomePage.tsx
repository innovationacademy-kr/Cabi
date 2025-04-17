import { HttpStatusCode } from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import "@/Cabinet/assets/css/homePage.css";
import { currentFloorNumberState } from "@/Cabinet/recoil/atoms";
import { currentBuildingFloorState } from "@/Cabinet/recoil/selectors";
import ServiceManual from "@/Cabinet/components/Home/ServiceManual";
import { removeLocalStorageItem } from "@/Cabinet/api/local_storage/local.storage";
import useURLSearchParams from "@/Cabinet/hooks/useURLSearchParams";

const HomePage = () => {
  const floors = useRecoilValue<Array<number>>(currentBuildingFloorState);
  const setCurrentFloor = useSetRecoilState<number>(currentFloorNumberState);
  const navigator = useNavigate();
  const { getSearchParam } = useURLSearchParams();
  const statusParamValue = getSearchParam("status");

  const lentStartHandler = () => {
    setCurrentFloor(floors[0]);
    navigator("/main");
  };

  const loginSuccessHandler = () => {
    removeLocalStorageItem("isLoggedOut");
  };

  useEffect(() => {
    if (statusParamValue && Number(statusParamValue) === HttpStatusCode.Ok) {
      loginSuccessHandler();
      navigator("/home");
    }
  }, []);

  return <ServiceManual lentStartHandler={lentStartHandler} />;
};

export default HomePage;
