import styled from "styled-components";
import { ClubInfoResponseDto } from "@/types/dto/club.dto";
import ClubDetail from "./ClubDetail";
import ClubMemo from "./ClubMemo";

const ClubCabinetInfo = ({
  clubInfo,
  clubId,
  page,
}: {
  clubInfo: ClubInfoResponseDto;
  clubId: number;
  page: number;
}) => {
  return (
    <ClubCabinetInfoStyled>
      <ClubHeaderStyled>동아리 정보</ClubHeaderStyled>
      <ClubInfoBoxStyled>
        <ClubDetail clubInfo={clubInfo} />
        <ClubMemo
          clubId={clubId}
          clubNotice={clubInfo.clubNotice.toString()}
          page={page}
        />
      </ClubInfoBoxStyled>
    </ClubCabinetInfoStyled>
  );
};

const ClubCabinetInfoStyled = styled.div`
  width: 100%;
  height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 60px;
`;

const ClubHeaderStyled = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-left: 2rem;
  font-size: 20px;
  font-weight: bold;
`;

const ClubInfoBoxStyled = styled.div`
  width: 795px;
  height: 285px;
  display: flex;
  justify-content: space-between;
  margin: 20px;
`;

export default ClubCabinetInfo;
