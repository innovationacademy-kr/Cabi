import { memo } from "react";
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
      <MemberListItemStyled>
        {isMaster ? (
          <CrownImg stroke="#f5f5f5" width={18} height={18} />
        ) : (
          <UserImg width={16} height={16} viewBox="0 0 24 24" />
        )}
        <MemberNameStyled isMaster={isMaster}>
          {member.userName}
        </MemberNameStyled>
      </MemberListItemStyled>
    </MemberListItemContainerStyled>
  );
};

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
`;

const MemberListItemStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const MemberNameStyled = styled.p<{
  isMaster: boolean;
}>`
  line-height: 28px;
  height: 28px;
  font-size: 14px;
  color: ${(props) => (props.isMaster ? "var(--white)" : "")};
`;

export default memo(ClubMemberListItem);
