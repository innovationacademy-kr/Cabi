import React, { SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  buildingsFloorState,
  currentBuildingNameState,
  myCabinetInfoState,
} from "@/recoil/atoms";
import { buildingsState } from "@/recoil/selectors";
import TopNav from "@/components/TopNav/TopNav";
import { MyCabinetInfoResponseDto } from "@/types/dto/cabinet.dto";
import { axiosBuildingFloor, axiosMyLentInfo } from "@/api/axios/axios.custom";
import useMenu from "@/hooks/useMenu";

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

        console.log("buildingsFloorData", buildingsFloorData.data);
        setBuildingsFloor([
          ...buildingsFloorData.data,
          {
            building: "수지회",
            floors: [2, 3, 4],
          },
        ]);
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
    else if (currentBuildingName === "수지회") {
      navigator("/wed/home");
    } else if (currentBuildingName === "새롬관") {
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
