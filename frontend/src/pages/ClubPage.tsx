import { useEffect, useState } from "react";
import styled from "styled-components";
import { ClubPageInfo } from "@/components/Club/ClubPageInfo";
import MultiToggleSwitch2, {
  toggleItem,
} from "@/components/Common/MultiToggleSwitch2";
import { ClubListReponseType } from "@/types/dto/club.dto";
import { axiosMyClubInfo } from "@/api/axios/axios.custom";

const ClubPage = () => {
  const [toggleType, setToggleType] = useState<string>("");
  const [toggleList, setToggleList] = useState<toggleItem[]>([]);
  const [page, setPage] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [clubList, setClubList] = useState<ClubListReponseType>(undefined);

  useEffect(() => {
    setToggleType(clubList?.result[0].clubId.toString());
    const clubToToggle = clubList.result.map((club) => {
      return {
        name: club.clubName.toString(),
        key: club.clubId.toString(),
      };
    });
    setToggleList(clubToToggle);
  }, [clubList]);

  useEffect(() => {
    getMyClubInfo();
  }, []);

  const getMyClubInfo = async () => {
    try {
      const response = await axiosMyClubInfo();
      const result = response.data.result;
      const totalLength = response.data.totalLength;
      setClubList({ result, totalLength });
      setTotalPage(totalLength);
    } catch (error) {
      throw error;
    }
  };

  return (
    <WrapperStyled>
      <ContainerStyled>
        <TitleStyled>동아리 정보</TitleStyled>
        <MultiToggleSwitch2
          initialState={toggleType}
          setState={setToggleType}
          toggleList={toggleList}
          setPage={setPage}
        />
        <ClubPageInfo></ClubPageInfo>
      </ContainerStyled>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const ContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 112px 0 0 0;
  padding-bottom: 112px;
  width: 795px;
  height: 100%;
`;

const TitleStyled = styled.div`
  text-align: center;
  font-size: 2rem;
  letter-spacing: -0.02rem;
  font-weight: 700;
  margin-bottom: 30px;
`;

export default ClubPage;
