import { cabinetIconSrcMap, cabinetStatusColorMap } from "@/assets/data/maps";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import styled from "styled-components";
import ChangeToHTML from "../TopNav/SearchBar/SearchListItem/ChangeToHTML";

interface ISearchDetail {
  intra_id: string;
  user_id: number;
  cabinetInfo?: CabinetInfo;
  searchValue: string;
}

const SearchItemByIntraId = (props: ISearchDetail) => {
  const { intra_id, cabinetInfo, searchValue } = props;

  return cabinetInfo ? (
    <WrapperStyled className="cabiButton">
      <RectangleStyled status={cabinetInfo.status}>
        {cabinetInfo.cabinet_num}
      </RectangleStyled>
      <TextWrapper>
        <LocationStyled>{`${cabinetInfo.floor}층 - ${cabinetInfo.section}`}</LocationStyled>
        <NameWrapperStyled>
          <IconStyled lent_type={cabinetInfo.lent_type} />
          <NameStyled>
            <ChangeToHTML origin={intra_id} replace={searchValue} />
          </NameStyled>
        </NameWrapperStyled>
      </TextWrapper>
    </WrapperStyled>
  ) : (
    <WrapperStyled className="cabiButton">
      <RectangleStyled>-</RectangleStyled>
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

const RectangleStyled = styled.div<{ status?: CabinetStatus }>`
  width: 60px;
  height: 60px;
  border-radius: 10px;
  background-color: ${(props) =>
    props.status ? cabinetStatusColorMap[props.status] : "var(--full)"};
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

const IconStyled = styled.div<{ lent_type?: CabinetType }>`
  width: 18px;
  height: 28px;
  background: url(${(props) =>
      props.lent_type
        ? cabinetIconSrcMap[props.lent_type]
        : cabinetIconSrcMap[CabinetType.PRIVATE]})
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
