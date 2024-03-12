import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { currentPresentationState } from "@/recoil/atoms";
import { IDate } from "@/components/Presentation/Details/DetailContent.container";
import {
  TAdminModalState,
  itemType,
} from "@/components/Presentation/Details/DetailTable.container";
import DetailTableBodyRow from "@/components/Presentation/Details/DetailTableBodyRow";
import DetailTableBodyRowMobile from "@/components/Presentation/Details/DetailTableBodyRowMobile";
import { IPresentationScheduleDetailInfo } from "@/types/dto/presentation.dto";

export const noEventPhrase = {
  noEventPast: "수요지식회가 열리지 않았습니다",
  noEventCurrent:
    "다양한 관심사를 함께 나누고 싶으신 분은 지금 바로 발표를 신청해보세요",
};

export interface IItem {
  item: IPresentationScheduleDetailInfo;
  itemStatus: itemType;
  itemDateInIDate: IDate;
}

const DetailTableBodyRowContainer = ({
  isAdmin,
  openAdminModal,
  itemInfo,
  hasNoCurrentEvent,
  tableHeadEntries,
}: {
  isAdmin: boolean;
  openAdminModal: (modal: TAdminModalState) => void;
  itemInfo: IItem;
  hasNoCurrentEvent: boolean;
  tableHeadEntries: [string, string][];
}) => {
  const [clickedItem, setClickedItem] =
    useState<null | IPresentationScheduleDetailInfo>(null);
  const navigator = useNavigate();
  const setCurrentPresentation = useSetRecoilState(currentPresentationState);
  const [isItemOpen, setIsItemOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsItemOpen(clickedItem?.dateTime === itemInfo.item.dateTime);
  }, [clickedItem]);

  const handleItemClick = (item: IPresentationScheduleDetailInfo) => {
    if (isAdmin && !itemInfo.itemStatus) {
      setCurrentPresentation({
        id: item.id,
        dateTime: item.dateTime,
        presentationTime: item.presentationTime,
        presentationStatus: item.presentationStatus,
        presentationLocation: item.presentationLocation,
        detail: item.detail,
      });
      openAdminModal("statusModal");
    } else {
      if (clickedItem?.dateTime === item.dateTime) setClickedItem(null);
      else setClickedItem(item);
    }
  };

  return (
    <>
      <DetailTableBodyRow
        itemInfo={itemInfo}
        hasNoCurrentEvent={hasNoCurrentEvent}
        isItemOpen={isItemOpen}
        handleItemClick={handleItemClick}
        navigator={navigator}
        // NOTE: table head 중 date를 제외한 table head 입니다.
        tableHeadEntriesWithoutDate={tableHeadEntries.filter(
          (head) => head[0] !== "date"
        )}
        mobileColSpanSize={4}
      />
      {/* <DetailTableBodyRowMobile
        isAdmin={isAdmin}
        openAdminModal={openAdminModal}
        itemInfo={itemInfo}
        hasNoCurrentEvent={hasNoCurrentEvent}
      /> */}
    </>
  );
};

export default DetailTableBodyRowContainer;
