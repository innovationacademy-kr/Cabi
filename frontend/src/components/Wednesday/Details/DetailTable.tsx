import styled from "styled-components";
import { IDate } from "@/components/Wednesday/Details/DetailContent.container";
import {
  TAdminModalState,
  itemType,
  tableHeadArray,
} from "@/components/Wednesday/Details/DetailTable.container";
import DetailTableBodyRowContainer from "@/components/Wednesday/Details/DetailTableBodyRow.container";
import DetailTableBodyRowMobile from "@/components/Wednesday/Details/DetailTableBodyRowMobile";
import { IPresentationScheduleDetailInfo } from "@/types/dto/wednesday.dto";

const DetailTable = ({
  isMobile,
  list,
  isAdmin,
  openAdminModal,
  makeIDateObj,
}: {
  isMobile: boolean;
  list: IPresentationScheduleDetailInfo[] | null;
  isAdmin: boolean;
  openAdminModal: (modal: TAdminModalState) => void;
  makeIDateObj: (date: Date) => IDate;
}) => {
  return (
    <TableStyled>
      {!isMobile ? (
        <TableHeadStyled>
          <tr>
            {tableHeadArray.map((head, idx) => {
              let entries = Object.entries(head);
              return (
                <th key={idx} id={entries[0][0]}>
                  {entries[0][1]}
                </th>
              );
            })}
          </tr>
        </TableHeadStyled>
      ) : null}
      <tbody>
        <WhiteSpaceTrStyled />
      </tbody>
      <TableBodyStyled>
        {list?.map((item, idx) => {
          let itemStatus = itemType.EVENT_AVAILABLE;

          if (!item.subject) {
            const date = new Date();
            let dateISO = date.toISOString();
            const dateObj = new Date(dateISO);

            const itemDateObj = new Date(item.dateTime);
            if (dateObj > itemDateObj) itemStatus = itemType.NO_EVENT_PAST;
            else itemStatus = itemType.NO_EVENT_CURRENT;
          }

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

export default DetailTable;

const TableStyled = styled.table`
  width: 100%;
  table-layout: fixed;
`;

const TableHeadStyled = styled.thead`
  margin-bottom: 10px;
  height: 40px;
  line-height: 40px;
  background-color: #3f69fd;
  color: var(--white);
  width: 100%;

  & > td {
    font-size: 1rem;
    text-align: center;
  }

  & #date {
    width: 13%;
    border-radius: 10px 0 0 10px;
  }

  & #subject {
    width: 56%;
  }

  & #userName {
    width: 14%;
  }

  & #category {
    width: 9%;
  }

  & #presentationTime {
    width: 8%;
    border-radius: 0 10px 10px 0;
  }
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
