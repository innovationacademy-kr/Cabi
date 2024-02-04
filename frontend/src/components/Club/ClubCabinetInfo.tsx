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
  /* height: 350px; */
  /* height: 100%; */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ClubHeaderStyled = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-left: 3rem;
  font-size: 20px;
  font-weight: bold;
`;

const ClubInfoBoxStyled = styled.div`
  /* width: 795px; */
  width: 100%;
  /* height: 285px; */
  height: 100%;
  display: flex;
  justify-content: center;
  margin: 20px;
`;

export default ClubCabinetInfo;
