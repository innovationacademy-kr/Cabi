import { set } from "react-ga";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import styled, { css } from "styled-components";
import {
  currentCabinetIdState,
  currentIntraIdState,
  selectedTypeOnSearchState,
  targetCabinetInfoState,
  targetUserInfoState,
} from "@/recoil/atoms";
import ChangeToHTML from "@/components/TopNav/SearchBar/SearchListItem/ChangeToHTML";
import {
  cabinetIconSrcMap,
  cabinetLabelColorMap,
  cabinetStatusColorMap,
} from "@/assets/data/maps";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import { axiosAdminCabinetInfoByCabinetId } from "@/api/axios/axios.custom";
import useMenu from "@/hooks/useMenu";

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
  const setSelectedTypeOnSearch = useSetRecoilState(selectedTypeOnSearchState);
  const { openCabinet, closeCabinet } = useMenu();

  const clickSearchItem = () => {
    if (currentIntraId === name) {
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
      setSelectedTypeOnSearch("CABINET");
    } else {
      setSelectedTypeOnSearch("USER");
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
      openCabinet();
    } else {
      // TODO: 대여 사물함이 없는 유저 정보를 불러오는 api를 만들어야 함
      resetTargetCabinetInfo();
      setCurrentCabinetId(null);
      openCabinet();
    }
  };

  return cabinetInfo?.cabinetId ? (
    <WrapperStyled
      className="cabiButton"
      isSelected={currentIntraId === name}
      onClick={clickSearchItem}
    >
      <RectangleStyled status={cabinetInfo.status}>
        {cabinetInfo.visibleNum}
      </RectangleStyled>
      <TextWrapper>
        <LocationStyled>{`${cabinetInfo.floor}층 - ${cabinetInfo.section}`}</LocationStyled>
        <NameWrapperStyled>
          <IconStyled lentType={cabinetInfo.lentType} />
          <NameStyled>
            <ChangeToHTML origin={name} replace={searchValue} />
          </NameStyled>
        </NameWrapperStyled>
      </TextWrapper>
    </WrapperStyled>
  ) : (
    <WrapperStyled
      className="cabiButton"
      isSelected={currentIntraId === name}
      onClick={clickSearchItem}
    >
      <RectangleStyled banned={!!bannedAt}>
        {bannedAt ? "!" : "-"}
      </RectangleStyled>
      <TextWrapper>
        <LocationStyled>대여 중이 아닌 사용자</LocationStyled>
        <NameWrapperStyled>
          <IconStyled />
          <NameStyled>
            <ChangeToHTML origin={name} replace={searchValue} />
          </NameStyled>
        </NameWrapperStyled>
      </TextWrapper>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div<{ isSelected: boolean }>`
  width: 350px;
  height: 110px;
  border-radius: 10px;
  padding: 25px;
  background-color: var(--lightgray-color);
  display: flex;
  align-items: center;
  transition: transform 0.2s, opacity 0.2s;
  cursor: pointer;
  ${({ isSelected }) =>
    isSelected &&
    css`
      opacity: 0.9;
      transform: scale(1.02);
      box-shadow: inset 4px 4px 4px rgba(0, 0, 0, 0.15),
        2px 2px 4px rgba(0, 0, 0, 0.15);
    `}
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 0.9;
      transform: scale(1.05);
    }
  }
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
      ? "var(--expired)"
      : props.status
      ? cabinetStatusColorMap[props.status]
      : "var(--full)"};
  font-size: 26px;
  color: ${(props) =>
    props.banned
      ? "var(--white)"
      : props.status
      ? cabinetLabelColorMap[props.status]
      : "var(--black)"};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;

const LocationStyled = styled.p`
  font-size: 14px;
  line-height: 28px;
  color: var(--gray-color);
`;

const NameWrapperStyled = styled.div`
  position: relative;
  height: 28px;
  line-height: 28px;
  display: flex;
  justify-content: flex-start;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const IconStyled = styled.div<{ lentType?: CabinetType }>`
  width: 18px;
  height: 28px;
  background-image: url((${(props) =>
      props.lentType
        ? cabinetIconSrcMap[props.lentType]
        : cabinetIconSrcMap[CabinetType.PRIVATE]}))
    no-repeat center center / contain;
`;

const NameStyled = styled.span`
  line-height: 28px;
  font-size: 14px;
  margin-left: 4px;
  & strong {
    color: var(--main-color);
  }
`;

export default SearchItemByIntraId;
