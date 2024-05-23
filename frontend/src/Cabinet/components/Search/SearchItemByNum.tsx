import { useRecoilState, useSetRecoilState } from "recoil";
import styled, { css } from "styled-components";
import {
  currentCabinetIdState,
  selectedTypeOnSearchState,
  targetCabinetInfoState,
} from "@/Cabinet/recoil/atoms";
import { CardButtonStyled } from "@/Cabinet/components/Card/Card";
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
    // openCabinet();
  };

  return (
    <WrapperStyled>
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
      <ButtonWrapper>
        <CardButtonStyled onClick={clickSearchItem} isClickable>
          사물함 정보
        </CardButtonStyled>
      </ButtonWrapper>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  width: 360px;
  height: 110px;
  border-radius: 10px;
  padding: 25px;
  background-color: var(--card-bg-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: transform 0.2s, opacity 0.2s;
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
    width: 85px;
    padding-left: 8px;
    padding-right: 8px;
  }
`;

export default SearchItemByNum;
