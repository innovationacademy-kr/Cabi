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

export const tableHeadArray = [
  { date: "날짜" },
  { subject: "제목" },
  { userName: "ID" },
  { category: "카테고리" },
  { presentationTime: "시간" },
];

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
      <DetailTable
        isMobile={isMobile}
        list={list}
        isAdmin={isAdmin}
        openAdminModal={openAdminModal}
        makeIDateObj={makeIDateObj}
      />
      {adminModal.statusModal && (
        <EditStatusModal closeModal={() => closeAdminModal("statusModal")} />
      )}
    </>
  );
};

export default DetailTableContainer;
