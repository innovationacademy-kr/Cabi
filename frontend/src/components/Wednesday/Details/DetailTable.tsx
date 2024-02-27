import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import DetailTableBody from "@/components/Wednesday/Details/DetailTableBody";
import EditStatusModal from "@/components/Wednesday/Modals/EditStatusModal/EditStatusModal";
import { IPresentationScheduleDetailInfo } from "@/types/dto/wednesday.dto";
import {
  PresentationCategoryType,
  PresentationPeriodType,
} from "@/types/enum/Presentation/presentation.type.enum";

// TODO : 1000

export interface IAdminCurrentModalStateInfo {
  statusModal: boolean;
}

export type TAdminModalState = "statusModal";

export enum itemType {
  EVENT_AVAILABLE = "",
  NO_EVENT_CURRENT = "noEventCurrent",
  NO_EVENT_PAST = "noEventPast",
}

const DetailTable = () => {
  const [adminModal, setAdminModal] = useState<IAdminCurrentModalStateInfo>({
    statusModal: false,
  });
  const { pathname } = useLocation();
  const isAdmin = pathname.includes("admin/presentation");

  const openAdminModal = (modal: TAdminModalState) => {
    setAdminModal({ ...adminModal, [modal]: true });
  };

  const closeAdminModal = (modal: TAdminModalState) => {
    setAdminModal({ ...adminModal, [modal]: false });
  };

  const tableHeadArray = [
    { date: "날짜" },
    { subject: "제목" },
    { userName: "ID" },
    { category: "카테고리" },
    { period: "시간" },
  ];

  const res: IPresentationScheduleDetailInfo[] = [
    {
      dateTime: "12월 10일",
    },
    {
      dateTime: "12월 17일",
      subject: "우하하하",
      userName: "jeekim",
      category: PresentationCategoryType.HOBBY,
      period: PresentationPeriodType.HALF,
    },
    {
      dateTime: "12월 31일",
      subject:
        "사진을 위한 넓고 얕은 지식눌렀을때는 제목이 모두 보이게 사진을 위한 넓고 얕은 지식눌렀을때는 제목",
      userName: "eeeeeeeeee",
      category: PresentationCategoryType.HOBBY,
      period: PresentationPeriodType.HOUR_HALF,
    },
  ];

  const [list, setList] = useState<IPresentationScheduleDetailInfo[]>([
    {
      dateTime: "",
      subject: "",
      userName: "",
    },
  ]);

  const [item, setItem] = useState<IPresentationScheduleDetailInfo>({
    dateTime: "",
    subject: "",
    userName: "",
  });

  useEffect(() => {
    setList(res);
  }, []);

  return (
    <>
      <TableStyled>
        <TableHeadStyled
          onClick={() => {
            isAdmin && openAdminModal("statusModal");
          }}
        >
          {tableHeadArray.map((head) => {
            let entries = Object.entries(head);
            return <th id={entries[0][0]}>{entries[0][1]}</th>;
          })}
        </TableHeadStyled>
        <WhiteSpaceTrStyled />
        <TableBodyStyled>
          {list.map((item, idx) => {
            let itemStatus = itemType.EVENT_AVAILABLE;

            if (!item.subject) {
              // if (현재 날짜보다 과거)
              itemStatus = itemType.NO_EVENT_PAST;
              // else
              itemStatus = itemType.NO_EVENT_CURRENT;
            }
            return (
              <>
                <DetailTableBody
                  isAdmin={isAdmin}
                  openAdminModal={openAdminModal}
                  item={item}
                  itemStatus={itemStatus}
                />
              </>
            );
          })}
        </TableBodyStyled>
      </TableStyled>
      <TableMobileStyled>
        <TableBodyMobileStyled>
          {list.map((item, idx) => {
            let itemStatus = itemType.EVENT_AVAILABLE;

            if (!item.subject) {
              // if (현재 날짜보다 과거)
              itemStatus = itemType.NO_EVENT_PAST;
              // else
              itemStatus = itemType.NO_EVENT_CURRENT;
            }
            return (
              <>
                <DetailTableBody
                  isAdmin={isAdmin}
                  openAdminModal={openAdminModal}
                  item={item}
                  itemStatus={itemStatus}
                />
              </>
            );
          })}
        </TableBodyMobileStyled>
      </TableMobileStyled>
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
  @media screen and (max-width: 768px) {
    display: none;
  }
`;
const TableMobileStyled = styled.div`
  @media screen and (min-width: 768px) {
    display: none;
  }
`;
const TableBodyMobileStyled = styled.div``;

const TableHeadStyled = styled.tr`
  height: 40px;
  line-height: 40px;
  background-color: #3f69fd;
  color: var(--white);

  & > th {
    font-size: 1rem;
    /* @media screen and (max-width:768px) {
    display: none;
    background-color: red;
  } */
  }

  & > #date {
    width: 13%;
    border-radius: 10px 0 0 10px;
  }

  & > #subject {
    width: 56%;
  }

  & > #userName {
    width: 14%;
  }

  & > #category {
    width: 9%;
  }

  & > #period {
    width: 8%;
    border-radius: 0 10px 10px 0;
  }
  /* @media screen and (max-width: 768px) {
    display: none;
  } */
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
