import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TopNavContainer from "@/containers/TopNavContainer";
import InfoContainer from "@/containers/InfoContainer";
import LeftNavContainer from "@/containers/LeftNavContainer";
import LeftNavOptionContainer from "@/containers/LeftNavOptionContainer";
import { getCookie } from "@/api/react_cookie/cookies";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import {
  locationsFloorState,
  currentFloorNumberState,
  currentSectionNameState,
  currentFloorCabinetState,
  myCabinetInfoState,
  userState,
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

const HomePage = () => {
  const navigator = useNavigate();
  const token = getCookie("access_token");
  const setCurrentLocationData =
    useSetRecoilState<CabinetLocationFloorDto[]>(locationsFloorState);
  const setUser = useSetRecoilState<UserDto>(userState);
  const setMyLentInfo =
    useSetRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const resetMyLentInfo = useResetRecoilState(myCabinetInfoState);

  useEffect(() => {
    if (!token) navigator("/");

    const getLocationData = async () => {
      try {
        const locationFloorData = await axiosLocationFloor();
        setCurrentLocationData(locationFloorData.data.space_data);
      } catch (error) {
        console.log(error);
        // navigator("/");
      }
    };
    getLocationData();
    axiosMyInfo()
      .then((response) => {
        setUser(response.data);
        //if (response.data.cabinet_id !== -1) navigate("/lent");
      })
      .catch((error) => {
        console.log(error);
        //navigate("/");
      });
    axiosMyLentInfo()
      .then((response) => {
        if (response.status === 204) resetMyLentInfo();
        else if (response.data) setMyLentInfo(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <TopNavContainer />
      <WapperStyled>
        <LeftNavContainer />
        <LeftNavOptionContainer style={{ display: "none" }} />
        <MainStyled>
          <InfoContainer />
        </MainStyled>
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
  padding-top: 30px;
`;

export default HomePage;
