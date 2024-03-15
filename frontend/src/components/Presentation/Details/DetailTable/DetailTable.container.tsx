import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IDate } from "@/components/Presentation/Details/DetailContent.container";
import DetailTable from "@/components/Presentation/Details/DetailTable/DetailTable";
import EditStatusModal from "@/components/Presentation/Modals/EditStatusModal/EditStatusModal";
import { IPresentationScheduleDetailInfo } from "@/types/dto/presentation.dto";

export interface IAdminCurrentModalStateInfo {
  statusModal: boolean;
}

export type TAdminModalState = "statusModal";

export enum itemType {
  EVENT_AVAILABLE = "",
  NO_EVENT_CURRENT = "noEventCurrent",
  NO_EVENT_PAST = "noEventPast",
}

const tableHeadArray = {
  date: "날짜",
  subject: "제목",
  userName: "ID",
  category: "카테고리",
  presentationTime: "시간",
  presentationLocation: "장소",
};

const adminTableHeadArray = {
  date: "날짜",
  subject: "제목",
  userName: "ID",
  category: "카테고리",
  presentationTime: "시간",
  presentationLocation: "장소",
  presentationStatus: "상태",
};

const DetailTableContainer = ({
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
  const [list, setList] = useState<IPresentationScheduleDetailInfo[] | null>(
    null
  );
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const tableHeadEntries = !isAdmin
    ? Object.entries(tableHeadArray)
    : Object.entries(adminTableHeadArray);

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

  const openAdminModal = (modal: TAdminModalState) => {
    setAdminModal({ ...adminModal, [modal]: true });
  };

  const closeAdminModal = (modal: TAdminModalState) => {
    setAdminModal({ ...adminModal, [modal]: false });
  };

  const groupEvent = (item: IPresentationScheduleDetailInfo) => {
    let itemStatus = itemType.EVENT_AVAILABLE;

    // 발표가 없다면
    if (!item.id) {
      const date = new Date();
      let dateISO = date.toISOString();
      const dateObj = new Date(dateISO);

      const itemDateObj = new Date(item.dateTime);
      if (dateObj > itemDateObj) itemStatus = itemType.NO_EVENT_PAST;
      else itemStatus = itemType.NO_EVENT_CURRENT;
    }

    return itemStatus;
  };

  return (
    <>
      <DetailTable
        isMobile={isMobile}
        list={list}
        isAdmin={isAdmin}
        openAdminModal={openAdminModal}
        makeIDateObj={makeIDateObj}
        groupEvent={groupEvent}
        tableHeadEntries={tableHeadEntries}
      />
      {adminModal.statusModal && (
        <EditStatusModal closeModal={() => closeAdminModal("statusModal")} />
      )}
    </>
  );
};

export default DetailTableContainer;
