import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { currentPresentationState } from "@/Presentation/recoil/atoms";
import { IDate } from "@/Presentation/components/Details/DetailContent.container";
import { WhiteSpaceTrStyled } from "@/Presentation/components/Details/DetailTable/DetailTable";
import {
  TAdminModalState,
  itemType,
} from "@/Presentation/components/Details/DetailTable/DetailTable.container";
import DetailTableBodyItemBottomTr from "@/Presentation/components/Details/DetailTable/DetailTableBodyItemBottomTr";
import DetailTableBodyItemMiddleTr from "@/Presentation/components/Details/DetailTable/DetailTableBodyItemMiddleTr";
import DetailTableBodyItemTopTr from "@/Presentation/components/Details/DetailTable/DetailTableBodyItemTopTr";
import { IPresentationScheduleDetailInfo } from "@/Presentation/types/dto/presentation.dto";
import { PresentationStatusType } from "@/Presentation/types/enum/presentation.type.enum";

export interface IItem {
  item: IPresentationScheduleDetailInfo;
  itemStatus: itemType;
  itemDateInIDate: IDate;
  hasNoUpcomingEvent: boolean;
}

const DetailTableBodyItem = ({
  isAdmin,
  openAdminModal,
  tableHeadEntries,
  itemInfo,
  isMobile,
}: {
  isAdmin: boolean;
  openAdminModal: (modal: TAdminModalState) => void;
  tableHeadEntries: [string, string][];
  itemInfo: IItem;
  isMobile: boolean;
}) => {
  const [clickedItem, setClickedItem] =
    useState<null | IPresentationScheduleDetailInfo>(null);
  const navigator = useNavigate();
  const setCurrentPresentation = useSetRecoilState(currentPresentationState);
  const [isItemOpen, setIsItemOpen] = useState<boolean>(false);
  const tableHeadEntriesWithoutDate = tableHeadEntries.filter(
    (head) => head[0] !== "date"
  );
  const tableHeadEntriesWithoutDateAndSubject = tableHeadEntries.filter(
    (head) => head[0] !== "date" && head[0] !== "subject"
  );

  useEffect(() => {
    if (isItemOpen) {
      setIsItemOpen(false);
    }
  }, [itemInfo]);

  useEffect(() => {
    setIsItemOpen(clickedItem?.dateTime === itemInfo.item.dateTime);
  }, [clickedItem]);

  const handleItemClick = (item: IPresentationScheduleDetailInfo) => {
    if (
      isAdmin &&
      itemInfo.item.presentationStatus !== PresentationStatusType.CANCEL
    ) {
      setCurrentPresentation({
        id: item.id,
        dateTime: item.dateTime,
        presentationTime: item.presentationTime,
        presentationStatus: item.presentationStatus,
        presentationLocation: item.presentationLocation,
        detail: item.detail,
        userName: item.userName,
      });
      openAdminModal("statusModal");
    } else {
      if (clickedItem?.dateTime === item.dateTime) setClickedItem(null);
      else setClickedItem(item);
    }
  };

  return (
    <>
      <DetailTableBodyItemTopTr
        isAdmin={isAdmin}
        itemInfo={itemInfo}
        isItemOpen={isItemOpen}
        handleItemClick={handleItemClick}
        isMobile={isMobile}
        mobileColSpanSize={tableHeadEntriesWithoutDateAndSubject.length + 1}
        navigator={navigator}
        tableHeadEntriesWithoutDate={tableHeadEntriesWithoutDate}
        tableHeadEntriesWithoutDateAndSubject={
          tableHeadEntriesWithoutDateAndSubject
        }
      />
      <DetailTableBodyItemMiddleTr
        isAdmin={isAdmin}
        itemInfo={itemInfo}
        isItemOpen={isItemOpen}
        handleItemClick={handleItemClick}
        mobileColSpanSize={tableHeadEntriesWithoutDateAndSubject.length + 1}
        navigator={navigator}
      />
      <DetailTableBodyItemBottomTr
        itemInfo={itemInfo}
        isItemOpen={isItemOpen}
        handleItemClick={handleItemClick}
        isMobile={isMobile}
        tableHeadEntriesWithoutDate={tableHeadEntriesWithoutDate}
        tableHeadEntriesWithoutDateAndSubject={
          tableHeadEntriesWithoutDateAndSubject
        }
      />
      <WhiteSpaceTrStyled />
    </>
  );
};

export default DetailTableBodyItem;
