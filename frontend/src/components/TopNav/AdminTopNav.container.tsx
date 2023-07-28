import React, { SetStateAction, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { buildingsFloorState, currentBuildingNameState } from "@/recoil/atoms";
import { buildingsState } from "@/recoil/selectors";
import TopNav from "@/components/TopNav/TopNav";
import { axiosBuildingFloor } from "@/api/axios/axios.custom";
import useMenu from "@/hooks/useMenu";

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
        setBuildingsFloor(buildingsFloorData.data);
      } catch (error) {
        console.log(error);
      }
    };

    getBuildingsData().then(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (buildingsList.length === 0) return;

    setCurrentBuildingName(buildingsList[0]);
  }, [buildingsList]);

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
