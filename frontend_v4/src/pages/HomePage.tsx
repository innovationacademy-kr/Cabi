import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TopNav from "@/components/TopNav";
import InfoContainer from "@/containers/InfoContainer";
import LeftNavContainer from "@/containers/LeftNavContainer";
import LeftNavOptionContainer from "@/containers/LeftNavOptionContainer";
import LoadingModal from "@/components/LoadingModal";

import { getCookie } from "@/api/react_cookie/cookies";
import { useSetRecoilState } from "recoil";
import {
  myCabinetInfoState,
  userState,
  toggleCabinetInfoState,
  toggleMapInfoState,
} from "@/recoil/atoms";
import { MyCabinetInfoResponseDto } from "@/types/dto/cabinet.dto";
import { UserDto } from "@/types/dto/user.dto";
import { axiosMyInfo, axiosMyLentInfo } from "@/api/axios/axios.custom";

import CabinetInfoArea from "@/components/CabinetInfoArea";

import { useRecoilValue } from "recoil";
import MapInfoContainer from "@/containers/MapInfoContainer";

const HomePage = () => {
  const toggleCabinetInfo = useRecoilValue(toggleCabinetInfoState);
  const toggleMapInfo = useRecoilValue(toggleMapInfoState);
  const navigator = useNavigate();
  const token = getCookie("access_token");
  const setUser = useSetRecoilState<UserDto>(userState);
  const setMyLentInfo =
    useSetRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  let loading: boolean = false;

  useEffect(() => {
    if (!token) navigator("/");
    async function getData() {
      try {
        const { data: myInfo } = await axiosMyInfo();
        const { data: myLentInfo } = await axiosMyLentInfo();

        setUser(myInfo);
        setMyLentInfo(myLentInfo);
      } catch (error) {
        console.error(error);
      }
    }
    getData();
  }, []);

  return (
    <>
      <TopNav />
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
