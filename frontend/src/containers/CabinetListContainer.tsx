import { CabinetInfo } from "@/types/dto/cabinet.dto";
import styled from "styled-components";
import CabinetListItemContainer from "./CabinetListItemContainer";

interface CabinetListInterface {
  colNum: number;
  cabinetInfo: CabinetInfo[];
}

const CabinetListContainer = ({
  colNum,
  cabinetInfo,
}: CabinetListInterface): JSX.Element => {
  return (
    <CabinetListContainerStyled colNum={colNum}>
      {cabinetInfo.map((cabinet, index) => (
        <CabinetListItemContainer {...cabinet} key={index} />
      ))}
    </CabinetListContainerStyled>
  );
};

const CabinetListContainerStyled = styled.div<{
  colNum: number;
}>`
  display: grid;
  grid-template-columns: repeat(auto-fill, 90px);
  grid-auto-flow: row;
  justify-content: center;
  min-width: 180px;
  width: 100%;
  max-width: ${(props) => props.colNum * 90}px;
`;

export default CabinetListContainer;
