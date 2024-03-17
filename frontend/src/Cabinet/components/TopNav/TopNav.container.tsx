import React, { SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  buildingsFloorState,
  currentBuildingNameState,
  myCabinetInfoState,
} from "@/Cabinet/recoil/atoms";
import { buildingsState } from "@/Cabinet/recoil/selectors";
import TopNav from "@/Cabinet/components/TopNav/TopNav";
import { MyCabinetInfoResponseDto } from "@/Cabinet/types/dto/cabinet.dto";
import {
  axiosBuildingFloor,
  axiosMyLentInfo,
} from "@/Cabinet/api/axios/axios.custom";
import useMenu from "@/Cabinet/hooks/useMenu";

const TopNavContainer: React.FC<{
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
}> = (props) => {
  const [buildingClicked, setBuildingClicked] = useState(false);
  const [currentBuildingName, setCurrentBuildingName] = useRecoilState(
    currentBuildingNameState
  );
  const setMyLentInfo =
    useSetRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const setBuildingsFloor = useSetRecoilState(buildingsFloorState);
  const buildingsList = useRecoilValue<Array<string>>(buildingsState);
  const { setIsLoading } = props;
  const { toggleLeftNav } = useMenu();
  const navigator = useNavigate();

  const onClickLogo = () => {
    toggleLeftNav();
  };

  useEffect(() => {
    function setTimeoutPromise(delay: number) {
      return new Promise((resolve) => setTimeout(resolve, delay));
    }
    const getBuildingsData = async () => {
      try {
        await setTimeoutPromise(500);
        const buildingsFloorData = await axiosBuildingFloor();
        setBuildingsFloor([...buildingsFloorData.data]);
      } catch (error) {
        console.log(error);
      }
    };
    async function getMyLentInfo() {
      try {
        const { data: myLentInfo } = await axiosMyLentInfo();

        setMyLentInfo(myLentInfo);
      } catch (error) {
        console.error(error);
      }
    }

    Promise.all([getBuildingsData(), getMyLentInfo()]).then(() =>
      setIsLoading(false)
    );
  }, []);

  useEffect(() => {
    if (buildingsList.length === 0) return;
    setCurrentBuildingName(buildingsList[0]);
  }, [buildingsList]);

  useEffect(() => {
    if (currentBuildingName === undefined) return;
    else if (currentBuildingName === "새롬관") {
      navigator("/home");
    }
  }, [currentBuildingName]);

  return (
    <TopNav
      currentBuildingName={currentBuildingName}
      buildingsList={buildingsList}
      buildingClicked={buildingClicked}
      setBuildingClicked={setBuildingClicked}
      onClickLogo={onClickLogo}
      setCurrentBuildingName={setCurrentBuildingName}
    />
  );
};

export default TopNavContainer;
