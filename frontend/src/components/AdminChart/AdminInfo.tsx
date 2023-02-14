import { ActivationDto, BanDto } from "@/types/dto/lent.dto";
import styled from "styled-components";
import ActivationTable from "./ActivationTable";
import BanTable from "./BanTable";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
const resData = [
  { floor: 2, total: 148, used: 114, overdue: 0, unused: 26, disabled: 8 },
  { floor: 4, total: 100, used: 73, overdue: 1, unused: 21, disabled: 5 },
  { floor: 5, total: 96, used: 62, overdue: 0, unused: 27, disabled: 7 },
];

function createData1() {
  const result: ActivationDto[] = [];
  for (let i = 0; i < 15; i++) {
    result.push({
      floor: Math.floor(Math.random() * 5) + 1,
      note: `Position${i + 1}`,
      cabinet_num: i + 1,
    });
  }
  return result;
}

function createData2() {
  const result: BanDto[] = [];
  for (let i = 0; i < 25; i++) {
    result.push({
      floor: Math.floor(Math.random() * 5) + 1,
      section: `Position${i + 1}`,
      cabinet_num: i + 1,
    });
  }
  return result;
}

const data1 = createData1();
const data2 = createData2();

const AdminInfo = () => {
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
          <ActivationTable data={data1} />
        </ContainerStyled>
        <ContainerStyled>
          <BanTable data={data2} />
        </ContainerStyled>
        <ContainerStyled>
          <ActivationTable data={data1} />
        </ContainerStyled>
      </AdminInfoRowStyled>
    </AdminInfoStyled>
  );
};

const ContainerStyled = styled.div`
  width: 31%;
  height: 100%;
  background: yellow;
`;

const AdminInfoRowStyled = styled.div`
  width: 100%;
  height: 45%;
  background: skyblue;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const AdminInfoStyled = styled.div`
  background: pink;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
`;

export default AdminInfo;
