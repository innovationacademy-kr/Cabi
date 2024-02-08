import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { myClubListState, targetClubInfoState } from "@/recoil/atoms";
import { FloorSectionStyled } from "@/components/LeftNav/LeftSectionNav/LeftSectionNav";
import {
  ClubPaginationResponseDto,
  ClubResponseDto,
} from "@/types/dto/club.dto";

const LeftSectionNavClubs = () => {
  const clubList = useRecoilValue<ClubPaginationResponseDto>(myClubListState);
  const [targetClubInfo, setTargetClubInfo] =
    useRecoilState<ClubResponseDto>(targetClubInfoState);

  return (
    <>
      {clubList.totalLength > 0 && (
        <ClubLeftNavOptionStyled>
          {clubList.result.map((club: ClubResponseDto, index: number) => (
            <FloorSectionStyled
              key={index}
              className={
                club.clubName === targetClubInfo.clubName
                  ? "leftNavButtonActive cabiButton"
                  : " cabiButton"
              }
              onClick={() => setTargetClubInfo(club)}
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
  padding: 32px 10px;
  border-right: 1px solid var(--line-color);
  font-weight: 300;
  position: relative;
  & hr {
    width: 80%;
    height: 1px;
    background-color: #d9d9d9;
    border: 0;
    margin-top: 20px;
    margin-bottom: 20px;
  }
`;

const EmptyClubListTextStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.5rem;
`;

export default LeftSectionNavClubs;
