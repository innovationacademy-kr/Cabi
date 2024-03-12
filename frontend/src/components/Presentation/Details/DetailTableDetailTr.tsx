import styled from "styled-components";
import { itemType } from "@/components/Presentation/Details/DetailTable.container";
import { IItem } from "@/components/Presentation/Details/DetailTableBodyRow.container";
import { IPresentationScheduleDetailInfo } from "@/types/dto/presentation.dto";

const DetailTableDetailTr = ({
  handleItemClick,
  tableHeadEntriesWithoutDate,
  itemInfo,
  mobileColSpanSize,
}: {
  handleItemClick: (item: IPresentationScheduleDetailInfo) => void;
  tableHeadEntriesWithoutDate: [string, string][];
  itemInfo: IItem;
  mobileColSpanSize: number;
}) => {
  return (
    <TableDetailTrStyled
      onClick={() => {
        !itemInfo.itemStatus && handleItemClick(itemInfo.item);
      }}
      itemStatus={itemInfo.itemStatus}
    >
      <td
        colSpan={tableHeadEntriesWithoutDate.length + 1}
        id="webDetailBeforeClick"
      >
        <div>{itemInfo.item.detail}</div>
      </td>
      <td colSpan={mobileColSpanSize} id="mobileDetailBeforeClick">
        <div>{itemInfo.item.detail}</div>
      </td>
    </TableDetailTrStyled>
  );
};

export default DetailTableDetailTr;

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

  @media (min-width: 1150px) {
    & > #mobileDetailBeforeClick {
      display: none;
    }
  }

  @media (max-width: 1150px) {
    & > #webDetailBeforeClick {
      display: none;
    }
  }
`;
