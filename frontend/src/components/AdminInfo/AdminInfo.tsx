import { ActivationDto, BanDto } from "@/types/dto/lent.dto";
import { useState } from "react";
import styled from "styled-components";
import BarChart from "./Chart/BarChart";
import PieChart from "./Chart/PieChart";
import AdminTable from "./Table/AdminTable";
const resData = [
  { floor: 2, total: 148, used: 114, overdue: 0, unused: 26, disabled: 8 },
  { floor: 4, total: 100, used: 73, overdue: 1, unused: 21, disabled: 5 },
  { floor: 5, total: 96, used: 62, overdue: 0, unused: 27, disabled: 7 },
];

interface IData {
  first: string;
  second: string;
  third: string;
}

function createData1() {
  const result: IData[] = [];
  for (let i = 0; i < 7; i++) {
    result.push({
      first: (Math.floor(Math.random() * 5) + 1).toString(),
      second: `Position${i + 1}`,
      third: (i + 1).toString(),
    });
  }
  return result;
}

function createData2() {
  const result: IData[] = [];
  for (let i = 0; i < 8; i++) {
    result.push({
      first: (Math.floor(Math.random() * 5) + 1).toString(),
      second: `Position${i + 1}`,
      third: (i + 1).toString(),
    });
  }
  return result;
}

function createData3() {
  const result: IData[] = [];
  for (let i = 0; i < 15; i++) {
    result.push({
      first: (Math.floor(Math.random() * 5) + 1).toString(),
      second: `Position${i + 1}`,
      third: (i + 1).toString(),
    });
  }
  return result;
}

const data1 = createData1();
const data2 = createData2();
const data3 = createData3();

const AdminInfo = () => {
  const [toggle, setToggle] = useState(false);
  const onClick = () => setToggle(!toggle);
  return (
    <AdminInfoStyled>
      <AdminInfoRowStyled>
        <ContainerStyled>
          <BarChart data={resData} />
        </ContainerStyled>
        <ContainerStyled>
          <PieChart data={resData} />
        </ContainerStyled>
        <ContainerStyled>
          <BarChart data={resData} />
        </ContainerStyled>
      </AdminInfoRowStyled>
      <AdminInfoRowStyled>
        <ContainerStyled>
          <H2styled>연체 사물함</H2styled>
          <AdminTable
            data={data1}
            handleClick={onClick}
            thInfo={["Intra ID", "위치", "연체일"]}
            ratio={["33%", "33%", "33%"]}
          />
        </ContainerStyled>
        <ContainerStyled>
          <H2styled>고장 사물함</H2styled>
          <AdminTable
            data={data2}
            handleClick={onClick}
            thInfo={["위치 정보", "고장일", "고장원인"]}
            ratio={["33%", "33%", "33%"]}
          />
        </ContainerStyled>
        <ContainerStyled>
          <H2styled>페널티 사용자</H2styled>
          <AdminTable
            data={data3}
            handleClick={onClick}
            thInfo={["위치", "번호", "Intra ID"]}
            ratio={["33%", "33%", "33%"]}
          />
        </ContainerStyled>
      </AdminInfoRowStyled>
      <DetailInfoStyled toggle={toggle} />
    </AdminInfoStyled>
  );
};

const H2styled = styled.h2`
  font-size: 1.25rem;
  padding: 15px;
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
  width: 31%;
  height: 100%;
  background: var(--white);
`;

const AdminInfoRowStyled = styled.div`
  width: 100%;
  height: 45%;
  background: var(--white);
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const AdminInfoStyled = styled.div`
  background: var(--white);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
`;

export default AdminInfo;
