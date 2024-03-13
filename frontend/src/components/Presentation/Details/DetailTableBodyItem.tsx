import { NavigateFunction } from "react-router-dom";
import DetailPartTr from "@/components/Presentation/Details/DetailPartTr";
import { IItem } from "@/components/Presentation/Details/DetailTableBodyItem.container";
import { IPresentationScheduleDetailInfo } from "@/types/dto/presentation.dto";
import { WhiteSpaceTrStyled } from "./DetailTable";
import DetailTableBodyItemMiddleTr from "./DetailTableBodyItemMiddleTr";
import DetailTableBodyItemTopTr from "./DetailTableBodyItemTopTr";

const DetailTableBodyItem = ({
  itemInfo,
  hasNoCurrentEvent,
  isItemOpen,
  handleItemClick,
  navigator,
  tableHeadEntriesWithoutDate,
  mobileColSpanSize,
  // tableHeadEntriesWithoutDateAndSubject,
  isMobile,
  tableHeadEntries,
}: {
  itemInfo: IItem;
  hasNoCurrentEvent: boolean;
  isItemOpen: boolean;
  handleItemClick: (item: IPresentationScheduleDetailInfo) => void;
  navigator: NavigateFunction;
  tableHeadEntriesWithoutDate: [string, string][];
  mobileColSpanSize: number;
  // tableHeadEntriesWithoutDateAndSubject: [string, string][];
  isMobile: boolean;
  tableHeadEntries: [string, string][];
}) => {
  return (
    <>
      <DetailTableBodyItemTopTr
        itemInfo={itemInfo}
        isItemOpen={isItemOpen}
        handleItemClick={handleItemClick}
        isMobile={isMobile}
        mobileColSpanSize={mobileColSpanSize}
        hasNoCurrentEvent={hasNoCurrentEvent}
        navigator={navigator}
        tableHeadEntriesWithoutDate={tableHeadEntriesWithoutDate}
        tableHeadEntries={tableHeadEntries}
        // TODO : DetailTableBodyItem랑 props 같으면 정의해서 사용
      />
      <DetailTableBodyItemMiddleTr
        itemInfo={itemInfo}
        isItemOpen={isItemOpen}
        handleItemClick={handleItemClick}
        mobileColSpanSize={mobileColSpanSize}
        hasNoCurrentEvent={hasNoCurrentEvent}
        navigator={navigator}
        tableHeadEntriesWithoutDate={tableHeadEntriesWithoutDate}
      />
      {isItemOpen ? (
        <DetailPartTr
          handleItemClick={handleItemClick}
          tableHeadEntriesWithoutDate={tableHeadEntriesWithoutDate}
          itemInfo={itemInfo}
          mobileColSpanSize={mobileColSpanSize}
        />
      ) : null}

      <WhiteSpaceTrStyled />
    </>
  );
};

export default DetailTableBodyItem;
