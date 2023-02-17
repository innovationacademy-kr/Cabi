import { ActivationDto, BanDto } from "@/types/dto/lent.dto";
import { useState } from "react";
import styled from "styled-components";
import BarChart from "./Chart/BarChart";
import LineChart from "./Chart/LineChart";
import PieChart from "./Chart/PieChart";
import AdminTable from "./Table/AdminTable";
const resData = [
  { floor: 2, total: 148, used: 114, overdue: 0, unused: 26, disabled: 8 },
  { floor: 4, total: 100, used: 73, overdue: 1, unused: 21, disabled: 5 },
  { floor: 5, total: 96, used: 62, overdue: 0, unused: 27, disabled: 7 },
];

interface IData {
  first?: string;
  second?: string;
  third?: string;
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

const data2 = [
  {
    first: "2F-11",
    second: "22.11.11",
  },
  {
    first: "4F-15",
    second: "23.12.11",
    third: "배터리",
  },
];

const data3 = [
  {
    first: "yooh",
    second: "13일",
    third: "X",
  },
  {
    first: "sichoi",
    second: "15일",
    third: "O",
  },
  {
    first: "sanan",
    second: "2일",
    third: "X",
  },
  {
    first: "jaesjeon",
    second: "555일",
    third: "X",
  },

  {
    first: "eunbikim",
    second: "32일",
    third: "O",
  },
  {
    first: "inshin",
    second: "17일",
    third: "X",
  },
  {
    first: "seycho",
    second: "2일",
    third: "O",
  },
  {
    first: "joopark",
    second: "1일",
    third: "X",
  },
  {
    first: "huchoi",
    second: "14일",
    third: "O",
  },
  {
    first: "dongglee",
    second: "17일",
    third: "X",
  },
];
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
          <LineChart data={resData} />
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
            data={data3.sort((a, b) => parseInt(b.second) - parseInt(a.second))}
            handleClick={onClick}
            thInfo={["Intra ID", "연체 일 수", "반납 여부"]}
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
