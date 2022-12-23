import { CabinetInfo } from "@/types/dto/cabinet.dto";
import styled from "styled-components";
import CabinetListItemContainer from "./CabinetListItemContainer";

interface CabinetListInterface {
  colNum: number;
  cabinet_info: CabinetInfo[];
}

const CabinetListContainer = ({
  colNum,
  cabinet_info,
}: CabinetListInterface): JSX.Element => {
  return (
    <CabinetListContainerStyled colNum={colNum}>
      {cabinet_info.map((cabinet) => (
        <CabinetListItemContainer {...cabinet} />
      ))}
    </CabinetListContainerStyled>
  );
};

const CabinetListContainerStyled = styled.div<{
  colNum: number;
}>`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: auto;
  overflow: hidden;
  min-width: 360px;
  max-width: ${(props) => props.colNum * 90}px;
`;

export default CabinetListContainer;
