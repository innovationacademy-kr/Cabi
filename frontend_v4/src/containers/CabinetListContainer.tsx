import { CabinetInfo } from "@/types/dto/cabinet.dto";
import styled from "styled-components";
import CabinetListItemContainer from "./CabinetListItemContainer";

interface CabinetListInterface {
  col_num: number;
  cabinet_info: CabinetInfo[];
}

const CabinetListContainer = ({
  col_num,
  cabinet_info,
}: CabinetListInterface): JSX.Element => {
  return (
    <CabinetListContainerStyled col_num={col_num}>
      {cabinet_info.map((cabinet) => (
        <CabinetListItemContainer {...cabinet} />
      ))}
    </CabinetListContainerStyled>
  );
};

// display:flex;
// flex-wrap: wrap;
// justify-content: flex-start;
// margin: auto;
const CabinetListContainerStyled = styled.div<{
  col_num: number;
}>`
  display: inline-block;
  overflow: hidden;

  min-width: 360px;
  width: ${(props) => props.col_num};
  max-width: ${(props) => props.col_num * 90}px;
`;

export default CabinetListContainer;
