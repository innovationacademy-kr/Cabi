import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { IDate } from "@/pages/Wednesday/DetailPage";
import DetailTableBodyRow from "@/components/Wednesday/Details/DetailTableBodyRow";
import DetailTableBodyRowMobile from "@/components/Wednesday/Details/DetailTableBodyRowMobile";
import EditStatusModal from "@/components/Wednesday/Modals/EditStatusModal/EditStatusModal";
import { IPresentationScheduleDetailInfo } from "@/types/dto/wednesday.dto";

export interface IAdminCurrentModalStateInfo {
  statusModal: boolean;
}

export type TAdminModalState = "statusModal";

export enum itemType {
  EVENT_AVAILABLE = "",
  NO_EVENT_CURRENT = "noEventCurrent",
  NO_EVENT_PAST = "noEventPast",
}

const DetailTable = ({
  presentationDetailInfo,
  makeIDateObj,
}: {
  presentationDetailInfo: IPresentationScheduleDetailInfo[] | null;
  makeIDateObj: (date: Date) => IDate;
}) => {
  const [adminModal, setAdminModal] = useState<IAdminCurrentModalStateInfo>({
    statusModal: false,
  });
  const { pathname } = useLocation();
  const isAdmin = pathname.includes("admin/presentation");
  const tableHeadArray = [
    { date: "날짜" },
    { subject: "제목" },
    { userName: "ID" },
    { category: "카테고리" },
    { presentationTime: "시간" },
  ];
  const [list, setList] = useState<IPresentationScheduleDetailInfo[] | null>(
    null
  );
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const openAdminModal = (modal: TAdminModalState) => {
    setAdminModal({ ...adminModal, [modal]: true });
  };

  const closeAdminModal = (modal: TAdminModalState) => {
    setAdminModal({ ...adminModal, [modal]: false });
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1150);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (presentationDetailInfo) setList(presentationDetailInfo);
  }, [presentationDetailInfo]);

  return (
    <>
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
                  <DetailTableBodyRow
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
      {adminModal.statusModal && (
        <EditStatusModal closeModal={() => closeAdminModal("statusModal")} />
      )}
    </>
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
