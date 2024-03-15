import styled from "styled-components";
import { IDate } from "@/components/Presentation/Details/DetailContent.container";
import {
  TAdminModalState,
  itemType,
} from "@/components/Presentation/Details/DetailTable/DetailTable.container";
import DetailTableBodyItem from "@/components/Presentation/Details/DetailTable/DetailTableBodyItem";
import DetailTableHead from "@/components/Presentation/Details/DetailTable/DetailTableHead";
import { IPresentationScheduleDetailInfo } from "@/types/dto/presentation.dto";

const DetailTable = ({
  isMobile,
  list,
  isAdmin,
  openAdminModal,
  makeIDateObj,
  groupEvent,
  tableHeadEntries,
}: {
  isMobile: boolean;
  list: IPresentationScheduleDetailInfo[] | null;
  isAdmin: boolean;
  openAdminModal: (modal: TAdminModalState) => void;
  makeIDateObj: (date: Date) => IDate;
  groupEvent: (item: IPresentationScheduleDetailInfo) => itemType;
  tableHeadEntries: [string, string][];
}) => {
  return (
    <TableStyled>
      <DetailTableHead
        isMobile={isMobile}
        headEntries={tableHeadEntries}
        isAdmin={isAdmin}
      />
      <TableBodyStyled>
        <WhiteSpaceTrStyled />
        {list?.map((item, idx) => {
          let itemStatus = groupEvent(item);
          const itemInfo = {
            item: item,
            itemStatus: itemStatus,
            itemDateInIDate: makeIDateObj(new Date(item.dateTime)),
            hasNoUpcomingEvent: itemStatus === itemType.NO_EVENT_CURRENT,
          };
          return (
            <DetailTableBodyItem
              isAdmin={isAdmin}
              openAdminModal={openAdminModal}
              itemInfo={itemInfo}
              key={idx}
              tableHeadEntries={tableHeadEntries}
              isMobile={isMobile}
            />
          );
        })}
      </TableBodyStyled>
    </TableStyled>
  );
};

const TableStyled = styled.table`
  width: 100%;
  table-layout: fixed;
  word-break: break-all;
`;

const TableBodyStyled = styled.tbody`
  width: 100%;

  & #selected {
    background-color: #91b5fa;
  }
`;

export const WhiteSpaceTrStyled = styled.tr`
  height: 24px;
  width: 100%;
`;

export default DetailTable;
