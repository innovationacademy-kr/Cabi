import styled from "styled-components";
import { IDate } from "@/components/Presentation/Details/DetailContent.container";
import {
  TAdminModalState,
  itemType,
} from "@/components/Presentation/Details/DetailTable.container";
import DetailTableBodyItemContainer from "@/components/Presentation/Details/DetailTableBodyItem.container";
import DetailTableHead from "@/components/Presentation/Details/DetailTableHead";
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
        tableHeadEntries={tableHeadEntries}
      />
      <TableBodyStyled>
        <WhiteSpaceTrStyled />
        {list?.map((item, idx) => {
          let itemStatus = groupEvent(item);
          const itemInfo = {
            item: item,
            itemStatus: itemStatus,
            itemDateInIDate: makeIDateObj(new Date(item.dateTime)),
          };
          return (
            <DetailTableBodyItemContainer
              isAdmin={isAdmin}
              openAdminModal={openAdminModal}
              itemInfo={itemInfo}
              key={idx}
              hasNoCurrentEvent={itemStatus === itemType.NO_EVENT_CURRENT}
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
