import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { myClubListState } from "@/Cabinet/recoil/atoms";
import ClubInfo from "@/Cabinet/components/Club/ClubInfo";
import { ReactComponent as LogoImg } from "@/Cabinet/assets/images/logo.svg";
import { ClubPaginationResponseDto } from "@/Cabinet/types/dto/club.dto";
import { deleteRecoilPersistFloorSection } from "@/Cabinet/utils/recoilPersistUtils";

const StoreMainPage = () => {
  // const clubList = useRecoilValue<ClubPaginationResponseDto>(myClubListState);

  return (
    <WrapperStyled>
      <div>store page</div>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export default StoreMainPage;
