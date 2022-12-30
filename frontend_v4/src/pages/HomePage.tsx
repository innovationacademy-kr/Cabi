import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TopNavContainer from "@/containers/TopNavContainer";
import InfoContainer from "@/containers/InfoContainer";
import LeftNavContainer from "@/containers/LeftNavContainer";
import LeftNavOptionContainer from "@/containers/LeftNavOptionContainer";
import LoadingModal from "@/components/LoadingModal";

import { getCookie } from "@/api/react_cookie/cookies";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import {
  locationsFloorState,
  currentFloorNumberState,
  currentSectionNameState,
  currentFloorCabinetState,
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

import CabinetInfoArea from "@/containers/CabinetInfoArea";

import { CabinetInfo } from "@/types/dto/cabinet.dto";
import CabinetType from "@/types/enum/cabinet.type.enum";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import { ISelectedCabinetInfo } from "@/containers/CabinetInfoArea";
import { useRecoilValue } from "recoil";
import MapInfoContainer from "@/containers/MapInfoContainer";

let myCabinetIdx: number | null = 25;
let isCabinetSelected: boolean = true;
let selectedCabinetFloor: number = 2;
const CabinetInfoDummy: ISelectedCabinetInfo = {
  floor: 2,
  section: "Oasis",
  cabinetNum: 42,
  cabinetColor: "var(--available)",
  cabinetLogo: "/src/assets/images/shareCabinetType.svg",
  userNameList: "jaesjeon\ninshin\n-",
  belowText: "16일 남았습니다.\n2022-12-22",
  belowTextColor: "black",
};
let selectedCabinetInfo: CabinetInfo = {
  cabinet_id: 24,
  cabinet_num: 42,
  lent_type: CabinetType.SHARE,
  cabinet_title: null,
  max_user: 3,
  status: CabinetStatus.AVAILABLE,
  section: "Oasis",
  lent_info: [
    {
      user_id: 12345,
      intra_id: "jaesjeon",
      lent_id: 321,
      lent_time: new Date(),
      expire_time: new Date(),
      is_expired: false,
    },
    {
      user_id: 13579,
      intra_id: "inshin",
      lent_id: 327,
      lent_time: new Date(),
      expire_time: new Date(),
      is_expired: false,
    },
  ],
};

const HomePage = () => {
  const toggleCabinetInfo = useRecoilValue(toggleCabinetInfoState);
  const toggleMapInfo = useRecoilValue(toggleMapInfoState);
  const navigator = useNavigate();
  const token = getCookie("access_token");
  const [currentLocationData, setCurrentLocationData] =
    useRecoilState<CabinetLocationFloorDto[]>(locationsFloorState);
  const setUser = useSetRecoilState<UserDto>(userState);
  const [myLentInfo, setMyLentInfo] =
    useRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);

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
        {toggleCabinetInfo && (
          <CabinetInfoArea selectedCabinetInfo={CabinetInfoDummy} />
        )}
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
