import { useRecoilState, useSetRecoilState } from "recoil";
import styled, { css } from "styled-components";
import {
  currentCabinetIdState,
  selectedTypeOnSearchState,
  targetCabinetInfoState,
} from "@/recoil/atoms";
import {
  cabinetIconSrcMap,
  cabinetLabelColorMap,
  cabinetStatusColorMap,
} from "@/assets/data/maps";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import { LentDto } from "@/types/dto/lent.dto";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import { axiosAdminCabinetInfoByCabinetId } from "@/api/axios/axios.custom";
import useMenu from "@/hooks/useMenu";

const reformIntraId = (lents: LentDto[]) => {
  if (lents.length === 0) {
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
          <IconStyled lentType={lentType} />
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

const RectangleStyled = styled.div<{ status: CabinetStatus }>`
  width: 60px;
  height: 60px;
  border-radius: 10px;
  background-color: ${(props) => cabinetStatusColorMap[props.status]};
  font-size: 1.625rem;
  color: ${(props) =>
    props.status ? cabinetLabelColorMap[props.status] : "var(--black)"};
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

const IconStyled = styled.div<{ lentType: CabinetType }>`
  width: 18px;
  height: 28px;
  background: url(${(props) => cabinetIconSrcMap[props.lentType]}) no-repeat
    center center / contain;
`;

const NameStyled = styled.span`
  line-height: 28px;
  font-size: 0.875rem;
  margin-left: 4px;
`;

export default SearchItemByNum;
