import { cabinetIconSrcMap, cabinetStatusColorMap } from "@/assets/data/maps";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import { LentDto } from "@/types/dto/lent.dto";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import styled from "styled-components";

const handleIntraId = (lent_info: LentDto[]) => {
  if (lent_info.length === 0) {
    return "-";
  } else {
    const intra_id = lent_info.map((item) => item.intra_id);
    return intra_id.join(", ");
  }
};

const SearchItemByNum = (props: CabinetInfo) => {
  const { floor, section, cabinet_num, status, lent_type, lent_info } = props;
  return (
    <WrapperStyled className="cabiButton">
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

const WrapperStyled = styled.div`
  width: 350px;
  height: 110px;
  border-radius: 10px;
  padding: 25px;
  background-color: var(--lightgary-color);
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    outline: 2px solid var(--main-color);
  }
`;

const RectangleStyled = styled.div<{ status: CabinetStatus }>`
  width: 60px;
  height: 60px;
  border-radius: 10px;
  background-color: ${(props) => cabinetStatusColorMap[props.status]};
  font-size: 26px;
  color: var(--white);
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
