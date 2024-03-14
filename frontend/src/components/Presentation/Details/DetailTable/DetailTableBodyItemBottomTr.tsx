import styled from "styled-components";
import { itemType } from "@/components/Presentation/Details/DetailTable/DetailTable.container";
import { IItem } from "@/components/Presentation/Details/DetailTable/DetailTableBodyItem";
import { IPresentationScheduleDetailInfo } from "@/types/dto/presentation.dto";

const DetailTableBodyItemBottomTr = ({
  handleItemClick,
  tableHeadEntriesWithoutDate,
  itemInfo,
  mobileColSpanSize,
  isItemOpen,
}: {
  handleItemClick: (item: IPresentationScheduleDetailInfo) => void;
  tableHeadEntriesWithoutDate: [string, string][];
  itemInfo: IItem;
  mobileColSpanSize: number;
  isItemOpen: boolean;
}) => {
  return (
    <>
      {isItemOpen ? (
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
          <td colSpan={mobileColSpanSize} id="mobileDetail">
            <div>{itemInfo.item.detail}</div>
          </td>
        </TableDetailTrStyled>
      ) : null}
    </>
  );
};

export default DetailTableBodyItemBottomTr;

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
    & > #mobileDetail {
      display: none;
    }
  }

  @media (max-width: 1150px) {
    & > #webDetailBeforeClick {
      display: none;
    }
  }
`;
