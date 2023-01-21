import { CabinetInfo } from "@/types/dto/cabinet.dto";
import styled from "styled-components";
import CabinetListItem from "@/components/CabinetList/CabinetListItem/CabinetListItem";

interface CabinetListInterface {
  colNum: number;
  cabinetInfo: CabinetInfo[];
}

const CabinetList = ({
  colNum,
  cabinetInfo,
}: CabinetListInterface): JSX.Element => {
  return (
    <CabinetListContainerStyled colNum={colNum ? colNum : 4}>
      {cabinetInfo.map((cabinet, index) => (
        <CabinetListItem {...cabinet} key={index} />
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

export default CabinetList;
