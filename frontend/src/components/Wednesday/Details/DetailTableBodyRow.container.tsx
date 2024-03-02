import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IDate } from "@/components/Wednesday/Details/DetailContent.container";
import {
  TAdminModalState,
  itemType,
} from "@/components/Wednesday/Details/DetailTable.container";
import DetailTableBodyRow from "@/components/Wednesday/Details/DetailTableBodyRow";
import { IPresentationScheduleDetailInfo } from "@/types/dto/wednesday.dto";

export const presentationPeriodNumber = {
  HALF: 30,
  HOUR: 60,
  HOUR_HALF: 90,
  TWO_HOUR: 120,
};

export const presentationCategoryKorean = {
  DEVELOP: "개발",
  HOBBY: "취미",
  JOB: "취업",
  ETC: "기타",
  TASK: "42",
  STUDY: "학술",
};

export const noEventPhrase = {
  noEventPast: "수요지식회가 열리지 않았습니다",
  noEventCurrent:
    "다양한 관심사를 함께 나누고 싶으신 분은 지금 바로 발표를 신청해보세요",
};

const DetailTableBodyRowContainer = ({
  isAdmin,
  openAdminModal,
  item,
  itemStatus,
  itemDate,
  hasNoCurrentEvent,
}: {
  isAdmin: boolean;
  openAdminModal: (modal: TAdminModalState) => void;
  item: IPresentationScheduleDetailInfo;
  itemStatus: itemType;
  itemDate: IDate | null;
  hasNoCurrentEvent: boolean;
}) => {
  const [clickedItem, setClickedItem] =
    useState<null | IPresentationScheduleDetailInfo>(null);
  const navigator = useNavigate();

  const [isItemOpen, setIsItemOpen] = useState<boolean>(false);

  const handleItemClick = (item: IPresentationScheduleDetailInfo) => {
    if (clickedItem?.dateTime === item.dateTime) setClickedItem(null);
    else setClickedItem(item);
  };

  useEffect(() => {
    setIsItemOpen(clickedItem?.dateTime === item.dateTime);
  }, [clickedItem]);

  return (
    <DetailTableBodyRow
      isAdmin={isAdmin}
      openAdminModal={openAdminModal}
      item={item}
      itemStatus={itemStatus}
      itemDate={itemDate}
      hasNoCurrentEvent={hasNoCurrentEvent}
      isItemOpen={isItemOpen}
      handleItemClick={handleItemClick}
      navigator={navigator}
    />
  );
};

export default DetailTableBodyRowContainer;
