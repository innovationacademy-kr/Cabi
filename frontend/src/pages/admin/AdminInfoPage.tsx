import AdminDetailInfo from "@/components/AdminInfo/AdminDetailInfo";
import { useFetchData } from "@/hooks/useFetchData";
import { selectAdminDetailState } from "@/recoil/atoms";
import {
  ICabinetNumbersPerFloor,
  IData,
  IMonthlyData,
} from "@/types/dto/admin.dto";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import BarChart from "../../components/AdminInfo/Chart/BarChart";
import LineChart from "../../components/AdminInfo/Chart/LineChart";
import PieChart from "../../components/AdminInfo/Chart/PieChart";
import AdminTable from "../../components/AdminInfo/Table/AdminTable";

const AdminInfo = () => {
  const [toggle, setToggle] = useState(false);
  const [overdueUserList, setOverdueUserList] = useState<IData[]>([]);
  const [brokenCabinetList, setBrokenCabinetList] = useState<IData[]>([]);
  const [bannedUserList, setBannedUserList] = useState<IData[]>([]);
  const [cabinetNumbersPerFloor, setCabinetNumbersPerFloor] = useState<
    ICabinetNumbersPerFloor[]
  >([]);
  const [monthlyData, setMonthlyData] = useState<IMonthlyData[]>([]);
  const setAdminDetail = useSetRecoilState(selectAdminDetailState);

  const onClick = (
    e: React.MouseEvent<Element>,
    setToggle: React.Dispatch<React.SetStateAction<boolean>>,
    type: string
  ) => {
    const target = e.currentTarget as HTMLTableElement;
    const data = JSON.parse(target.dataset.info as string);
    data.type = type;
    setAdminDetail(data);
    setToggle(true);
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
        <H2styled>월간 이용 현황</H2styled>
        <LineChart data={monthlyData} />
      </ContainerStyled>
      <ContainerStyled>
        <H2styled>반납지연 유저</H2styled>
        <AdminTable
          data={overdueUserList}
          handleClick={(e) => onClick(e, setToggle, "overdue")}
          thInfo={["Intra ID", "위치", "연체일"]}
          ratio={["33%", "33%", "33%"]}
        />
      </ContainerStyled>
      <ContainerStyled>
        <H2styled>사용정지 유저</H2styled>
        <AdminTable
          data={bannedUserList}
          handleClick={(e) => onClick(e, setToggle, "banned")}
          thInfo={["Intra ID", "사용정지 일", "기간"]}
          ratio={["33%", "33%", "33%"]}
        />
      </ContainerStyled>
      <ContainerStyled>
        <H2styled>고장 사물함</H2styled>
        <AdminTable
          data={brokenCabinetList}
          handleClick={(e) => onClick(e, setToggle, "broken")}
          thInfo={["위치 정보", "확인 일자", "사유"]}
          ratio={["30%", "40%", "30%"]}
          fontSize={["1rem", "0.8rem", "1rem"]}
        />
      </ContainerStyled>
      <BackgroundStyled onClick={() => setToggle(false)} toggle={toggle} />
      <AdminDetailInfo toggle={toggle} />
    </AdminInfoStyled>
  );
};

const H2styled = styled.h2`
  font-size: 1.25rem;
  padding-top: 15px;
  text-align: center;
  font-weight: bold;
`;

const BackgroundStyled = styled.div<{ toggle: boolean }>`
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  left: 0;
  top: 0;
  z-index: 2;
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
