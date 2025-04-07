import styled from "styled-components";
import { itemType } from "@/Presentation_legacy/components/Details/DetailTable/DetailTable.container";
import { IItem } from "@/Presentation_legacy/components/Details/DetailTable/DetailTableBodyItem";
import { IPresentationScheduleDetailInfo } from "@/Presentation_legacy/types/dto/presentation.dto";

const DetailTableBodyItemBottomTr = ({
  itemInfo,
  isItemOpen,
  handleItemClick,
  isMobile,
  tableHeadEntriesWithoutDate,
  tableHeadEntriesWithoutDateAndSubject,
}: {
  itemInfo: IItem;
  isItemOpen: boolean;
  handleItemClick: (item: IPresentationScheduleDetailInfo) => void;
  isMobile: boolean;
  tableHeadEntriesWithoutDate: [string, string][];
  tableHeadEntriesWithoutDateAndSubject: [string, string][];
}) => {
  return (
    <>
      {isItemOpen ? (
        <BottomTrStyled
          onClick={() => {
            !itemInfo.itemStatus && handleItemClick(itemInfo.item);
          }}
          itemStatus={itemInfo.itemStatus}
        >
          <td
            colSpan={
              !isMobile
                ? tableHeadEntriesWithoutDate.length + 1
                : tableHeadEntriesWithoutDateAndSubject.length + 1
            }
          >
            <div>{itemInfo.item.detail}</div>
          </td>
        </BottomTrStyled>
      ) : null}
    </>
  );
};

export default DetailTableBodyItemBottomTr;

const BottomTrStyled = styled.tr<{
  itemStatus: itemType;
}>`
  background-color: var(--sys-sub-color);
  width: 100%;

  & > td {
    border-radius: 0 0 10px 10px;
    padding: 0;
  }

  & > td > div {
    background-color: var(--white-text-with-bg-color);
    border-radius: 10px;
    margin: 24px;
    margin-top: 0;
    line-height: 24px;
    padding: 30px 50px;
    font-size: 18px;
    color: var(--mine-text-color);
  }

  &:hover {
    cursor: ${(props) => (props.itemStatus ? "" : "pointer")};
    background-color: ${(props) =>
      props.itemStatus ? "" : "var(--sys-sub-color)"};
  }
`;
