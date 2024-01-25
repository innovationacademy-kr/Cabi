import { useEffect, useState } from "react";
import styled from "styled-components";
import ClubCabinetInfo from "@/components/Club/ClubCabinetInfo";
import ClubMembers from "@/components/Club/ClubMembers";
import MultiToggleSwitch2, {
  toggleItem,
} from "@/components/Common/MultiToggleSwitch2";
import {
  ClubInfoResponseDto,
  ClubPaginationResponseDto,
} from "@/types/dto/club.dto";
import { axiosGetClubInfo, axiosMyClubInfo } from "@/api/axios/axios.custom";

const ClubPage = () => {
  const [clubList, setClubList] = useState<ClubPaginationResponseDto>({
    result: [
      {
        clubId: 0,
        clubName: "",
        clubMaster: "",
      },
    ],
    totalLength: 0, // totalLength : (지금은) 동아리 총 개수. 추후 바뀔수 있음
  });
  const [page, setPage] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [toggleType, setToggleType] = useState<string>("");
  const [toggleList, setToggleList] = useState<toggleItem[]>([
    { name: "", key: "" },
  ]);
  const [clubInfo, setClubInfo] = useState<ClubInfoResponseDto>({
    clubName: "",
    clubMaster: "",
    clubMemo: "",
    building: "새롬관",
    floor: 3,
    section: "",
    visibleNum: 0,
    clubUsers: [
      {
        userId: 0,
        userName: "",
      },
    ],
    clubUserCount: 0,
  });

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
    if (clubList?.result[0].clubId) {
      getClubInfo(clubList?.result[0].clubId);
    }
  }, [clubList?.result[0].clubId]);

  const getClubInfo = async (clubId: number) => {
    try {
      const result = await axiosGetClubInfo(clubId, page, 100);
      setClubInfo(result.data);
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
        <ClubCabinetStyled>
          <ClubCabinetInfo />
        </ClubCabinetStyled>
        <ClubMembers
          master={clubList?.result[0].clubMaster.toString()}
          clubId={clubList?.result[0].clubId}
          clubInfo={clubInfo}
        />
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

const ClubCabinetStyled = styled.div`
  width: 100%;
  height: 340px;
  margin-top: 60px;
  background-color: blue;
`;

export default ClubPage;
