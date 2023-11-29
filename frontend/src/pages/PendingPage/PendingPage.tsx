import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { isCurrentSectionRenderState } from "@/recoil/atoms";
import FloorContainer from "@/pages/PendingPage/components/FloorContainer";
import Timer from "@/pages/PendingPage/components/Timer";
import LoadingAnimation from "@/components/Common/LoadingAnimation";
import { CabinetPreviewInfo } from "@/types/dto/cabinet.dto";
import { axiosGetPendingCabinets } from "@/api/axios/axios.custom";
import useDebounce from "@/hooks/useDebounce";

const PendingPage = () => {
  const [pendingCabinets, setPendingCabinets] = useState<
    CabinetPreviewInfo[][]
  >([[]]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isOpenTime, setIsOpenTime] = useState<boolean>(false);
  const [isCurrentSectionRender, setIsCurrentSectionRender] = useRecoilState(
    isCurrentSectionRenderState
  );
  const { debounce } = useDebounce();

  const isShowingLoadingAnimation = !isRefreshing && isLoaded;

  const getPendingCabinets = async () => {
    try {
      const response = await axiosGetPendingCabinets();
      const pendingCabinets = response.data.cabinetInfoResponseDtos;
      setPendingCabinets(pendingCabinets);
    } catch (error) {
      throw error;
    }
  };

  const refreshPendingCabinets = () => {
    setIsRefreshing(true);
    debounce(
      "refresh",
      () => {
        getPendingCabinets();
        setIsRefreshing(false);
      },
      500
    );
  };

  useEffect(() => {
    setTimeout(() => {
      // 새로고침 광클 방지를 위한 딜레이
      setIsLoaded(true);
    }, 500);
  }, []);

  useEffect(() => {
    // CabinetInfoArea 컴포넌트에서 사물함 정보가 갱신되면 사물함 정보를 다시 가져온다.
    getPendingCabinets();
    setIsCurrentSectionRender(false);
  }, [isCurrentSectionRender]);

  useEffect(() => {
    // 오프 타임이 되면 업데이트 된 사물함 정보를 다시 가져온다.
    if (isOpenTime) {
      getPendingCabinets();
    }
  }, [isOpenTime]);

  return (
    <WrapperStyled>
      <HeaderStyled>사용 가능 사물함</HeaderStyled>
      <SubHeaderStyled>
        <h2>
          <span>매일 오후 1시</span> 사용 가능한 사물함이 업데이트됩니다.
        </h2>
        <RefreshButtonStyled onClick={refreshPendingCabinets}>
          <img src="/src/assets/images/refresh.svg" alt="새로고침" />
        </RefreshButtonStyled>
      </SubHeaderStyled>
      <Timer observeOpenTime={() => setIsOpenTime(true)} />
      {isShowingLoadingAnimation && pendingCabinets ? (
        Object.entries(pendingCabinets).map(([key, value]) => (
          <FloorContainer
            key={key}
            floorNumber={key} // 2층부터 시작
            pendingCabinetsList={value}
          />
        ))
      ) : (
        <LoadingAnimation />
      )}
      <FooterStyled>아래 여백을 주기 위한 태그입니다.</FooterStyled>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow-y: scroll;
`;

const HeaderStyled = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-top: 50px;
`;

const SubHeaderStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-size: 1.2rem;
  color: var(--lightpurple-color);
  margin-top: 25px;
  line-height: 1.5;
  word-break: keep-all;
  margin: 25px 10px 0px 10px;
  span {
    font-weight: 700;
    text-decoration: underline;
  }
`;

const RefreshButtonStyled = styled.button`
  margin-top: 30px;
  margin-bottom: 20px;
  background-color: transparent;
  width: 35px;
  height: 0px;
  img {
    width: 35px;
    height: 35px;
  }
  &:hover {
    opacity: 0.7;
  }
  &:active {
    transform: scale(0.8);
  }
  transition: all 0.3s ease;
`;

const FooterStyled = styled.footer`
  color: transparent;
  margin-top: 50px;
`;

export default PendingPage;
