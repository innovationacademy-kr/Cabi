import styled from "styled-components";
import AdminCabinetListItem from "@/components/CabinetList/CabinetListItem/AdminCabinetListItem";
import CabinetListItem from "@/components/CabinetList/CabinetListItem/CabinetListItem";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import useMenu from "@/hooks/useMenu";
import useMultiSelect from "@/hooks/useMultiSelect";

interface CabinetListInterface {
  colNum: number;
  cabinetInfo: CabinetInfo[];
  isAdmin: boolean;
}

const DEFAULT_COL_NUM = 4;

const CabinetList = ({
  colNum,
  cabinetInfo,
  isAdmin,
}: CabinetListInterface): JSX.Element => {
  const { isMultiSelect } = useMultiSelect();
  const { openCabinet } = useMenu();
  return (
    <CabinetListContainerStyled colNum={colNum ?? DEFAULT_COL_NUM}>
      {isAdmin
        ? cabinetInfo.map((cabinet, index) => (
            <AdminCabinetListItem cabinet={cabinet} key={index} />
          ))
        : cabinetInfo.map((cabinet, index) => (
            <CabinetListItem {...cabinet} key={index} />
          ))}
      {isMultiSelect && <AdminToggleButtonStyled onClick={openCabinet} />}
    </CabinetListContainerStyled>
  );
};

const AdminToggleButtonStyled = styled.div`
  display: block;
  width: 72px;
  height: 72px;
  border-radius: 60px;
  position: fixed;
  bottom: 40px;
  right: 40px;
  cursor: pointer;
  background-image: url("/src/assets/images/proceedMultiSelect.svg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
`;

const CabinetListContainerStyled = styled.div<{
  colNum: number;
}>`
  display: grid;
  grid-template-columns: repeat(auto-fill, 90px);
  justify-content: center;
  grid-auto-flow: row;
  min-width: 180px;
  width: 100%;
  max-width: ${(props) => props.colNum * 90}px;
`;

export default CabinetList;
