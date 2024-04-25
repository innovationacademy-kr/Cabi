import { useEffect } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { myClubListState } from "@/Cabinet/recoil/atoms";
import ClubInfo from "@/Cabinet/components/Club/ClubInfo";
import { ReactComponent as LogoImg } from "@/Cabinet/assets/images/logo.svg";
import { ClubPaginationResponseDto } from "@/Cabinet/types/dto/club.dto";
import { deleteRecoilPersistFloorSection } from "@/Cabinet/utils/recoilPersistUtils";

const ClubPage = () => {
  const [clubList] = useRecoilState<ClubPaginationResponseDto>(myClubListState);

  useEffect(() => {
    deleteRecoilPersistFloorSection();
  }, []);

  return (
    <WrapperStyled>
      {clubList.result.length === 0 ? (
        <EmptyClubListTextStyled>
          <CabiLogoStyled>
            <LogoImg />
          </CabiLogoStyled>
          가입한 동아리가 없습니다.
          <br />
          가입한 동아리가 있다면,
          <br />
          동아리장에게 문의하세요.
        </EmptyClubListTextStyled>
      ) : (
        <ClubInfo />
      )}
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

const EmptyClubListTextStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  font-size: 1.125rem;
  line-height: 1.75rem;
  color: var(--shared-gray-color-500);
`;

const CabiLogoStyled = styled.div`
  width: 35px;
  height: 35px;
  margin-bottom: 10px;
  svg {
    .logo_svg__currentPath {
      fill: var(--main-color);
    }
  }
`;

export default ClubPage;
