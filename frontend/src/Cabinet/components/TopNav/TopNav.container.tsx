import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentBuildingNameState } from "@/Cabinet/recoil/atoms";
import { buildingsState } from "@/Cabinet/recoil/selectors";
import TopNav from "@/Cabinet/components/TopNav/TopNav";
import { staticColNumData } from "@/Cabinet/assets/data/sectionColNumData";
import useMenu from "@/Cabinet/hooks/useMenu";

const TopNavContainer: React.FC = () => {
  const [buildingClicked, setBuildingClicked] = useState(false);
  const [currentBuildingName, setCurrentBuildingName] = useRecoilState(
    currentBuildingNameState
  );
  const buildingsList = useRecoilValue<Array<string>>(buildingsState);
  const { toggleLeftNav } = useMenu();
  const navigator = useNavigate();
  const isLocation = useLocation();

  const onClickLogo = () => {
    toggleLeftNav();
  };

  useEffect(() => {
    if (buildingsList.length === 0) return;
    setCurrentBuildingName(buildingsList[0]);
  }, [buildingsList]);

  useEffect(() => {
    if (currentBuildingName === undefined) return;
    else if (currentBuildingName === staticColNumData[0].building) {
      navigator(isLocation);
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
