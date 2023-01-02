import React, { SetStateAction, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import {
  locationsFloorState,
  currentLocationNameState,
  myCabinetInfoState,
} from "@/recoil/atoms";
import { locationsState } from "@/recoil/selectors";
import { axiosLocationFloor, axiosMyLentInfo } from "@/api/axios/axios.custom";
import { MyCabinetInfoResponseDto } from "@/types/dto/cabinet.dto";
import TopNavContainer from "@/containers/TopNavContainer";
import useLeftNav from "@/hooks/useLeftNav";

const TopNav: React.FC<{
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
  const { clickLeftNav } = useLeftNav();

  const onClickLogo = () => {
    clickLeftNav();
  };

  useEffect(() => {
    /* test timeout */
    function setTimeoutPromise(delay: number) {
      return new Promise((resolve) => setTimeout(resolve, delay));
    }
    /* ------------ */
    const getLocationsData = async () => {
      try {
        await setTimeoutPromise(1000);
        const locationsFloorData = await axiosLocationFloor();

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
