import styled from "styled-components";
import TopNavContainer from "@/containers/TopNavContainer";
import InfoContainer from "@/containers/InfoContainer";
import LeftNavContainer from "@/containers/LeftNavContainer";
import LeftNavOptionContainer from "@/containers/LeftNavOptionContainer";
import CabinetInfoArea from "@/containers/CabinetInfoArea";

import { CabinetInfo } from "@/types/dto/cabinet.dto";
import CabinetType from "@/types/enum/cabinet.type.enum";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import { ISelectedCabinetInfo } from "@/containers/CabinetInfoArea";
import { useState } from "react";
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
  const [cabinetInfo, toggleCabinetInfo] = useState(false);
  const [mapInfo, toggleMapInfo] = useState(true);
  const clickCabinetInfo = () => {
    toggleCabinetInfo(!cabinetInfo);
  };
  const clickMapInfo = () => {
    toggleMapInfo(!mapInfo);
  };
  return (
    <>
      <TopNavContainer clickCabinetInfo={clickCabinetInfo} />
      <WapperStyled>
        <LeftNavContainer />
        <LeftNavOptionContainer style={{ display: "none" }} />
        <MainStyled>
          <InfoContainer />
        </MainStyled>
        {cabinetInfo && (
          <CabinetInfoArea selectedCabinetInfo={CabinetInfoDummy} />
        )}
        {mapInfo && <MapInfoContainer />}
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
