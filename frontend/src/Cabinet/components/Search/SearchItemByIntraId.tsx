import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import {
  currentCabinetIdState,
  currentIntraIdState,
  selectedTypeOnSearchState,
  targetCabinetInfoState,
  targetUserInfoState,
} from "@/Cabinet/recoil/atoms";
import { CardButtonStyled } from "@/Cabinet/components/Card/Card";
import ChangeToHTML from "@/Cabinet/components/TopNav/SearchBar/SearchListItem/ChangeToHTML";
import {
  cabinetIconComponentMap,
  cabinetLabelColorMap,
  cabinetStatusColorMap,
} from "@/Cabinet/assets/data/maps";
import { CabinetInfo } from "@/Cabinet/types/dto/cabinet.dto";
import CabinetStatus from "@/Cabinet/types/enum/cabinet.status.enum";
import CabinetType from "@/Cabinet/types/enum/cabinet.type.enum";
import CabinetDetailAreaType from "@/Cabinet/types/enum/cabinetDetailArea.type.enum";
import { axiosAdminCabinetInfoByCabinetId } from "@/Cabinet/api/axios/axios.custom";
import useMenu from "@/Cabinet/hooks/useMenu";

interface ISearchDetail {
  name: string;
  userId: number;
  cabinetInfo?: CabinetInfo;
  bannedAt?: Date;
  unbannedAt?: Date;
  searchValue: string;
}

const SearchItemByIntraId = (props: ISearchDetail) => {
  const { name, userId, cabinetInfo, bannedAt, unbannedAt, searchValue } =
    props;
  const [currentIntraId, setCurrentIntraId] =
    useRecoilState<string>(currentIntraIdState);
  const [currentCabinetId, setCurrentCabinetId] = useRecoilState<number | null>(
    currentCabinetIdState
  );
  const resetCurrentIntraId = useResetRecoilState(currentIntraIdState);
  const setTargetCabinetInfo = useSetRecoilState<CabinetInfo>(
    targetCabinetInfoState
  );
  const setTargetUserInfo = useSetRecoilState(targetUserInfoState);
  const resetTargetCabinetInfo = useResetRecoilState(targetCabinetInfoState);
  const [selectedTypeOnSearch, setSelectedTypeOnSearch] = useRecoilState(
    selectedTypeOnSearchState
  );
  const { openCabinet, closeCabinet } = useMenu();
  const CabinetIcon =
    cabinetIconComponentMap[
      cabinetInfo ? cabinetInfo.lentType : CabinetType.PRIVATE
    ];
  const clickSearchItem = () => {
    if (
      currentIntraId === name &&
      selectedTypeOnSearch !== CabinetDetailAreaType.ITEM
    ) {
      resetCurrentIntraId();
      closeCabinet();
      return;
    }

    setTargetUserInfo({
      name: name,
      userId: userId,
      cabinetId: cabinetInfo?.cabinetId,
      bannedAt: bannedAt,
      unbannedAt: unbannedAt,
      cabinetInfo: cabinetInfo,
    });
    if (cabinetInfo?.cabinetId) {
      setSelectedTypeOnSearch(CabinetDetailAreaType.CABINET);
    } else {
      setSelectedTypeOnSearch(CabinetDetailAreaType.USER);
    }
    setCurrentIntraId(name);
    async function getCabinetInfoByCabinetId(cabinetId: number | null) {
      try {
        const { data } = await axiosAdminCabinetInfoByCabinetId(cabinetId);
        setTargetCabinetInfo(data);
      } catch (error) {
        console.log(error);
      }
    }
    if (cabinetInfo?.cabinetId) {
      getCabinetInfoByCabinetId(cabinetInfo.cabinetId);
      setCurrentCabinetId(cabinetInfo.cabinetId);
    } else {
      // TODO: 대여 사물함이 없는 유저 정보를 불러오는 api를 만들어야 함
      resetTargetCabinetInfo();
      setCurrentCabinetId(null);
    }
    openCabinet();
  };

  const clickStoreItem = () => {
    if (
      currentIntraId === name &&
      selectedTypeOnSearch === CabinetDetailAreaType.ITEM
    ) {
      resetCurrentIntraId();
      closeCabinet();
      return;
    }
    setTargetUserInfo({
      name: name,
      userId: userId,
    });
    setSelectedTypeOnSearch(CabinetDetailAreaType.ITEM);
    setCurrentIntraId(name);
    if (cabinetInfo?.cabinetId) {
      setCurrentCabinetId(cabinetInfo.cabinetId);
    } else {
      resetTargetCabinetInfo();
      setCurrentCabinetId(null);
    }
    openCabinet();
  };

  return (
    <>
      {cabinetInfo?.cabinetId ? (
        <WrapperStyled>
          <RectangleStyled status={cabinetInfo.status}>
            {cabinetInfo.visibleNum}
          </RectangleStyled>
          <TextWrapper>
            <LocationStyled>
              {`${cabinetInfo.floor}층 - ${cabinetInfo.section}`}
            </LocationStyled>
            <NameWrapperStyled>
              <IconWrapperStyled>
                <CabinetIcon />
              </IconWrapperStyled>
              <NameStyled>
                <ChangeToHTML origin={name} replace={searchValue} />
              </NameStyled>
            </NameWrapperStyled>
          </TextWrapper>
          <ButtonWrapper>
            <CardButtonStyled onClick={clickSearchItem} isClickable>
              사물함 정보
            </CardButtonStyled>
            <CardButtonStyled onClick={clickStoreItem} isClickable>
              아이템 관리
            </CardButtonStyled>
          </ButtonWrapper>
        </WrapperStyled>
      ) : (
        <WrapperStyled>
          <RectangleStyled banned={!!bannedAt}>
            {bannedAt ? "!" : "-"}
          </RectangleStyled>
          <TextWrapper>
            <LocationStyled>대여 사물함 없음</LocationStyled>
            <NameWrapperStyled>
              <IconWrapperStyled />
              <NameStyled>
                <ChangeToHTML origin={name} replace={searchValue} />
              </NameStyled>
            </NameWrapperStyled>
          </TextWrapper>
          <ButtonWrapper>
            <CardButtonStyled onClick={clickSearchItem} isClickable>
              사물함 정보
            </CardButtonStyled>
            <CardButtonStyled onClick={clickStoreItem} isClickable>
              아이템 관리
            </CardButtonStyled>
          </ButtonWrapper>
        </WrapperStyled>
      )}{" "}
    </>
  );
};

const WrapperStyled = styled.div`
  width: 350px;
  height: 110px;
  border-radius: 10px;
  padding: 24px;
  background-color: var(--card-bg-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: transform 0.2s, opacity 0.2s;
`;

const RectangleStyled = styled.div<{
  status?: CabinetStatus;
  banned?: boolean;
}>`
  width: 60px;
  height: 60px;
  border-radius: 10px;
  background-color: ${(props) =>
    props.banned
      ? "var(--expired-color)"
      : props.status
      ? cabinetStatusColorMap[props.status]
      : "var(--full-color)"};
  font-size: 1.625rem;
  color: ${(props) =>
    props.banned
      ? "var(--white-text-with-bg-color)"
      : props.status
      ? cabinetLabelColorMap[props.status]
      : "var(--mine-text-color)"};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 10px;
  width: 40%;
`;

const LocationStyled = styled.p`
  font-size: 0.875rem;
  line-height: 20px;
  color: var(--gray-line-btn-color);
`;

const NameWrapperStyled = styled.div`
  position: relative;
  height: 28px;
  line-height: 28px;
  display: flex;
  justify-content: flex-start;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const NameStyled = styled.span`
  line-height: 28px;
  font-size: 0.875rem;
  margin-left: 4px;
  & strong {
    color: var(--sys-main-color);
  }
`;

const IconWrapperStyled = styled.div`
  width: 18px;
  height: 28px;
  display: flex;

  & > svg > path {
    stroke: var(--normal-text-color);
  }

  & > svg {
    width: 18px;
    height: 28px;
  }
`;

const ButtonWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  font-size: var(--size-base);

  & > div {
    padding-left: 8px;
    padding-right: 8px;
  }
`;

export default SearchItemByIntraId;
