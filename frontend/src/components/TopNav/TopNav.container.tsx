import React, { SetStateAction, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentLocationNameState,
  locationsFloorState,
  myCabinetInfoState,
} from "@/recoil/atoms";
import { locationsState } from "@/recoil/selectors";
import TopNav from "@/components/TopNav/TopNav";
import { MyCabinetInfoResponseDto } from "@/types/dto/cabinet.dto";
import { axiosBuildingFloor, axiosMyLentInfo } from "@/api/axios/axios.custom";
import useMenu from "@/hooks/useMenu";

const TopNavContainer: React.FC<{
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
}> = (props) => {
  const [locationClicked, setLocationClicked] = useState(false);
  const [currentLocationName, setCurrentLocationName] = useRecoilState(
    currentLocationNameState
  );
  const setMyLentInfo =
    useSetRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const setLocationsFloor = useSetRecoilState(locationsFloorState);
  const locationsList = useRecoilValue<Array<string>>(locationsState);
  const { setIsLoading } = props;
  const { toggleLeftNav } = useMenu();

  const onClickLogo = () => {
    toggleLeftNav();
  };

  useEffect(() => {
    function setTimeoutPromise(delay: number) {
      return new Promise((resolve) => setTimeout(resolve, delay));
    }
    const getLocationsData = async () => {
      try {
        await setTimeoutPromise(500);
        const locationsFloorData = await axiosBuildingFloor();

        setLocationsFloor(locationsFloorData.data.space_data);
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

    Promise.all([getLocationsData(), getMyLentInfo()]).then(() =>
      setIsLoading(false)
    );
  }, []);

  useEffect(() => {
    if (locationsList.length === 0) return;

    setCurrentLocationName(locationsList[0]);
  }, [locationsList]);

  return (
    <TopNav
      currentLocationName={currentLocationName}
      locationsList={locationsList}
      locationClicked={locationClicked}
      setLocationClicked={setLocationClicked}
      onClickLogo={onClickLogo}
      setCurrentLocationName={setCurrentLocationName}
    />
  );
};

export default TopNavContainer;
