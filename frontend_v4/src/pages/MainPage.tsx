import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import TopNavContainer from "@/containers/TopNavContainer";
import LeftNavContainer from "@/containers/LeftNavContainer";
import {
  CabinetInfo,
  CabinetInfoByLocationFloorDto,
  MyCabinetInfoResponseDto,
} from "@/types/dto/cabinet.dto";
import CabinetListContainer from "@/containers/CabinetListContainer";
import CabinetType from "@/types/enum/cabinet.type.enum";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import { SectionPaginationContainer } from "@/containers/SectionPaginationContainer";
import CabinetInfoArea, {
  ISelectedCabinetInfo,
} from "@/containers/CabinetInfoArea";
import LeftNavOptionContainer from "@/containers/LeftNavOptionContainer";
import {
  axiosCabinetByLocationFloor,
  axiosMyInfo,
  axiosMyLentInfo,
} from "@/api/axios/axios.custom";
import { getCookie } from "@/api/react_cookie/cookies";
import { useRecoilState } from "recoil";
import {
  currentFloorDataState,
  currentFloorState,
  myLentInfoState,
  userInfoState,
} from "@/recoil/atoms";
import { UserDto } from "@/types/dto/user.dto";
import { useNavigate } from "react-router";

const CABINETS: CabinetInfo[] = [
  {
    cabinet_id: 97,
    cabinet_num: 37,
    lent_type: CabinetType.SHARE,
    cabinet_title: null,
    max_user: 3,
    status: CabinetStatus.AVAILABLE,
    section: "Cluster 1 - Terrace",
    lent_info: [],
  },
  {
    cabinet_id: 98,
    cabinet_num: 38,
    lent_type: CabinetType.SHARE,
    cabinet_title: null,
    max_user: 3,
    status: CabinetStatus.AVAILABLE,
    section: "Cluster 1 - Terrace",
    lent_info: [
      {
        user_id: 80460,
        intra_id: "jwoo",
        lent_id: 934,
        lent_time: new Date("2022-11-10T15:02:42.000Z"),
        expire_time: new Date("2022-12-10T15:02:42.000Z"),
        is_expired: true,
      },
    ],
  },
  {
    cabinet_id: 99,
    cabinet_num: 39,
    lent_type: CabinetType.SHARE,
    cabinet_title: "함지와 형님들",
    max_user: 3,
    status: CabinetStatus.SET_EXPIRE_FULL,
    section: "Cluster 1 - Terrace",
    lent_info: [
      {
        user_id: 131666,
        intra_id: "dongyoki",
        lent_id: 1461,
        lent_time: new Date("2022-12-19T02:42:03.000Z"),
        expire_time: new Date("2023-01-31T14:59:59.000Z"),
        is_expired: false,
      },
      {
        user_id: 131623,
        intra_id: "jihham",
        lent_id: 1462,
        lent_time: new Date("2022-12-19T02:42:31.000Z"),
        expire_time: new Date("2023-01-31T14:59:59.000Z"),
        is_expired: false,
      },
      {
        user_id: 131622,
        intra_id: "gkwon",
        lent_id: 1463,
        lent_time: new Date("2022-12-19T02:42:32.000Z"),
        expire_time: new Date("2023-01-31T14:59:59.000Z"),
        is_expired: false,
      },
    ],
  },
  {
    cabinet_id: 113,
    cabinet_num: 53,
    lent_type: CabinetType.PRIVATE,
    cabinet_title: null,
    max_user: 1,
    status: CabinetStatus.SET_EXPIRE_AVAILABLE,
    section: "Cluster 1 - Terrace",
    lent_info: [
      {
        user_id: 110679,
        intra_id: "hyeyukim",
        lent_id: 1281,
        lent_time: new Date("2022-12-07T22:43:19.000Z"),
        expire_time: new Date("2022-12-30T14:59:59.000Z"),
        is_expired: false,
      },
    ],
  },
  {
    cabinet_id: 114,
    cabinet_num: 54,
    lent_type: CabinetType.PRIVATE,
    cabinet_title: null,
    max_user: 1,
    status: CabinetStatus.SET_EXPIRE_FULL,
    section: "Cluster 1 - Terrace",
    lent_info: [
      {
        user_id: 110902,
        intra_id: "sooyang",
        lent_id: 1391,
        lent_time: new Date("2022-12-17T01:30:51.000Z"),
        expire_time: new Date("2023-01-08T14:59:59.000Z"),
        is_expired: false,
      },
    ],
  },
  {
    cabinet_id: 115,
    cabinet_num: 55,
    lent_type: CabinetType.CIRCLE,
    cabinet_title: "42cabi",
    max_user: 1,
    status: CabinetStatus.SET_EXPIRE_FULL,
    section: "Cluster 1 - Terrace",
    lent_info: [
      {
        user_id: 110902,
        intra_id: "sooyang",
        lent_id: 1391,
        lent_time: new Date("2022-12-17T01:30:51.000Z"),
        expire_time: new Date("2023-01-08T14:59:59.000Z"),
        is_expired: false,
      },
    ],
  },
  {
    cabinet_id: 116,
    cabinet_num: 56,
    lent_type: CabinetType.CIRCLE,
    cabinet_title: "42checkIn",
    max_user: 1,
    status: CabinetStatus.BROKEN,
    section: "Cluster 1 - Terrace",
    lent_info: [
      {
        user_id: 110902,
        intra_id: "sooyang",
        lent_id: 1391,
        lent_time: new Date("2022-12-17T01:30:51.000Z"),
        expire_time: new Date("2023-01-08T14:59:59.000Z"),
        is_expired: false,
      },
    ],
  },
  {
    cabinet_id: 117,
    cabinet_num: 57,
    lent_type: CabinetType.PRIVATE,
    cabinet_title: "42checkIn",
    max_user: 1,
    status: CabinetStatus.BANNED,
    section: "Cluster 1 - Terrace",
    lent_info: [
      {
        user_id: 110902,
        intra_id: "sooyang",
        lent_id: 1391,
        lent_time: new Date("2022-12-17T01:30:51.000Z"),
        expire_time: new Date("2023-01-08T14:59:59.000Z"),
        is_expired: false,
      },
    ],
  },
];

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

const MainPage = () => {
  const navigator = useNavigate();
  const CabinetListWrapperRef = useRef<HTMLDivElement>(null);
  const [colNum, setColNum] = useState<number>(4);
  // .env에서 가져올 실제 col_num 값입니다.
  const maxColNum = 7;
  const token = getCookie("access_token");
  const [user, setUser] = useRecoilState<UserDto>(userInfoState);
  const [myLentInfo, setMyLentInfo] =
    useRecoilState<MyCabinetInfoResponseDto>(myLentInfoState);
  const [currentFloor, setCurrentFloor] =
    useRecoilState<number>(currentFloorState);
  const [currentFloorData, setCurrentFloorData] =
    useRecoilState<CabinetInfoByLocationFloorDto>(currentFloorDataState);
  const setColNumByDivWidth = () => {
    if (CabinetListWrapperRef.current !== null)
      setColNum(
        Math.min(
          Math.floor(CabinetListWrapperRef.current.offsetWidth / 90),
          maxColNum
        )
      );
  };

  useEffect(() => {
    if (CabinetListWrapperRef.current !== null) setColNumByDivWidth();

    window.addEventListener("resize", setColNumByDivWidth);
    return () => {
      window.removeEventListener("resize", setColNumByDivWidth);
    };
  }, [CabinetListWrapperRef.current]);

  useEffect(() => {
    if (!token) navigator("/");
    if (user.intra_id === "default") {
      axiosMyInfo()
        .then((response) => {
          setUser(response.data);
          //if (response.data.cabinet_id !== -1) navigate("/lent");
        })
        .catch((error) => {
          //navigate("/");
        });
      axiosMyLentInfo().then((response) => {
        setMyLentInfo(response.data);
      });
    } else {
      axiosMyInfo()
        .then((response) => {
          //dispatch(setUserCabinet(response.data.cabinet_id));
          setUser({ ...user, cabinet_id: response.data.cabinet_id });
        })
        .catch((error) => {
          //navigate("/");
        });
    }
    axiosCabinetByLocationFloor("새롬관", currentFloor)
      .then((response) => {
        console.log(response.data);
        setCurrentFloorData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <>
      <TopNavContainer />
      <WrapperStyled onClick={() => console.log(myLentInfo)}>
        <LeftNavContainer />
        <LeftNavOptionContainer />
        <MainStyled>
          <SectionPaginationContainer />
          <CabinetListWrapperStyled ref={CabinetListWrapperRef}>
            <CabinetListContainer colNum={colNum} cabinetInfo={CABINETS} />
          </CabinetListWrapperStyled>
        </MainStyled>
        <DetailInfoContainerStyled>
          <CabinetInfoArea selectedCabinetInfo={CabinetInfoDummy} />
        </DetailInfoContainerStyled>
      </WrapperStyled>
    </>
  );
};

const WrapperStyled = styled.div`
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

const DetailInfoContainerStyled = styled.div`
  min-width: 330px;
  padding-top: 45px;
  border-left: 1px solid var(--line-color);
`;

const CabinetListWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export default MainPage;
