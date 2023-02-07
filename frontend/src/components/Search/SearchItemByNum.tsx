import { axiosAdminCabinetInfoByCabinetId } from "@/api/axios/axios.custom";
import {
  cabinetIconSrcMap,
  cabinetLabelColorMap,
  cabinetStatusColorMap,
} from "@/assets/data/maps";
import useMenu from "@/hooks/useMenu";
import { currentCabinetIdState, targetCabinetInfoState } from "@/recoil/atoms";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import { LentDto } from "@/types/dto/lent.dto";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled, { css } from "styled-components";

const handleIntraId = (lent_info: LentDto[]) => {
  if (lent_info.length === 0) {
    return "-";
  } else {
    const intra_id = lent_info.map((item) => item.intra_id);
    return intra_id.join(", ");
  }
};

const SearchItemByNum = (props: CabinetInfo) => {
  const [currentCabinetId, setCurrentCabinetId] = useRecoilState<number>(
    currentCabinetIdState
  );
  const setTargetCabinetInfo = useSetRecoilState<CabinetInfo>(
    targetCabinetInfoState
  );
  const { openCabinet, closeCabinet } = useMenu();

  const {
    floor,
    section,
    cabinet_id,
    cabinet_num,
    status,
    lent_type,
    lent_info,
  } = props;

  const clickHandler = () => {
    if (currentCabinetId === cabinet_id) {
      closeCabinet();
      return;
    }
    setCurrentCabinetId(cabinet_id);
    async function getData(cabinetId: number) {
      try {
        const { data } = await axiosAdminCabinetInfoByCabinetId(cabinetId);
        setTargetCabinetInfo(data);
      } catch (error) {
        console.log(error);
      }
    }
    getData(cabinet_id);
    openCabinet();
  };

  return (
    <WrapperStyled
      className="cabiButton"
      isSelected={currentCabinetId === cabinet_id}
      onClick={clickHandler}
    >
      <RectangleStyled status={status}>{cabinet_num}</RectangleStyled>
      <TextWrapper>
        <LocationStyled>{`${floor}층 - ${section}`}</LocationStyled>
        <NameWrapperStyled>
          <IconStyled lent_type={lent_type} />
          <NameStyled>{handleIntraId(lent_info)}</NameStyled>
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

const RectangleStyled = styled.div<{ status: CabinetStatus }>`
  width: 60px;
  height: 60px;
  border-radius: 10px;
  background-color: ${(props) => cabinetStatusColorMap[props.status]};
  font-size: 26px;
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

const IconStyled = styled.div<{ lent_type: CabinetType }>`
  width: 18px;
  height: 28px;
  background: url(${(props) => cabinetIconSrcMap[props.lent_type]}) no-repeat
    center center / contain;
`;

const NameStyled = styled.span`
  line-height: 28px;
  font-size: 14px;
  margin-left: 4px;
`;

export default SearchItemByNum;
