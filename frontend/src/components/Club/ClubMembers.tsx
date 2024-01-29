import { MouseEvent } from "react";
import styled from "styled-components";
import closeIcon from "@/assets/images/close-circle.svg";
import crown from "@/assets/images/crown.svg";
import maru from "@/assets/images/maru.svg";
import shareIcon from "@/assets/images/shareIcon.svg";
import { ClubUserResponseDto } from "@/types/dto/club.dto";
import { TClubModalState } from "./ClubPageModals";

const ClubMembers: React.FC<{
  clubUserCount: number;
  imMaster: boolean;
  openModal: (modalName: TClubModalState) => void;
  sortedMems: ClubUserResponseDto[];
  me: ClubUserResponseDto;
  master: ClubUserResponseDto;
  moreBtn: boolean;
  clickMoreButton: () => void;
  mandateClubMasterModal: (
    e: MouseEvent<HTMLDivElement>,
    mandateMaster: string
  ) => void;
  deleteClubMemberModal: (
    e: MouseEvent<HTMLDivElement>,
    targetMember: string,
    userId: number
  ) => void;
}> = (props) => {
  return (
    <ClubMembersContainerStyled>
      {/* TitleBar */}
      <TitleBarStyled>
        <p>동아리 멤버</p>
        <div>
          {/* 아이콘 & 동아리 멤버 수 */}
          <img src={shareIcon} />
          <p id="membersLength">{props.clubUserCount}</p>
        </div>
      </TitleBarStyled>
      <div id="memCard">
        <MemSectionStyled>
          {props.imMaster ? (
            <AddMemCardStyled onClick={() => props.openModal("addModal")}>
              <p>+</p>
            </AddMemCardStyled>
          ) : null}
          {props.sortedMems?.map((mem, idx) => {
            return (
              <MemCardStyled
                onContextMenu={(e: MouseEvent<HTMLDivElement>) => {
                  props.imMaster &&
                    props.mandateClubMasterModal(e, `${mem.userName}`);
                }}
                key={idx}
                bgColor={
                  mem.userName === props.me.userName ? "var(--sub-color)" : ""
                }
              >
                <div id="top">
                  <img id="profileImg" src={maru}></img>
                  {mem.userName === props.master.userName ? (
                    <img id="crown" src={crown} />
                  ) : mem.userName === props.me.userName ? null : (
                    <CloseIconStyled
                      id="closeIcon"
                      src={closeIcon}
                      onClick={(e: MouseEvent<HTMLDivElement>) =>
                        props.deleteClubMemberModal(
                          e,
                          `${mem.userName}`,
                          mem.userId
                        )
                      }
                    />
                  )}
                </div>
                <div>{mem.userName}</div>
              </MemCardStyled>
            );
          })}
        </MemSectionStyled>
        {props.moreBtn ? (
          <ButtonContainerStyled>
            <MoreButtonStyled onClick={props.clickMoreButton}>
              더보기
            </MoreButtonStyled>
          </ButtonContainerStyled>
        ) : null}
      </div>
    </ClubMembersContainerStyled>
  );
};

const ClubMembersContainerStyled = styled.div`
  margin-top: 75px;
  width: 100%;
  /* margin-bottom: 180px; */
`;

const TitleBarStyled = styled.div`
  height: 3rem;
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  font-weight: 700;
  padding-left: 7px;

  & img {
    width: 24px;
    height: 24px;
    margin-right: 6px;
  }

  & > div {
    line-height: 24px;
    height: 24px;
    font-size: 1rem;
    font-weight: normal;
    display: flex;
  }

  & #membersLength {
    width: 34px;
  }
`;

const AddMemCardStyled = styled.div`
  width: 145px;
  height: 170px;
  border-radius: 1rem;
  margin: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%23333' stroke-width='1' stroke-dasharray='6' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");

  & > p {
    font-size: 26px;
  }
`;

const MemCardStyled = styled.div<{ bgColor: string }>`
  width: 145px;
  height: 170px;
  background-color: ${(props) => (props.bgColor ? props.bgColor : "#F5F5F5")};
  border-radius: 1rem;
  margin: 7px;
  padding: 20px;

  & #profileImg {
    width: 3rem;
    height: 3rem;
    margin-bottom: 54px;
  }

  & #crown {
    width: 1.2rem;
    height: 1.2rem;
  }

  & #top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    border: 1rem;
  }
`;

const CloseIconStyled = styled.img`
  width: 12px;
  height: 12px;

  &:hover {
    cursor: pointer;
  }
`;

const MemSectionStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 159px);
  grid-template-rows: repeat(auto-fill, 184px);
  justify-content: center;
  width: 100%;
`;

const ButtonContainerStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MoreButtonStyled = styled.button`
  width: 200px;
  height: 50px;
  margin: 20px auto;
  border: 1px solid var(--main-color);
  border-radius: 30px;
  text-indent: -20px;
  background-color: var(--white);
  color: var(--main-color);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 55%;
    top: 50%;
    transform: translateY(-40%);
    width: 20px;
    height: 20px;
    background: url(/src/assets/images/selectPurple.svg) no-repeat 100%;
  }
`;

export default ClubMembers;
