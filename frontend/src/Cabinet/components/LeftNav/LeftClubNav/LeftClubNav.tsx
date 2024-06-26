import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { myClubListState, targetClubInfoState } from "@/Cabinet/recoil/atoms";
import { FloorSectionStyled } from "@/Cabinet/components/LeftNav/LeftSectionNav/LeftSectionNav";
import {
  ClubPaginationResponseDto,
  ClubResponseDto,
} from "@/Cabinet/types/dto/club.dto";

const LeftClubNav = ({ closeLeftNav }: { closeLeftNav: () => void }) => {
  const clubList = useRecoilValue<ClubPaginationResponseDto>(myClubListState);
  const [targetClubInfo, setTargetClubInfo] =
    useRecoilState<ClubResponseDto>(targetClubInfoState);

  return (
    <>
      {clubList.totalLength > 0 && (
        <ClubLeftNavOptionStyled>
          {/* <ListTitleStyled>내 동아리</ListTitleStyled> */}
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
  padding: 32px 10px 32px;
  border-right: 1px solid var(--line-color);
  font-weight: 300;
  font-size: var(--size-base);
  position: relative;
  font-size: var(--size-base);
  & hr {
    width: 80%;
    height: 1px;
    background-color: var(--service-man-title-border-btm-color);
    border: 0;
    margin-top: 20px;
    margin-bottom: 20px;
  }
`;

const ListTitleStyled = styled.div`
  color: var(--gray-line-btn-color);
  font-size: 12px;
  margin: 0.5rem 0 0.5rem 0;
  font-weight: 500;
`;

export default LeftClubNav;
