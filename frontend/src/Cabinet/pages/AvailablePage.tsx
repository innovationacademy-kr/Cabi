import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { isCurrentSectionRenderState } from "@/Cabinet/recoil/atoms";
import AvailableCountdown from "@/Cabinet/components/Available/AvailableCountdown";
import FloorContainer from "@/Cabinet/components/Available/FloorContainer";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import MultiToggleSwitch, {
  toggleItem,
} from "@/Cabinet/components/Common/MultiToggleSwitch";
import { ReactComponent as RotateRightIcon } from "@/Cabinet/assets/images/rotateRight.svg";
import {
  AvailableCabinetsInfo,
  CabinetPreviewInfo,
} from "@/Cabinet/types/dto/cabinet.dto";
import { axiosGetAvailableCabinets } from "@/Cabinet/api/axios/axios.custom";
import useDebounce from "@/Cabinet/hooks/useDebounce";
import { deleteRecoilPersistFloorSection } from "@/Cabinet/utils/recoilPersistUtils";

enum AvailableCabinetsType {
  ALL = "ALL",
  PRIVATE = "PRIVATE",
  SHARE = "SHARE",
}

const toggleList: toggleItem[] = [
  { name: "전체", key: AvailableCabinetsType.ALL },
  { name: "개인", key: AvailableCabinetsType.PRIVATE },
  { name: "공유", key: AvailableCabinetsType.SHARE },
];

const AvailablePage = () => {
  const [toggleType, setToggleType] = useState<AvailableCabinetsType>(
    AvailableCabinetsType.ALL
  );
  const [cabinets, setCabinets] = useState<AvailableCabinetsInfo>({});
  const [pendingCabinets, setAvailableCabinets] =
    useState<AvailableCabinetsInfo>({});
  const [privateCabinets, setPrivateCabinets] = useState<AvailableCabinetsInfo>(
    {}
  );
  const [sharedCabinets, setSharedCabinets] = useState<AvailableCabinetsInfo>(
    {}
  );
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isOpenTime, setIsOpenTime] = useState<boolean>(false);
  const [isCurrentSectionRender, setIsCurrentSectionRender] = useRecoilState(
    isCurrentSectionRenderState
  );
  const { debounce } = useDebounce();

  const getAvailableCabinets = async () => {
    try {
      const response = await axiosGetAvailableCabinets();
      const pendingCabinets = response.data.cabinetInfoResponseDtos;

      const filterCabinetsByType = (type: string) =>
        Object.fromEntries(
          Object.entries(pendingCabinets).map(([key, cabinets]: any) => [
            key,
            cabinets.filter(
              (cabinet: CabinetPreviewInfo) => cabinet.lentType === type
            ),
          ])
        );

      const privateCabinets = filterCabinetsByType(
        AvailableCabinetsType.PRIVATE
      );
      const sharedCabinets = filterCabinetsByType(AvailableCabinetsType.SHARE);

      const updatedCabinets =
        toggleType === AvailableCabinetsType.ALL
          ? pendingCabinets
          : filterCabinetsByType(toggleType);

      setCabinets(updatedCabinets);
      setAvailableCabinets(pendingCabinets);
      setPrivateCabinets(privateCabinets);
      setSharedCabinets(sharedCabinets);
    } catch (error) {
      throw error;
    }
  };

  const refreshAvailableCabinets = () => {
    setIsRefreshing(true);
    debounce(
      "refresh",
      () => {
        getAvailableCabinets();
        setIsRefreshing(false);
      },
      500
    );
  };

  useEffect(() => {
    deleteRecoilPersistFloorSection();
    setTimeout(() => {
      // 새로고침 광클 방지를 위한 초기 로딩 딜레이
      setIsLoaded(true);
    }, 500);
  }, []);

  useEffect(() => {
    // CabinetInfoArea 컴포넌트에서 사물함 정보가 갱신되면 사물함 정보를 다시 가져온다.
    getAvailableCabinets();
    setIsCurrentSectionRender(false);
  }, [isCurrentSectionRender]);

  useEffect(() => {
    // 오프 타임이 되면 업데이트 된 사물함 정보를 다시 가져온다.
    if (isOpenTime) {
      getAvailableCabinets();
    }
  }, [isOpenTime]);

  useEffect(() => {
    if (toggleType === AvailableCabinetsType.ALL) setCabinets(pendingCabinets);
    else if (toggleType === AvailableCabinetsType.PRIVATE)
      setCabinets(privateCabinets);
    else if (toggleType === AvailableCabinetsType.SHARE)
      setCabinets(sharedCabinets);
  }, [toggleType]);

  return (
    <WrapperStyled>
      <UtilsSectionStyled></UtilsSectionStyled>
      <HeaderStyled>사용 가능 사물함</HeaderStyled>
      <SubHeaderStyled>
        <h2>
          <span>매일 오후 1시</span> 사용 가능한 사물함이 업데이트됩니다.
        </h2>
        <RefreshButtonStyled
          onClick={refreshAvailableCabinets}
          title="새로고침"
        >
          {isRefreshing ? (
            <LoadingAnimation />
          ) : (
            <>
              <RotateRightIcon />
              <AvailableCountdown observeOpenTime={() => setIsOpenTime(true)} />
            </>
          )}
        </RefreshButtonStyled>
        {/*  */}
      </SubHeaderStyled>
      <MultiToggleSwitchStyled>
        <MultiToggleSwitch
          initialState={toggleType}
          setState={setToggleType}
          toggleList={toggleList}
        />
      </MultiToggleSwitchStyled>

      {isLoaded && cabinets ? (
        Object.entries(cabinets).map(([key, value]) => (
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

const UtilsSectionStyled = styled.section`
  width: 70%;
  margin-top: 50px;
`;

const HeaderStyled = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-top: 30px;
`;

const SubHeaderStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-size: 1.2rem;
  color: var(--sub-color);
  margin-top: 25px;
  line-height: 1.5;
  word-break: keep-all;
  margin: 25px 10px 0px 10px;
  color: var(--main-color);
  span {
    font-weight: 700;
    text-decoration: underline;
  }
`;

const RefreshButtonStyled = styled.button`
  margin-top: 60px;
  width: 280px;
  height: 47px;
  background-color: var(--main-color);
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  & > svg {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }

  & > svg > path {
    stroke: var(--white-text-with-bg-color);
  }

  &:hover {
    opacity: 0.7;
  }

  &:active {
    transform: scale(0.8);
  }

  transition: all 0.3s ease;
`;

const MultiToggleSwitchStyled = styled.div`
  width: 70%;
  margin-top: 58px;
`;

const FooterStyled = styled.footer`
  color: transparent;
  margin-top: 50px;
`;

export default AvailablePage;
