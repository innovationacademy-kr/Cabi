import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import {
  bannedUserListState,
  brokenCabinetListState,
  currentCabinetIdState,
  overdueCabinetListState,
  selectedTypeOnSearchState,
  targetCabinetInfoState,
  targetUserInfoState,
} from "@/Cabinet/recoil/atoms";
import BarChart from "@/Cabinet/components/AdminInfo/Chart/BarChart";
import LineChart from "@/Cabinet/components/AdminInfo/Chart/LineChart";
import PieChart from "@/Cabinet/components/AdminInfo/Chart/PieChart";
import AdminTable from "@/Cabinet/components/AdminInfo/Table/AdminTable";
import {
  ICabinetNumbersPerFloor,
  IMonthlyData,
  ITableData,
} from "@/Cabinet/types/dto/admin.dto";
import { CabinetInfo } from "@/Cabinet/types/dto/cabinet.dto";
import { axiosCabinetById } from "@/Cabinet/api/axios/axios.custom";
import { useAdminHomeApi } from "@/Cabinet/hooks/useAdminHomeApi";
import useMenu from "@/Cabinet/hooks/useMenu";

const AdminHomePage = () => {
  const [overdueUserList, setOverdueUserList] = useRecoilState<ITableData[]>(
    overdueCabinetListState
  );
  const [brokenCabinetList, setBrokenCabinetList] = useRecoilState<
    ITableData[]
  >(brokenCabinetListState);
  const [bannedUserList, setBannedUserList] =
    useRecoilState<ITableData[]>(bannedUserListState);
  const [cabinetNumbersPerFloor, setCabinetNumbersPerFloor] = useState<
    ICabinetNumbersPerFloor[]
  >([]);

  const createDummyArray = (count: number) => {
    const dummyArray = [];
    const currentDate = new Date();
    let dates = [];
    dates[0] = currentDate;
    for (let i = 1; i < count + 1; i++) {
      dates[i] = new Date(currentDate.setDate(currentDate.getDate() - 7));
    }

    for (let i = 0; i < count; i++) {
      const dummyObject = {
        endDate: dates[i].toDateString(),
        startDate: dates[i + 1].toDateString(),
        lentEndCount: 0,
        lentStartCount: 0,
      };
      dummyArray.push(dummyObject);
    }

    return dummyArray.reverse();
  };

  const [monthlyData, setMonthlyData] = useState<IMonthlyData[]>(
    createDummyArray(4)
  );
  const { openCabinet } = useMenu();
  const setSelectedTypeOnSearch = useSetRecoilState(selectedTypeOnSearchState);
  const setTargetCabinetInfo = useSetRecoilState<CabinetInfo>(
    targetCabinetInfoState
  );
  const setCurrentCabinetId = useSetRecoilState(currentCabinetIdState);
  const setTargetUserInfo = useSetRecoilState(targetUserInfoState);

  const onClick = (e: React.MouseEvent<Element>, type: string) => {
    const target = e.currentTarget as HTMLTableElement;
    const str = target.dataset.info;
    openCabinet();
    if (type === "broken" || type === "overdue") {
      let cabinetId = -1;
      if (str) cabinetId = JSON.parse(str)?.cabinetId;
      getData(cabinetId);
      setSelectedTypeOnSearch("CABINET");
    } else {
      setSelectedTypeOnSearch("USER");
      let result;
      if (str) {
        result = JSON.parse(str);
        setTargetUserInfo({
          name: result.name,
          userId: result.userId,
          bannedAt: result.bannedAt,
          unbannedAt: result.unbannedAt,
        });
      }
    }
    async function getData(cabinetId: number) {
      try {
        const { data } = await axiosCabinetById(cabinetId);
        setCurrentCabinetId(cabinetId);
        setTargetCabinetInfo(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    useAdminHomeApi(
      setMonthlyData,
      setBannedUserList,
      setBrokenCabinetList,
      setCabinetNumbersPerFloor,
      setOverdueUserList
    );
  }, []);
  return (
    <AdminHomeStyled>
      <ContainerStyled>
        <H2styled>층별 이용 현황</H2styled>
        <BarChart data={cabinetNumbersPerFloor} />
      </ContainerStyled>
      <ContainerStyled>
        <H2styled>사물함 현황</H2styled>
        <PieChart data={cabinetNumbersPerFloor} />
      </ContainerStyled>
      <ContainerStyled>
        <H2styled>주간 이용 현황</H2styled>
        <LineChart data={monthlyData} />
      </ContainerStyled>
      <ContainerStyled>
        <H2styled>반납지연 유저</H2styled>
        <AdminTable
          data={overdueUserList}
          handleClick={(e) => onClick(e, "overdue")}
          thInfo={["Intra ID", "위치", "연체일"]}
          ratio={["33%", "33%", "33%"]}
          ROW_COUNT={5}
        />
      </ContainerStyled>
      <ContainerStyled>
        <H2styled>사용정지 유저</H2styled>
        <AdminTable
          data={bannedUserList}
          handleClick={(e) => onClick(e, "banned")}
          thInfo={["Intra ID", "사용정지 일", "기간"]}
          ratio={["33%", "33%", "33%"]}
          ROW_COUNT={5}
        />
      </ContainerStyled>
      <ContainerStyled>
        <H2styled>고장 사물함</H2styled>
        <AdminTable
          data={brokenCabinetList}
          handleClick={(e) => onClick(e, "broken")}
          thInfo={["위치", "섹  션", ""]}
          ratio={["50%", "50%", "0%"]}
          fontSize={["1rem", "0.8rem", "1rem"]}
          ROW_COUNT={5}
        />
      </ContainerStyled>
    </AdminHomeStyled>
  );
};

const H2styled = styled.h2`
  font-size: 1.25rem;
  line-height: 2rem;
  text-align: center;
  font-weight: bold;
`;

const ContainerStyled = styled.div`
  height: 90%;
  width: 100%;
  min-width: 0;
  min-height: 0;
  background: var(--bg-color);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  &:nth-child(4) {
    padding-bottom: 20px;
  }
  &:nth-child(5) {
    padding-bottom: 20px;
  }
  &:nth-child(6) {
    padding-bottom: 20px;
  }
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

const AdminHomeStyled = styled.div`
  background: var(--bg-color);
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  place-items: center;
  min-height: 775px;

  @media screen and (max-width: 1300px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 500px);
    overflow: scroll;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(6, 500px);
    min-width: 300px;
    overflow: scroll;
  }
`;

export default AdminHomePage;
