import {
  axiosGetBanndUserList,
  axiosGetBrokenCabinetList,
  axiosGetCabinetNumbersPerFloor,
  axiosGetStatistics,
} from "@/api/axios/axios.custom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import BarChart from "./Chart/BarChart";
import LineChart from "./Chart/LineChart";
import PieChart from "./Chart/PieChart";
import {
  handleBannedUserList,
  handleBrokenCabinetList,
} from "./convertFunctions";
import AdminTable from "./Table/AdminTable";
const resData = [
  { floor: 2, total: 148, used: 114, overdue: 0, unused: 26, disabled: 8 },
  { floor: 4, total: 100, used: 73, overdue: 1, unused: 21, disabled: 5 },
  { floor: 5, total: 96, used: 62, overdue: 0, unused: 27, disabled: 7 },
];

interface ICabinetNumbersPerFloor {
  floor: number;
  total: number;
  used: number;
  overdue: number;
  unused: number;
  disabled: number;
}

interface IData {
  first?: string;
  second?: string;
  third?: string;
}

const data1 = [
  {
    first: "yooh",
    second: "2F-150",
    third: "3일",
  },
  {
    first: "sichoi",
    second: "5F-3",
    third: "13일",
  },
  {
    first: "sanan",
    second: "2F-77",
    third: "1일",
  },
  {
    first: "jaesjeon",
    second: "4F-23",
    third: "233일",
  },

  {
    first: "eunbikim",
    second: "4F-54",
    third: "43일",
  },
  {
    first: "inshin",
    second: "5F-78",
    third: "42일",
  },
  {
    first: "seycho",
    second: "4F-11",
    third: "21일",
  },
  {
    first: "joopark",
    second: "2F-46",
    third: "9일",
  },
  {
    first: "huchoi",
    second: "5F-10",
    third: "31일",
  },
  {
    first: "dongglee",
    second: "2F-5",
    third: "1일",
  },
];

const AdminInfo = () => {
  const [toggle, setToggle] = useState(false);
  const [brokenCabinetList, setBrokenCabinetList] = useState<IData[]>([]);
  const [bannedUserList, setBannedUserList] = useState<IData[]>([]);
  const [cabinetNumbersPerFloor, setCabinetNumbersPerFloor] = useState<
    ICabinetNumbersPerFloor[]
  >([]);
  const onClick = () => setToggle(!toggle);
  useEffect(() => {
    async function getData() {
      const bannedUserData = await axiosGetBanndUserList();
      const brokenCabinetData = await axiosGetBrokenCabinetList();
      const statisticsData = await axiosGetStatistics(0, 5000);
      const cabinetNumbersPerFloorData = await axiosGetCabinetNumbersPerFloor();
      setBannedUserList(handleBannedUserList(bannedUserData));
      setBrokenCabinetList(handleBrokenCabinetList(brokenCabinetData));
      setCabinetNumbersPerFloor(cabinetNumbersPerFloorData);
    }
    getData();
  }, []);
  return (
    <AdminInfoStyled>
      <ContainerStyled>
        <H2styled>층별 이용 현황</H2styled>
        <BarChart data={cabinetNumbersPerFloor} />
      </ContainerStyled>
      <ContainerStyled>
        <H2styled>사물함 현황</H2styled>
        <PieChart data={cabinetNumbersPerFloor} />
      </ContainerStyled>
      <ContainerStyled>
        <H2styled>월간 이용 현황</H2styled>
        <LineChart data={cabinetNumbersPerFloor} />
      </ContainerStyled>
      <ContainerStyled>
        <H2styled>반납지연 유저</H2styled>
        <AdminTable
          data={data1}
          handleClick={onClick}
          thInfo={["Intra ID", "위치", "연체일"]}
          ratio={["33%", "33%", "33%"]}
        />
      </ContainerStyled>
      <ContainerStyled>
        <H2styled>사용정지 유저</H2styled>
        <AdminTable
          data={bannedUserList}
          handleClick={onClick}
          thInfo={["Intra ID", "사용정지 일", "기간"]}
          ratio={["33%", "33%", "33%"]}
        />
      </ContainerStyled>
      <ContainerStyled>
        <H2styled>고장 사물함</H2styled>
        <AdminTable
          data={brokenCabinetList}
          handleClick={onClick}
          thInfo={["위치 정보", "확인 일자", "사유"]}
          ratio={["30%", "40%", "30%"]}
          fontSize={["1rem", "0.8rem", "1rem"]}
        />
      </ContainerStyled>
      <DetailInfoStyled toggle={toggle} />
    </AdminInfoStyled>
  );
};

const H2styled = styled.h2`
  font-size: 1.25rem;
  padding-top: 15px;
  text-align: center;
  font-weight: bold;
`;

const DetailInfoStyled = styled.div<{ toggle: boolean }>`
  min-width: 330px;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  padding: 45px 40px 20px;
  border-left: 1px solid var(--line-color);
  background-color: var(--white);
  overflow-y: auto;
  display: ${({ toggle }) => (toggle ? "block" : "none")};
`;

const ContainerStyled = styled.div`
  height: 90%;
  width: 100%;
  min-width: 0;
  min-height: 0;
  background: var(--white);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  @media screen and (max-width: 1300px) {
    &:nth-child(1) {
      order: 6;
    }
    &:nth-child(2) {
      order: 5;
    }
    &:nth-child(3) {
      order: 4;
    }
    &:nth-child(4) {
      order: 3;
    }
    &:nth-child(5) {
      order: 2;
    }
    &:nth-child(6) {
      order: 1;
    }
  }
`;

const AdminInfoStyled = styled.div`
  background: var(--white);
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-row: repeat(2, 1fr);
  place-items: center;
  overflow: hidden;

  @media screen and (max-width: 1300px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 500px);
    overflow: scroll;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(6, 500px);
    min-width: 500px;
    overflow: scroll;
  }
`;

export default AdminInfo;
