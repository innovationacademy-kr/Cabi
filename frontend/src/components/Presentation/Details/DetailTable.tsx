import styled from "styled-components";
import { IDate } from "@/components/Presentation/Details/DetailContent.container";
import {
  TAdminModalState,
  itemType,
} from "@/components/Presentation/Details/DetailTable.container";
import DetailTableBodyRowContainer from "@/components/Presentation/Details/DetailTableBodyRow.container";
import DetailTableBodyRowMobile from "@/components/Presentation/Details/DetailTableBodyRowMobile";
import { IPresentationScheduleDetailInfo } from "@/types/dto/presentation.dto";
import TableHead from "./TableHead";

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
      <TableHead isMobile={isMobile} tableHeadEntries={tableHeadEntries} />
      <TableBodyStyled>
        <WhiteSpaceTrStyled />
        {list?.map((item, idx) => {
          let itemStatus = groupEvent(item);

          return (
            <>
              {!isMobile ? (
                <DetailTableBodyRowContainer
                  isAdmin={isAdmin}
                  openAdminModal={openAdminModal}
                  item={item}
                  itemStatus={itemStatus}
                  itemDate={makeIDateObj(new Date(item.dateTime))}
                  key={idx}
                  hasNoCurrentEvent={itemStatus === itemType.NO_EVENT_CURRENT}
                  tableHeadEntries={tableHeadEntries}
                />
              ) : (
                <DetailTableBodyRowMobile
                  isAdmin={isAdmin}
                  openAdminModal={openAdminModal}
                  item={item}
                  itemStatus={itemStatus}
                  itemDate={makeIDateObj(new Date(item.dateTime))}
                  key={idx + "mobile"}
                  hasNoCurrentEvent={itemStatus === itemType.NO_EVENT_CURRENT}
                />
              )}
              <WhiteSpaceTrStyled key={idx + "whiteSpaceTr"} />
            </>
          );
        })}
      </TableBodyStyled>
    </TableStyled>
  );
};

const TableStyled = styled.table`
  width: 100%;
  min-width: 480px;
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
