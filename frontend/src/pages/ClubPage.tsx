import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { myClubListState } from "@/recoil/atoms";
import ClubInfo from "@/components/Club/ClubInfo";
import { ReactComponent as LogoImg } from "@/assets/images/logo.svg";
import { ClubPaginationResponseDto } from "@/types/dto/club.dto";

const ClubPage = () => {
  const clubList = useRecoilValue<ClubPaginationResponseDto>(myClubListState);

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
  line-height: 1.2rem;
  letter-spacing: 0.8px;
`;

const CabiLogoStyled = styled.div`
  width: 35px;
  height: 35px;
  margin-bottom: 2rem;
  svg {
    .logo_svg__currentPath {
      fill: var(--main-color);
    }
  }
`;

export default ClubPage;
