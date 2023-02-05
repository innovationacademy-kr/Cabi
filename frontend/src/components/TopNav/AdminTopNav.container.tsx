import React, { SetStateAction, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { locationsFloorState, currentLocationNameState } from "@/recoil/atoms";
import { locationsState } from "@/recoil/selectors";
import { axiosLocationFloor } from "@/api/axios/axios.custom";
import TopNav from "@/components/TopNav/TopNav";
import useMenu from "@/hooks/useMenu";

const AdminTopNavContainer: React.FC<{
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
}> = (props) => {
  const [locationClicked, setLocationClicked] = useState(false);
  const [currentLocationName, setCurrentLocationName] = useRecoilState(
    currentLocationNameState
  );
  const setLocationsFloor = useSetRecoilState(locationsFloorState);
  const locationsList = useRecoilValue<Array<string>>(locationsState);
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

    const getLocationsData = async () => {
      try {
        await setTimeoutPromise(500);
        const locationsFloorData = await axiosLocationFloor();
        setLocationsFloor(locationsFloorData.data.space_data);
      } catch (error) {
        console.log(error);
      }
    };

    getLocationsData().then(() => setIsLoading(false));
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
      isAdmin={true}
    />
  );
};

export default AdminTopNavContainer;
