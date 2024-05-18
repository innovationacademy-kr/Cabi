import { useRecoilState, useSetRecoilState } from "recoil";
import styled, { css } from "styled-components";
import {
  currentCabinetIdState,
  selectedTypeOnSearchState,
  targetCabinetInfoState,
} from "@/Cabinet/recoil/atoms";
import {
  cabinetIconComponentMap,
  cabinetLabelColorMap,
  cabinetStatusColorMap,
} from "@/Cabinet/assets/data/maps";
import { CabinetInfo } from "@/Cabinet/types/dto/cabinet.dto";
import { LentDto } from "@/Cabinet/types/dto/lent.dto";
import CabinetStatus from "@/Cabinet/types/enum/cabinet.status.enum";
import { axiosAdminCabinetInfoByCabinetId } from "@/Cabinet/api/axios/axios.custom";
import useMenu from "@/Cabinet/hooks/useMenu";

const reformIntraId = (lents: LentDto[]) => {
  if (!lents || lents.length === 0) {
    return "-";
  } else {
    const intra_id = lents.map((item) => item.name);
    return intra_id.join(", ");
  }
};

const SearchItemByNum = (props: CabinetInfo) => {
  const [currentCabinetId, setCurrentCabinetId] = useRecoilState<number | null>(
    currentCabinetIdState
  );
  const setTargetCabinetInfo = useSetRecoilState<CabinetInfo>(
    targetCabinetInfoState
  );
  const setSelectedTypeOnSearch = useSetRecoilState(selectedTypeOnSearchState);
  const { openCabinet, closeCabinet } = useMenu();

  const { floor, section, cabinetId, visibleNum, status, lentType, lents } =
    props;
  const CabinetIcon = cabinetIconComponentMap[lentType];

  const clickSearchItem = () => {
    if (currentCabinetId === cabinetId) {
      closeCabinet();
      return;
    }
    setSelectedTypeOnSearch("CABINET");
    setCurrentCabinetId(cabinetId);
    async function getData(cabinetId: number) {
      try {
        const { data } = await axiosAdminCabinetInfoByCabinetId(cabinetId);
        setTargetCabinetInfo(data);
      } catch (error) {
        console.log(error);
      }
    }
    getData(cabinetId);
    openCabinet();
  };

  return (
    <WrapperStyled
      className="cabiButton"
      isSelected={currentCabinetId === cabinetId}
      onClick={clickSearchItem}
    >
      <RectangleStyled status={status}>{visibleNum}</RectangleStyled>
      <TextWrapper>
        <LocationStyled>{`${floor}층 - ${section}`}</LocationStyled>
        <NameWrapperStyled>
          <IconWrapperStyled>
            <CabinetIcon />
          </IconWrapperStyled>
          <NameStyled>{reformIntraId(lents)}</NameStyled>
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
  background-color: var(--card-bg-color);
  display: flex;
  align-items: center;
  transition: transform 0.2s, opacity 0.2s;
  cursor: pointer;
  ${({ isSelected }) =>
    isSelected &&
    css`
      opacity: 0.9;
      transform: scale(1.02);
      box-shadow: inset 4px 4px 4px var(--table-border-shadow-color-100),
        2px 2px 4px var(--table-border-shadow-color-100);
    `}
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 0.9;
      transform: scale(1.05);
    }
  }
`;

const RectangleStyled = styled.div<{ status: CabinetStatus }>`
  width: 60px;
  height: 60px;
  border-radius: 10px;
  background-color: ${(props) => cabinetStatusColorMap[props.status]};
  font-size: 1.625rem;
  color: ${(props) =>
    props.status
      ? cabinetLabelColorMap[props.status]
      : "var(--normal-text-color)"};
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
  font-size: 0.875rem;
  line-height: 28px;
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
  overflow: hidden;
`;

const NameStyled = styled.span`
  line-height: 28px;
  font-size: 0.875rem;
  margin-left: 4px;
`;

const IconWrapperStyled = styled.div`
  width: 18px;
  height: 28px;
  display: flex;

  & > svg > path {
    stroke: var(--normal-text-color);
  }
`;

export default SearchItemByNum;
