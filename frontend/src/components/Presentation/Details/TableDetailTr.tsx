import styled from "styled-components";
import { IPresentationScheduleDetailInfo } from "@/types/dto/presentation.dto";
import { itemType } from "./DetailTable.container";
import { IItem } from "./DetailTableBodyRow.container";

const TableDetailTr = ({
  handleItemClick,
  tableHeadEntriesWithoutDate,
  itemInfo,
}: {
  handleItemClick: (item: IPresentationScheduleDetailInfo) => void;
  tableHeadEntriesWithoutDate: [string, string][];
  itemInfo: IItem;
}) => {
  return (
    <TableDetailTrStyled
      onClick={() => {
        !itemInfo.itemStatus && handleItemClick(itemInfo.item);
      }}
      itemStatus={itemInfo.itemStatus}
    >
      <td colSpan={tableHeadEntriesWithoutDate.length + 1}>
        <div>{itemInfo.item.detail}</div>
      </td>
    </TableDetailTrStyled>
  );
};

export default TableDetailTr;

const TableDetailTrStyled = styled.tr<{
  itemStatus: itemType;
}>`
  background-color: #91b5fa;
  width: 100%;

  & > td {
    border-radius: 0 0 10px 10px;
    padding: 0;
  }
  & > td > div {
    background-color: var(--white);
    border-radius: 10px;
    margin: 24px;
    margin-top: 0;
    line-height: 24px;
    padding: 30px 50px;
    font-size: 18px;
  }

  &:hover {
    cursor: ${(props) => (props.itemStatus ? "" : "pointer")};
    background-color: ${(props) => (props.itemStatus ? "" : "#91B5FA")};
  }
`;
