import { axiosCabinetById } from "@/api/axios/axios.custom";
import { useFetchData } from "@/hooks/useFetchData";
import useMenu from "@/hooks/useMenu";
import {
  bannedUserListState,
  brokenCabinetListState,
  currentCabinetIdState,
  overdueCabinetListState,
  selectedTypeOnSearchState,
  targetCabinetInfoState,
  targetUserInfoState,
} from "@/recoil/atoms";
import {
  ICabinetNumbersPerFloor,
  IData,
  IMonthlyData,
} from "@/types/dto/admin.dto";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import BarChart from "../../components/AdminInfo/Chart/BarChart";
import LineChart from "../../components/AdminInfo/Chart/LineChart";
import PieChart from "../../components/AdminInfo/Chart/PieChart";
import AdminTable from "../../components/AdminInfo/Table/AdminTable";

const AdminInfo = () => {
  const [overdueUserList, setOverdueUserList] = useRecoilState<IData[]>(
    overdueCabinetListState
  );
  const [brokenCabinetList, setBrokenCabinetList] = useRecoilState<IData[]>(
    brokenCabinetListState
  );
  const [bannedUserList, setBannedUserList] =
    useRecoilState<IData[]>(bannedUserListState);
  const [cabinetNumbersPerFloor, setCabinetNumbersPerFloor] = useState<
    ICabinetNumbersPerFloor[]
  >([]);
  const [monthlyData, setMonthlyData] = useState<IMonthlyData[]>([]);
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
      if (str) cabinetId = JSON.parse(str)?.cabinet_id;
      getData(cabinetId);
      setSelectedTypeOnSearch("CABINET");
    } else {
      setSelectedTypeOnSearch("USER");
      let result;
      if (str) {
        result = JSON.parse(str);
        setTargetUserInfo({
          intraId: result.intra_id,
          userId: result.user_id,
          bannedDate: result.banned_date,
          unbannedDate: result.unbanned_date,
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
    useFetchData(
      setMonthlyData,
      setBannedUserList,
      setBrokenCabinetList,
      setCabinetNumbersPerFloor,
      setOverdueUserList
    );
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
    </AdminInfoStyled>
  );
};

const H2styled = styled.h2`
  font-size: 1.25rem;
  padding-top: 15px;
  text-align: center;
  font-weight: bold;
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
