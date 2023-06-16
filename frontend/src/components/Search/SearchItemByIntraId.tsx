import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import styled, { css } from "styled-components";
import {
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
  intra_id: string;
  user_id: number;
  cabinetInfo?: CabinetInfo;
  banned_date?: Date;
  unbanned_date?: Date;
  searchValue: string;
}

const SearchItemByIntraId = (props: ISearchDetail) => {
  const {
    intra_id,
    user_id,
    cabinetInfo,
    banned_date,
    unbanned_date,
    searchValue,
  } = props;
  const [currentIntraId, setCurrentIntraId] =
    useRecoilState<string>(currentIntraIdState);
  const resetCurrentIntraId = useResetRecoilState(currentIntraIdState);
  const setTargetCabinetInfo = useSetRecoilState<CabinetInfo>(
    targetCabinetInfoState
  );
  const setTargetUserInfo = useSetRecoilState(targetUserInfoState);
  const resetTargetCabinetInfo = useResetRecoilState(targetCabinetInfoState);
  const setSelectedTypeOnSearch = useSetRecoilState(selectedTypeOnSearchState);
  const { openCabinet, closeCabinet } = useMenu();

  const clickSearchItem = () => {
    if (currentIntraId === intra_id) {
      resetCurrentIntraId();
      closeCabinet();
      return;
    }
    setTargetUserInfo({
      intraId: intra_id,
      userId: user_id,
      cabinetId: cabinetInfo?.cabinetId,
      bannedDate: banned_date,
      unbannedDate: unbanned_date,
      cabinetInfo: cabinetInfo,
    });
    setSelectedTypeOnSearch("USER");
    setCurrentIntraId(intra_id);
    async function getCabinetInfoByCabinetId(cabinetId: number) {
      try {
        const { data } = await axiosAdminCabinetInfoByCabinetId(cabinetId);
        setTargetCabinetInfo(data);
      } catch (error) {
        console.log(error);
      }
    }
    if (cabinetInfo) {
      getCabinetInfoByCabinetId(cabinetInfo.cabinetId);
      openCabinet();
    } else {
      // TODO: 대여 사물함이 없는 유저 정보를 불러오는 api를 만들어야 함
      resetTargetCabinetInfo();
      openCabinet();
    }
  };

  return cabinetInfo ? (
    <WrapperStyled
      className="cabiButton"
      isSelected={currentIntraId === intra_id}
      onClick={clickSearchItem}
    >
      <RectangleStyled status={cabinetInfo.status}>
        {cabinetInfo.visibleNum}
      </RectangleStyled>
      <TextWrapper>
        <LocationStyled>{`${cabinetInfo.floor}층 - ${cabinetInfo.section}`}</LocationStyled>
        <NameWrapperStyled>
          <IconStyled lent_type={cabinetInfo.lentType} />
          <NameStyled>
            <ChangeToHTML origin={intra_id} replace={searchValue} />
          </NameStyled>
        </NameWrapperStyled>
      </TextWrapper>
    </WrapperStyled>
  ) : (
    <WrapperStyled
      className="cabiButton"
      isSelected={currentIntraId === intra_id}
      onClick={clickSearchItem}
    >
      <RectangleStyled banned={!!banned_date}>
        {banned_date ? "!" : "-"}
      </RectangleStyled>
      <TextWrapper>
        <LocationStyled>대여 중이 아닌 사용자</LocationStyled>
        <NameWrapperStyled>
          <IconStyled />
          <NameStyled>
            <ChangeToHTML origin={intra_id} replace={searchValue} />
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
  background-color: var(--lightgary-color);
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

const IconStyled = styled.div<{ lent_type?: CabinetType }>`
  width: 18px;
  height: 28px;
  background-image: url((${(props) =>
      props.lent_type
        ? cabinetIconSrcMap[props.lent_type]
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
