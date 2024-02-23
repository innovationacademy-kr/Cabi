import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import DetailTableBody from "@/components/Wednesday/Detail/DetailTableBody";
import EditStatusModal from "@/components/Wednesday/Modals/EditStatusModal/EditStatusModal";

export interface IItem {
  date: string;
  title?: string;
  intraId?: string;
  category?: string;
  time?: number;
}

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
    { title: "제목" },
    { intraId: "ID" },
    { category: "카테고리" },
    { time: "시간" },
  ];

  const res = [
    {
      date: "12월 17일",
    },
    {
      date: "12월 31일",
      title: "우하하하",
      intraId: "jeekim",
      category: "취미",
      time: 30,
    },
    // {
    //   date: "12월 31일",
    //   title: "사진을 위한 넓고 얕은 지식눌렀을때는 제목이 모두 보이게",
    //   intraId: "eeeeeeeeee",
    //   category: "취미",
    //   time: 90,
    // },
  ];

  const [list, setList] = useState<IItem[]>([
    {
      date: "",
      title: "",
      intraId: "",
      category: "",
      time: 0,
    },
  ]);

  const [item, setItem] = useState<IItem>({
    date: "",
    title: "",
    intraId: "",
    category: "",
    time: 0,
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
        {list.map((item, idx) => {
          let itemStatus = itemType.EVENT_AVAILABLE;

          if (!item.title) {
            // if (현재 날짜보다 과거)
            itemStatus = itemType.NO_EVENT_PAST;
            // else
            itemStatus = itemType.NO_EVENT_CURRENT;
          }
          return (
            <DetailTableBody
              isAdmin={isAdmin}
              openAdminModal={openAdminModal}
              item={item}
              itemStatus={itemStatus}
            />
          );
        })}
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
  border-spacing: 0 24px;
  border-collapse: separate;
`;

const TableHeadStyled = styled.tr`
  height: 40px;
  line-height: 40px;
  background-color: #3f69fd;
  color: var(--white);

  & > th {
    font-size: 1rem;
  }

  & > #date {
    width: 13%;
    border-radius: 10px 0 0 10px;
  }

  & > #title {
    width: 56%;
  }

  & > #intraId {
    width: 14%;
  }

  & > #category {
    width: 9%;
  }

  & > #time {
    width: 8%;
    border-radius: 0 10px 10px 0;
  }
`;
