import {
  axiosGetActivationList,
  axiosGetBanList,
} from "@/api/axios/axios.custom";
import { ActivationDto, BanDto } from "@/types/dto/lent.dto";
import { useEffect, useState } from "react";
import styled from "styled-components";
import ActivationTable from "./ActivationTable";
import BanTable from "./BanTable";

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
const AdminPreview = () => {
  const [activationList, setActivationList] = useState<ActivationDto[]>([]);
  const [banList, setBanList] = useState<BanDto[]>([]);
  useEffect(() => {
    async function getData() {
      const { data: activationResponse } = await axiosGetActivationList();
      console.log("activationResponse : ", activationResponse.result);
      setActivationList(activationResponse.result);
      console.log("activation faild");
      const { data: banResponse } = await axiosGetBanList();
      console.log("banResponse : ", banResponse);
      setBanList(banResponse.result);
      console.log("ban failed");
    }
    getData();
  }, []);
  return (
    <AdminPreviewStyled>
      <CabinetInfoSectionStyled>
        <ForciblyReturnedListStyled>
          <h1>강제 반납 리스트</h1>
          <ActivationTable data={activationList} />
        </ForciblyReturnedListStyled>
        <UnavailableListStyled>
          <h1>사용 불가 리스트</h1>
          <BanTable data={banList} />
        </UnavailableListStyled>
      </CabinetInfoSectionStyled>
      <CabinetDetailSectionStyled />
    </AdminPreviewStyled>
  );
};

const ListStyled = styled.div`
  width: 45%;
  height: 90%;
  & > h1 {
    font-size: 2rem;
    letter-spacing: -0.02rem;
    font-weight: 700;
    margin: 25px;
    text-align: center;
  }
`;

const ForciblyReturnedListStyled = styled(ListStyled)``;
const UnavailableListStyled = styled(ListStyled)``;

const CabinetInfoSectionStyled = styled.div`
  width: 100%;
  height: 100%;
  background-color: var(--white);
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const CabinetDetailSectionStyled = styled.div`
  min-width: 330px;
  height: 100%;
  background: gray;
  position: relative;
  border-left: 1px solid var(--line-color);
  background-color: var(--white);
  overflow-y: auto;
`;

const AdminPreviewStyled = styled.div`
  background: skyblue;
  flex: 1;
  height: 100%;
  display: flex;
`;

export default AdminPreview;
