import styled from "styled-components";
import { IItemUsageLog } from "@/Cabinet/pages/ItemUsageLogPage";
import { ItemTypeLabelMap } from "@/Cabinet/assets/data/maps";
import { StoreItemType } from "@/Cabinet/types/enum/store.enum";

const formatItemLogDate = (date: Date) => {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

const ItemLogBlock = ({ log }: { log: IItemUsageLog }) => {
  return (
    <ItemUsageLogStyled>
      <IconBlockStyled itemName={log.itemName}>
        <log.logo />
      </IconBlockStyled>
      <ItemUsageInfoStyled>
        <ItemDateStyled>{formatItemLogDate(log.date)}</ItemDateStyled>
        <ItemTitleStyled>{log.titleWithDetails}</ItemTitleStyled>
      </ItemUsageInfoStyled>
    </ItemUsageLogStyled>
  );
};

const ItemUsageLogStyled = styled.div`
  margin-top: 10px;
  border-radius: 10px;
  height: 90px;
  border: 1px solid var(--inventory-item-title-border-btm-color);
  display: flex;
  align-items: center;
`;

const IconBlockStyled = styled.div<{ itemName: string }>`
  display: flex;
  width: 60px;
  height: 60px;
  border-radius: 10px;
  background-color: var(--sys-main-color);
  justify-content: center;
  align-items: center;
  margin-left: 30px;
  margin-right: 20px;
  svg {
    width: 40px;
    height: 40px;
    transform-origin: center;
  }

  & > svg > * {
    transform: scale(1.25);
    stroke: var(--white-text-with-bg-color);
    stroke-width: "1.5px";
  }
`;

const ItemUsageInfoStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
`;

const ItemDateStyled = styled.div`
  font-size: 16px;
  word-spacing: -2px;
  color: var(--gray-line-btn-color);
`;

const ItemTitleStyled = styled.div`
  font-size: 16px;
  font-weight: 800;
`;

export default ItemLogBlock;
