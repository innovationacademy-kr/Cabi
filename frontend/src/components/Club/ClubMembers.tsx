import { MouseEvent } from "react";
import styled, { css } from "styled-components";
import closeIcon from "@/assets/images/close-circle.svg";
import { ReactComponent as CrownImg } from "@/assets/images/crown.svg";
import { ReactComponent as UserImg } from "@/assets/images/privateIcon.svg";
import shareIcon from "@/assets/images/shareIcon.svg";
import { ClubUserResponseDto } from "@/types/dto/club.dto";
import { UserDto } from "@/types/dto/user.dto";
import { TClubModalState } from "./ClubPageModals";

const ClubMembers: React.FC<{
  clubUserCount: number;
  imMaster: boolean;
  openModal: (modalName: TClubModalState) => void;
  master: String;
  moreBtn: boolean;
  clickMoreButton: () => void;
  members: ClubUserResponseDto[];
  myInfo: UserDto;
  selectClubMemberOnClick: (member: ClubUserResponseDto) => void;
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
      <MemSectionStyled>
        {props.imMaster ? (
          <AddMemCardStyled onClick={() => props.openModal("addModal")}>
            <p>+</p>
          </AddMemCardStyled>
        ) : null}
        {props.members?.map((mem, idx) => {
          return (
            <MemCardStyled
              key={idx}
              bgColor={mem.userName === props.master ? "var(--sub-color)" : ""}
              onClick={() => {
                props.selectClubMemberOnClick(mem);
              }}
              // isSelected={mem.userId === props.myInfo.name}
            >
              {mem.userName === props.master ? (
                <div id="clubMaster">
                  <CrownImg
                    stroke="#f5f5f5"
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                  />

                  <p>{mem.userName}</p>
                </div>
              ) : (
                //  mem.userName === props.myInfo.name ? null :
                <div id="clubUser">
                  <UserImg width={16} height={16} viewBox="0 0 24 24" />
                  <p>{mem.userName}</p>
                </div>
              )}
              {/* </div> */}
              {/* <div id="userName">{mem.userName}</div> */}
            </MemCardStyled>
          );
        })}
      </MemSectionStyled>
      {props.moreBtn && (
        <ButtonContainerStyled>
          <MoreButtonStyled onClick={props.clickMoreButton}>
            더보기
          </MoreButtonStyled>
        </ButtonContainerStyled>
      )}
    </ClubMembersContainerStyled>
  );
};

const ClubMembersContainerStyled = styled.div`
  width: 100%;
  /* height: 100%; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TitleBarStyled = styled.div`
  /* height: 3rem; */
  width: 80%;
  max-width: 720px;
  display: flex;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 1rem;

  & > div {
    margin-left: 18px;
    line-height: 24px;
    height: 24px;
    font-size: 1rem;
    font-weight: normal;
    display: flex;
  }

  & img {
    width: 24px;
    height: 24px;
  }

  & #membersLength {
    width: 34px;
  }
`;

const AddMemCardStyled = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 1rem;
  margin: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%23333' stroke-width='1' stroke-dasharray='6' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");

  & > p {
    font-size: 26px;
  }

  &:hover {
    cursor: pointer;
  }
`;

const IconContainer = styled.div`
  width: 1rem;
  height: 1rem;
`;

const MemCardStyled = styled.div<{ bgColor: string; isSelected?: boolean }>`
  width: 80px;
  height: 80px;
  background-color: ${(props) => (props.bgColor ? props.bgColor : "#F5F5F5")};
  border-radius: 1rem;
  margin: 7px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ${({ isSelected }) =>
    isSelected &&
    css`
      opacity: 0.9;
      transform: scale(1.05);
      box-shadow: inset 5px 5px 5px rgba(0, 0, 0, 0.25),
        0px 4px 4px rgba(0, 0, 0, 0.25);
    `}

  & > div {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    & > p {
      line-height: 28px;
      height: 28px;
      font-size: 14px;
    }
  }
  & #clubMaster {
    color: #f5f5f5;
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
  grid-template-columns: repeat(auto-fill, 90px);
  grid-template-rows: repeat(auto-fill, 90px);
  justify-content: center;
  width: 100%;
  max-width: 720px;
  margin: 1rem 0 2rem;
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
