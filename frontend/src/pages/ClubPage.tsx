import { useEffect, useState } from "react";
import styled from "styled-components";
import ClubInfoContainer from "@/components/Club/ClubInfo.container";
import ClubMembers from "@/components/Club/ClubMembers";
import MultiToggleSwitch2, {
  toggleItem,
} from "@/components/Common/MultiToggleSwitch2";
import LeftSectionButton from "@/assets/images/LeftSectionButton.svg";
import {
  ClubInfoResponseDto,
  ClubListReponseType,
  ClubPaginationResponseDto,
  ClubResponseDto,
  ClubUserResponseDto,
} from "@/types/dto/club.dto";
import { axiosMyClubInfo } from "@/api/axios/axios.custom";

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
      const totalLength = response.data.result;
      // setClubList({ result, totalLength });
      setClubList({
        result: [
          { clubId: 3, clubName: "동아리", clubMaster: "jeekim" },
          { clubId: 4, clubName: "동아리2", clubMaster: "jusohn" },
        ] as ClubResponseDto[],
        totalLength: 1,
      });
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

  return (
    <WrapperStyled>
      <MultiToggleSwitch2
        initialState={toggleType}
        setState={setToggleType}
        toggleList={toggleList}
        setPage={setPage}
      />
      <TitleStyled>동아리 정보</TitleStyled>
      <ClubInfoContainer
        clubId={clubList?.result[page].clubId}
        page={page}
        clubInfo={clubInfo}
        setClubInfo={setClubInfo}
      />
      <ClubMembers
        master={clubList?.result[0].clubMaster.toString()}
        clubId={clubList?.result[0].clubId}
      />
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
  width: 100%;
  height: 100%;

  & button {
    margin-right: 8px;
  }
`;

const TitleStyled = styled.div`
  text-align: center;
  font-size: 2rem;
  letter-spacing: -0.02rem;
  font-weight: 700;
  margin-bottom: 30px;
`;

const SectionPaginationStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.95);
  background-color: blue;
  z-index: 1;
`;

const SectionBarStyled = styled.div`
  margin: 10px 5%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const MoveSectionButtonStyled = styled.img<{ arrowReversed?: boolean }>`
  width: 24px;
  height: 24px;
  margin: 0px 15px;
  opacity: 70%;
  cursor: pointer;
  transform: rotate(${(props) => (props.arrowReversed ? "180deg" : "0")});
  transition: all 0.2s;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 100%;
      transform: rotate(${(props) => (props.arrowReversed ? "180deg" : "0")})
        scale(1.3);
    }
  }
`;

const SectionIndexStyled = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const IndexRectangleStyled = styled.div<{ filledColor: string }>`
  width: 15px;
  height: 8px;
  border-radius: 2px;
  margin: 0px 3px;
  background: black;
  /* background: ${(props) => props.filledColor}; */
  cursor: pointer;
  transition: all 0.2s;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: scale(1.3);
      background-color: var(--sub-color);
    }
  }
`;

export default ClubPage;
