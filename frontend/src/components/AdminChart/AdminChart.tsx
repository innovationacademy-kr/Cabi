import { useEffect, useState } from "react";
import styled from "styled-components";
import { axiosGetCabinetState } from "@/api/axios/axios.custom";
import PieChart from "./PieChart";
import BarChart from "./BarChart";

const resData = [
  { floor: 2, total: 148, used: 114, overdue: 0, unused: 26, disabled: 8 },
  { floor: 4, total: 100, used: 73, overdue: 1, unused: 21, disabled: 5 },
  { floor: 5, total: 96, used: 62, overdue: 0, unused: 27, disabled: 7 },
];

interface IRentInfo {
  floor: number;
  total: number;
  used: number;
  overdue: number;
  unused: number;
  disabled: number;
}

const AdminChart = () => {
  const [rentInfo, setRentInfo] = useState<IRentInfo[]>([]);
  useEffect(() => {
    async function getData() {
      const { data } = await axiosGetCabinetState();
      setRentInfo(data);
    }
    getData();
  }, []);
  return (
    <AdminChartStyled>
      <BarChart data={rentInfo} />
      <PieChart data={rentInfo} />
    </AdminChartStyled>
  );
};

const AdminChartStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export default AdminChart;
