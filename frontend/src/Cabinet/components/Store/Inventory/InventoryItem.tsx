import { useState } from "react";
import styled from "styled-components";
import { ItemIconMap, ItemTypeLabelMap } from "@/Cabinet/assets/data/maps";
import { ReactComponent as SadCcabiIcon } from "@/Cabinet/assets/images/sadCcabi.svg";
import { ReactComponent as SelectIcon } from "@/Cabinet/assets/images/select.svg";
import { IStoreItem } from "@/Cabinet/types/dto/store.dto";
import { StoreItemType } from "@/Cabinet/types/enum/store.enum";

const convertToItemTypeLabel = (itemType: string) => {
  switch (itemType) {
    case "extensionItems":
      return ItemTypeLabelMap[StoreItemType.EXTENSION];
    case "swapItems":
      return ItemTypeLabelMap[StoreItemType.SWAP];
    case "alarmItems":
      return ItemTypeLabelMap[StoreItemType.ALERT];
    case "penaltyItems":
      return ItemTypeLabelMap[StoreItemType.PENALTY];
  }
};

const convertToItemType = (itemType: string) => {
  switch (itemType) {
    case "extensionItems":
      return StoreItemType.EXTENSION;
    case "swapItems":
      return StoreItemType.SWAP;
    case "alarmItems":
      return StoreItemType.ALERT;
    case "penaltyItems":
      return StoreItemType.PENALTY;
    default:
      return StoreItemType.EXTENSION;
  }
};

const InventoryItem = ({
  itemType,
  items,
}: {
  itemType: StoreItemType;
  items: IStoreItem[];
}) => {
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const ItemIcon = ItemIconMap[convertToItemType(itemType)];

  const onClickToggleBtn = () => {
    setIsToggled((prev) => !prev);
  };

  return (
    <>
      <ItemWrapperStyled>
        <ItemTitleStyled isToggled={isToggled} onClick={onClickToggleBtn}>
          <h2>{convertToItemTypeLabel(itemType)}</h2>
          <button>
            <SelectIcon />
          </button>
        </ItemTitleStyled>
        <ItemCardSectionStyled isToggled={isToggled}>
          {items.length ? (
            <>
              {items.map((item, idx) => {
                const hasTypes =
                  item.itemDetails !== convertToItemTypeLabel(itemType);
                return (
                  <ItemCardStyled key={idx} hasTypes={hasTypes}>
                    <ItemIconStyled>
                      <ItemIcon />
                    </ItemIconStyled>
                    <CardTextStyled hasTypes={hasTypes}>
                      <span id="title">{convertToItemTypeLabel(itemType)}</span>
                      {hasTypes && <span id="type">{item.itemDetails}</span>}
                    </CardTextStyled>
                  </ItemCardStyled>
                );
              })}
            </>
          ) : (
            <UnavailableItemMsgStyled isToggled={isToggled}>
              <p>해당 아이템을 보유하고 있지 않습니다</p>
              <UnavailableIconStyled>
                <SadCcabiIcon />
              </UnavailableIconStyled>
            </UnavailableItemMsgStyled>
          )}
        </ItemCardSectionStyled>
      </ItemWrapperStyled>
    </>
  );
};

const ItemCardStyled = styled.div<{ hasTypes: boolean }>`
  width: 106px;
  height: 106px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  justify-content: ${(props) => (props.hasTypes ? "space-between" : "")};
  border: 1.5px solid var(--session);
  margin: 10px 20px 10px 0;
`;

const ItemIconStyled = styled.div`
  width: 32px;
  height: 32px;

  & > svg {
    height: 32px;
  }

  & > svg > path {
    stroke: var(--sys-main-color);
  }
`;

const CardTextStyled = styled.div<{ hasTypes: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;

  & > #title {
    font-size: 14px;
    font-weight: bold;
    margin: ${(props) => (props.hasTypes ? "0.5rem 0 6px 0" : "16px 0 0 0")};
  }

  & > #type {
    font-size: 12px;
    color: var(--gray-color);
  }
`;

const ItemTitleStyled = styled.div<{ isToggled: boolean }>`
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  color: var(--black);
  padding-left: 5px;
  padding-right: 5px;
  border-bottom: 1.5px solid #d9d9d9;
  margin-bottom: 10px;
  margin-top: 50px;
  cursor: pointer;

  & > button {
    all: initial;
    cursor: inherit;
    z-index: 2;
    height: 30px;
    transform: ${(props) =>
      props.isToggled ? "rotate(180deg)" : "rotate(0deg)"};
  }

  & > button > svg > path {
    stroke: var(--gray-color);
  }

  & > h2 {
    font-weight: bold;
  }
`;

const ItemCardSectionStyled = styled.div<{ isToggled: boolean }>`
  display: ${(props) => (props.isToggled ? "none" : "flex")};
  transition: all 0.3s ease-in-out;
  flex-wrap: wrap;
`;

const UnavailableItemMsgStyled = styled.div<{ isToggled: boolean }>`
  display: ${(props) => (props.isToggled ? "none" : "flex")};
  transition: all 0.3s ease-in-out;
  flex-wrap: wrap;

  & > p {
    color: var(--gray-color);
    line-height: 1.5;
    word-break: keep-all;
    margin-left: 10px;
  }
`;

const UnavailableIconStyled = styled.div`
  width: 24px;
  height: 24px;
  margin-left: 10px;

  & > svg {
    width: 24px;
    height: 24px;
  }

  & > svg > path {
    fill: var(--black);
  }

  @media (max-width: 412px) {
    display: none;
  }
`;

const ItemWrapperStyled = styled.div`
  width: 70%;
  /* margin-top: 30px; */
`;

export default InventoryItem;
