import React, { SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  buildingsFloorState,
  currentBuildingNameState,
} from "@/Cabinet/recoil/atoms";
import { buildingsState } from "@/Cabinet/recoil/selectors";
import { axiosBuildingFloor } from "@/Cabinet/api/axios/axios.custom";
import useMenu from "@/Cabinet/hooks/useMenu";
import TopNav from "@/Presentation/components/TopNav/TopNav";

const AdminTopNavContainer: React.FC<{
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
}> = (props) => {
  const [buildingClicked, setbuildingClicked] = useState(false);
  const [currentBuildingName, setCurrentBuildingName] = useRecoilState(
    currentBuildingNameState
  );
  const setBuildingsFloor = useSetRecoilState(buildingsFloorState);
  const buildingsList = useRecoilValue<Array<string>>(buildingsState);
  const { setIsLoading } = props;
  const { toggleLeftNav } = useMenu();
  const navigator = useNavigate();

  const onClickLogo = () => {
    toggleLeftNav();
  };

  useEffect(() => {
    /* test timeout */
    function setTimeoutPromise(delay: number) {
      return new Promise((resolve) => setTimeout(resolve, delay));
    }

    const getBuildingsData = async () => {
      try {
        await setTimeoutPromise(500);
        const buildingsFloorData = await axiosBuildingFloor();
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

    getBuildingsData().then(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (buildingsList.length === 0) return;

    // setCurrentBuildingName(buildingsList[0]);
  }, [buildingsList]);

  useEffect(() => {
    if (currentBuildingName === undefined) return;
    else if (currentBuildingName === "수지회") {
      navigator("/admin/presentation/detail");
    } else if (currentBuildingName === "새롬관") {
      navigator("/admin/main");
    }
  }, [currentBuildingName]);

  return (
    <TopNav
      currentBuildingName={currentBuildingName}
      buildingsList={buildingsList}
      buildingClicked={buildingClicked}
      setBuildingClicked={setbuildingClicked}
      onClickLogo={onClickLogo}
      setCurrentBuildingName={setCurrentBuildingName}
      isAdmin={true}
    />
  );
};

export default AdminTopNavContainer;
