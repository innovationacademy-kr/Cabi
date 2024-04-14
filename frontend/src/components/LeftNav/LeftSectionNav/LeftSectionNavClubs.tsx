import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { myClubListState, targetClubInfoState } from "@/recoil/atoms";
import { FloorSectionStyled } from "@/components/LeftNav/LeftSectionNav/LeftSectionNav";
import {
  ClubPaginationResponseDto,
  ClubResponseDto,
} from "@/types/dto/club.dto";
import useMenu from "@/hooks/useMenu";

const LeftSectionNavClubs = () => {
  const clubList = useRecoilValue<ClubPaginationResponseDto>(myClubListState);
  const [targetClubInfo, setTargetClubInfo] =
    useRecoilState<ClubResponseDto>(targetClubInfoState);
  const { closeLeftNav } = useMenu();

  return (
    <>
      {clubList.totalLength > 0 && (
        <ClubLeftNavOptionStyled>
          <ListTitleStyled>내 동아리</ListTitleStyled>
          {clubList.result.map((club: ClubResponseDto, index: number) => (
            <FloorSectionStyled
              key={index}
              className={
                club.clubName === targetClubInfo.clubName
                  ? "leftNavButtonActive cabiButton"
                  : " cabiButton"
              }
              onClick={() => {
                closeLeftNav();
                setTargetClubInfo(club);
              }}
            >
              {club.clubName}
            </FloorSectionStyled>
          ))}
        </ClubLeftNavOptionStyled>
      )}
    </>
  );
};

const ClubLeftNavOptionStyled = styled.div`
  display: block;
  min-width: 240px;
  height: 100%;
  padding: 20px 10px 32px;
  border-right: 1px solid var(--line-color);
  font-weight: 300;
  position: relative;
  & hr {
    width: 80%;
    height: 1px;
    background-color: var(--shared-gray-color-300);
    border: 0;
    margin-top: 20px;
    margin-bottom: 20px;
  }
`;

const ListTitleStyled = styled.div`
  color: var(--shared-gray-color-500);
  font-size: 0.9rem;
  margin: 0.5rem 0.75rem;
`;

export default LeftSectionNavClubs;
