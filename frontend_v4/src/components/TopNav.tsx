import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { locationsFloorState, currentLocationNameState } from "@/recoil/atoms";
import { locationsState } from "@/recoil/selectors";
import { axiosLocationFloor } from "@/api/axios/axios.custom";
import TopNavContainer from "@/containers/TopNavContainer";
import useLeftNav from "@/hooks/useLeftNav";

const TopNav = () => {
  const [locationClicked, setLocationClicked] = useState(false);
  const setLocationsFloor = useSetRecoilState(locationsFloorState);
  const [currentLocationName, setCurrentLocationName] = useRecoilState(
    currentLocationNameState
  );
  const locationsList = useRecoilValue<Array<string>>(locationsState);
  const { clickLeftNav } = useLeftNav();

  const onClickLogo = () => {
    clickLeftNav();
  };

  useEffect(() => {
    const getLocationsData = async () => {
      try {
        const locationsFloorData = await axiosLocationFloor();
        setLocationsFloor(locationsFloorData.data.space_data);
      } catch (error) {
        console.log(error);
      }
    };
    getLocationsData();
  }, []);

  useEffect(() => {
    if (locationsList.length === 0) return;

    setCurrentLocationName(locationsList[0]);
  }, [locationsList]);

  return (
    <TopNavContainer
      currentLocationName={currentLocationName}
      locationsList={locationsList}
      locationClicked={locationClicked}
      setLocationClicked={setLocationClicked}
      onClickLogo={onClickLogo}
      setCurrentLocationName={setCurrentLocationName}
    />
  );
};

export default TopNav;
