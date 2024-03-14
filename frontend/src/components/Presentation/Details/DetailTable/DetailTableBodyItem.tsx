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

export const noEventPhrase = {
  noEventPast: "수요지식회가 열리지 않았습니다",
  noEventCurrent:
    "다양한 관심사를 함께 나누고 싶으신 분은 지금 바로 발표를 신청해보세요",
};

export const noEventPhraseMobile = {
  noEventPast: "발표가 없었습니다",
  noEventCurrent: "지금 바로 발표를 신청해보세요",
};

// TODO : noEventPhrase 하나로 할지 아님 따로 정의한채로 둘지?

export interface IItem {
  item: IPresentationScheduleDetailInfo;
  itemStatus: itemType;
  itemDateInIDate: IDate;
  hasNoCurrentEvent: boolean;
}

const DetailTableBodyItem = ({
  isAdmin,
  openAdminModal,
  itemInfo,
  tableHeadEntries,
  isMobile,
}: {
  isAdmin: boolean;
  openAdminModal: (modal: TAdminModalState) => void;
  itemInfo: IItem;
  tableHeadEntries: [string, string][];
  isMobile: boolean;
}) => {
  const [clickedItem, setClickedItem] =
    useState<null | IPresentationScheduleDetailInfo>(null);
  const navigator = useNavigate();
  const setCurrentPresentation = useSetRecoilState(currentPresentationState);
  const [isItemOpen, setIsItemOpen] = useState<boolean>(false);

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

  const tableHeadEntriesWithoutDate = tableHeadEntries.filter(
    (head) => head[0] !== "date"
  );

  const tableHeadEntriesWithoutDateAndSubject = tableHeadEntries.filter(
    (head) => head[0] !== "date" && head[0] !== "subject"
  );

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
        // TODO : DetailTableBodyItem랑 props 같으면 정의해서 사용
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
        tableHeadEntriesWithoutDate={tableHeadEntriesWithoutDate}
        mobileColSpanSize={tableHeadEntriesWithoutDateAndSubject.length + 1}
      />
      <WhiteSpaceTrStyled />
    </>
  );
};

export default DetailTableBodyItem;
