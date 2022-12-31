import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TopNavContainer from "@/containers/TopNavContainer";
import InfoContainer from "@/containers/InfoContainer";
import LeftNavContainer from "@/containers/LeftNavContainer";
import LeftNavOptionContainer from "@/containers/LeftNavOptionContainer";
import LoadingModal from "@/components/LoadingModal";

import { getCookie } from "@/api/react_cookie/cookies";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import {
  locationsFloorState,
  myCabinetInfoState,
  userState,
  toggleCabinetInfoState,
  toggleMapInfoState,
} from "@/recoil/atoms";
import {
  CabinetLocationFloorDto,
  MyCabinetInfoResponseDto,
} from "@/types/dto/cabinet.dto";
import { UserDto } from "@/types/dto/user.dto";
import {
  axiosLocationFloor,
  axiosMyInfo,
  axiosMyLentInfo,
} from "@/api/axios/axios.custom";

import CabinetInfoArea from "@/components/CabinetInfoArea";

import { useRecoilValue } from "recoil";
import MapInfoContainer from "@/containers/MapInfoContainer";

const HomePage = () => {
  const toggleCabinetInfo = useRecoilValue(toggleCabinetInfoState);
  const toggleMapInfo = useRecoilValue(toggleMapInfoState);
  const navigator = useNavigate();
  const token = getCookie("access_token");
  const setCurrentLocationData =
    useSetRecoilState<CabinetLocationFloorDto[]>(locationsFloorState);
  const setUser = useSetRecoilState<UserDto>(userState);
  const setMyLentInfo =
    useSetRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const resetMyLentInfo = useResetRecoilState(myCabinetInfoState);
  let loading: boolean = false;

  useEffect(() => {
    if (!token) navigator("/");
    async function getData() {
      try {
        const { data: myInfo } = await axiosMyInfo();
        const { data: myLentInfo } = await axiosMyLentInfo();
        const locationFloorData = await axiosLocationFloor();

        setUser(myInfo);
        setMyLentInfo(myLentInfo);
        setCurrentLocationData(locationFloorData.data.space_data);
      } catch (error) {
        console.error(error);
      }
    }
    getData();
  }, []);

  return (
    <>
      <TopNavContainer />
      <WapperStyled>
        <LeftNavContainer />
        <LeftNavOptionContainer style={{ display: "none" }} />
        <MainStyled>
          {loading ? <LoadingModal /> : <InfoContainer />}
        </MainStyled>
        {toggleCabinetInfo && <CabinetInfoArea />}
        {toggleMapInfo && <MapInfoContainer />}
      </WapperStyled>
    </>
  );
};

const WapperStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
`;

const MainStyled = styled.main`
  width: 100%;
  height: 100%;
  overflow-x: hidden;
`;

export default HomePage;
