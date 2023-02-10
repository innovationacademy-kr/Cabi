import {
  axiosGetActivationList,
  axiosGetBanList,
} from "@/api/axios/axios.custom";
import { ActivationDto, BanDto } from "@/types/dto/lent.dto";
import React, { useEffect, useState } from "react";
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

const AdminPreview = ({
  checkData,
}: {
  checkData: React.MouseEventHandler;
}) => {
  const [activationList, setActivationList] = useState<ActivationDto[]>([]);
  const [banList, setBanList] = useState<BanDto[]>([]);

  useEffect(() => {
    async function getData() {
      const { data: activationResponse } = await axiosGetActivationList();
      setActivationList(activationResponse.result);
      const { data: banResponse } = await axiosGetBanList();
      setBanList(banResponse.result);
    }
    getData();
  }, []);
  return (
    <AdminPreviewStyled>
      <AdminScrollStyled>
        <CabinetInfoSectionStyled>
          <ForciblyReturnedListStyled>
            <h1>강제 반납 리스트</h1>
            <ActivationTable data={data1} clickDetail={checkData} />
          </ForciblyReturnedListStyled>
          <UnavailableListStyled>
            <h1>사용 불가 리스트</h1>
            <BanTable data={data2} clickDetail={checkData} />
          </UnavailableListStyled>
        </CabinetInfoSectionStyled>
      </AdminScrollStyled>
      <CabinetDetailSectionStyled />
    </AdminPreviewStyled>
  );
};

const ListStyled = styled.div`
  width: 45%;
  height: 100%;
  & > h1 {
    font-size: 2rem;
    letter-spacing: -0.02rem;
    font-weight: 700;
    margin: 40px;
    text-align: center;
  }
  @media screen and (max-width: 1200px) {
    width: 80%;
    margin: 40px auto;
    &:last-child {
      padding-top: 15px;
    }
  }
  @media screen and (max-width: 768px) {
    width:80%;
    height:50%;
    margin : 0 auto;
    & > h1 {
      margin: 0px;
      margin-bottom:40px;
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
  @media screen and (max-width: 768px) {
    overflow: scorll;
    background: var(--white);
    display: block;
  }
`;

const CabinetDetailSectionStyled = styled.div`
  min-width: 330px;
  height: 100%;
  background: var(--white);
  position: relative;
  border-left: 1px solid var(--line-color);
  background-color: var(--white);
  overflow-y: auto;
  transition: 0.5s;
  @media screen and (max-width: 1200px) {
    display: none;
    min-width: 0;
  }
`;

const AdminScrollStyled = styled.div`
  height: 90%;
  flex: 1;
  @media screen and (max-width: 768px) {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
`;

const AdminPreviewStyled = styled.div`
  min-width: 50%;
  background: var(--white);
  flex: 1;
  height: 100%;
  display: flex;
  @media screen and (max-width: 768px) {
    width: 100%;
    height: 50%;
  }
`;

export default AdminPreview;
