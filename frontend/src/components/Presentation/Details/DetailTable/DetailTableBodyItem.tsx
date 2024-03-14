import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { currentPresentationState } from "@/recoil/atoms";
import { IDate } from "@/components/Presentation/Details/DetailContent.container";
import { WhiteSpaceTrStyled } from "@/components/Presentation/Details/DetailTable/DetailTable";
import {
  TAdminModalState,
  itemType,
} from "@/components/Presentation/Details/DetailTable/DetailTable.container";
import DetailTableBodyItemBottomTr from "@/components/Presentation/Details/DetailTable/DetailTableBodyItemBottomTr";
import DetailTableBodyItemMiddleTr from "@/components/Presentation/Details/DetailTable/DetailTableBodyItemMiddleTr";
import DetailTableBodyItemTopTr from "@/components/Presentation/Details/DetailTable/DetailTableBodyItemTopTr";
import { IPresentationScheduleDetailInfo } from "@/types/dto/presentation.dto";

export interface IItem {
  item: IPresentationScheduleDetailInfo;
  itemStatus: itemType;
  itemDateInIDate: IDate;
  hasNoCurrentEvent: boolean;
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
      <DetailTableBodyItemTopTr
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
        itemInfo={itemInfo}
        isItemOpen={isItemOpen}
        handleItemClick={handleItemClick}
        mobileColSpanSize={tableHeadEntriesWithoutDateAndSubject.length + 1}
        navigator={navigator}
        tableHeadEntriesWithoutDate={tableHeadEntriesWithoutDate}
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
