import styled, { css } from "styled-components";
import { ReactComponent as CrownImg } from "@/assets/images/crown.svg";
import { ReactComponent as UserImg } from "@/assets/images/privateIcon.svg";
import { ClubUserResponseDto } from "@/types/dto/club.dto";

interface ClubMemberListItemProps {
  bgColor?: string;
  isMaster?: boolean;
  member: ClubUserResponseDto;
  selectClubMemberOnClick: (member: ClubUserResponseDto) => void;
  targetClubUser: ClubUserResponseDto;
}

const ClubMemberListItem = ({
  bgColor = "",
  isMaster = false,
  member,
  selectClubMemberOnClick,
  targetClubUser,
}: ClubMemberListItemProps) => {
  return (
    <MemberListItemContainerStyled
      bgColor={bgColor}
      onClick={() => selectClubMemberOnClick(member)}
      isSelected={member.userId === targetClubUser.userId}
    >
      {isMaster ? (
        <MemberListItemStyled id="clubMaster">
          <CrownImg stroke="#f5f5f5" width={18} height={18} />
          <MemberNameStyled>{member.userName}</MemberNameStyled>
        </MemberListItemStyled>
      ) : (
        <MemberListItemStyled id="clubUser">
          <UserImg width={16} height={16} viewBox="0 0 24 24" />
          <MemberNameStyled>{member.userName}</MemberNameStyled>
        </MemberListItemStyled>
      )}
    </MemberListItemContainerStyled>
  );
};

const AddMemberListItemContainerStyled = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 1rem;
  margin: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%23333' stroke-width='1' stroke-dasharray='6' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
  transition: transform 0.2s, opacity 0.2s;
  cursor: pointer;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 0.9;
      transform: scale(1.05);
    }
  }

  & > p {
    font-size: 26px;
  }

  &:hover {
    cursor: pointer;
  }
`;

const MemberListItemContainerStyled = styled.div<{
  bgColor: string;
  isSelected?: boolean;
}>`
  width: 80px;
  height: 80px;
  background-color: ${(props) => (props.bgColor ? props.bgColor : "#F5F5F5")};
  border-radius: 1rem;
  margin: 7px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s, opacity 0.2s;
  cursor: pointer;

  ${({ isSelected }) =>
    isSelected &&
    css`
      opacity: 0.9;
      transform: scale(1.05);
      box-shadow: inset 5px 5px 5px rgba(0, 0, 0, 0.25),
        0px 4px 4px rgba(0, 0, 0, 0.25);
    `}

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 0.9;
      transform: scale(1.05);
    }
  }

  & #clubMaster {
    color: #f5f5f5;
  }
`;

const MemberListItemStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const MemberNameStyled = styled.p`
  line-height: 28px;
  height: 28px;
  font-size: 14px;
`;

export default ClubMemberListItem;
