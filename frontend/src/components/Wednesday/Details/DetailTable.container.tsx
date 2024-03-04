import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DetailTable from "@/components/Wednesday/Details//DetailTable";
import { IDate } from "@/components/Wednesday/Details/DetailContent.container";
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
    if (!item.subject) {
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
      />
      {adminModal.statusModal && (
        <EditStatusModal closeModal={() => closeAdminModal("statusModal")} />
      )}
    </>
  );
};

export default DetailTableContainer;
