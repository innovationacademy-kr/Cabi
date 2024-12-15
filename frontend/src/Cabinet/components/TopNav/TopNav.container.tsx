import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentBuildingNameState } from "@/Cabinet/recoil/atoms";
import { buildingsState } from "@/Cabinet/recoil/selectors";
import TopNav from "@/Cabinet/components/TopNav/TopNav";
import useMenu from "@/Cabinet/hooks/useMenu";

const TopNavContainer: React.FC = () => {
  const [buildingClicked, setBuildingClicked] = useState(false);
  const [currentBuildingName, setCurrentBuildingName] = useRecoilState(
    currentBuildingNameState
  );
  const buildingsList = useRecoilValue<Array<string>>(buildingsState);
  const { toggleLeftNav } = useMenu();

  const onClickLogo = () => {
    toggleLeftNav();
  };

  useEffect(() => {
    if (buildingsList.length === 0) return;
    setCurrentBuildingName(buildingsList[0]);
  }, [buildingsList]);

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
