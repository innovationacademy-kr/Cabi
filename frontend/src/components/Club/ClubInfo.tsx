import styled from "styled-components";
import { ClubInfoResponseDto } from "@/types/dto/club.dto";
import LoadingAnimation from "../Common/LoadingAnimation";

const ClubInfo = ({
  clubInfo,
}: {
  clubInfo: ClubInfoResponseDto | undefined;
}) => {
  return (
    <ClubInfoContainerStyled>
      {clubInfo ? (
        <div>
          <div>{clubInfo.clubName}</div>
          <div>{clubInfo.clubMaster}</div>
          <div>{clubInfo.clubMemo}</div>
          <div>{clubInfo.building}</div>
          <div>{clubInfo.floor}</div>
          <div>{clubInfo.section}</div>
          <div>{clubInfo.visibleNum}</div>
          <div>
            {clubInfo.clubUsers.map((user) => {
              return <div>{user.userName}</div>;
            })}
          </div>
          <div>{clubInfo.clubUserCount}</div>
        </div>
      ) : (
        <LoadingAnimation />
      )}
    </ClubInfoContainerStyled>
  );
};

const ClubInfoContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export default ClubInfo;
