import styled from "styled-components";
import { IPresentationScheduleDetailInfo } from "@/types/dto/presentation.dto";
import { itemType } from "./DetailTable.container";

const TableDetailTr = ({
  itemStatus,
  handleItemClick,
  item,
  tableHeadEntriesWithoutDate,
}: {
  itemStatus: itemType;
  handleItemClick: (item: IPresentationScheduleDetailInfo) => void;
  item: IPresentationScheduleDetailInfo;
  tableHeadEntriesWithoutDate: [string, string][];
}) => {
  return (
    <TableDetailTrStyled
      onClick={() => {
        !itemStatus && handleItemClick(item);
      }}
      itemStatus={itemStatus}
    >
      <td colSpan={tableHeadEntriesWithoutDate.length + 1}>
        <div>{item.detail}</div>
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
