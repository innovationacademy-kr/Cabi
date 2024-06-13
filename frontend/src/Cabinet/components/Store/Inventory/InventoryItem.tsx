import {useState} from "react";
import styled from "styled-components";
import UnavailableDataInfo from "@/Cabinet/components/Common/UnavailableDataInfo";
import {ItemIconMap, ItemTypeLabelMap} from "@/Cabinet/assets/data/maps";
import CautionIcon from "@/Cabinet/assets/images/cautionSign.svg";
import {ReactComponent as SelectIcon} from "@/Cabinet/assets/images/select.svg";
import {IStoreItem} from "@/Cabinet/types/dto/store.dto";
import {StoreItemType} from "@/Cabinet/types/enum/store.enum";

const convertToItemTypeLabel = (itemType: string) => {
  switch (itemType) {
    case "extensionItems":
      return ItemTypeLabelMap[StoreItemType.EXTENSION];
    case "swapItems":
      return ItemTypeLabelMap[StoreItemType.SWAP];
    case "alarmItems":
      return ItemTypeLabelMap[StoreItemType.ALARM];
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
      return StoreItemType.ALARM;
    case "penaltyItems":
      return StoreItemType.PENALTY;
    default:
      return StoreItemType.EXTENSION;
  }
};

const convertToItemTooltip = (itemType: string) => {
  switch (itemType) {
    case "extensionItems":
      return "사물함을 대여한 상태에서 우측 상단의 사물함 아이콘을 선택하면 연장권 사용하기 버튼이 있습니다";
    case "swapItems":
      return "사물함을 대여한 상태에서 다른 개인 사물함을 선택하면 대여버튼 대신에 이사하기 버튼이 있습니다";
    case "alarmItems":
      return "사물함 페이지의 우측 상단에 하트를 눌러 사용합니다. 프로파일에서 설정한 경로로 알림을 받습니다";
    case "penaltyItems":
      return "페널티가 있는 유저에 한해 프로파일 -> 내 정보 -> 대여정보카드의 우측상단에 버튼이 활성화 됩니다";
  }
};

const extractNumber = (str: string) => {
  const result = str.match(/\d+/g);
  return result ? parseInt(result.join(""), 10) : 0;
};

const InventoryItem = ({
                         itemsType,
                         items,
                       }: {
  itemsType: string;
  items: IStoreItem[];
}) => {
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const itemType = convertToItemType(itemsType);
  const ItemIcon = ItemIconMap[itemType];
  const itemTooltip = convertToItemTooltip(itemsType);
  const [showTooltip, setShowTooltip] = useState(false);

  const onClickToggleBtn = () => {
    setIsToggled((prev) => !prev);
  };

  const sortedItems = items.sort((a, b) => {
    return extractNumber(a.itemDetails) - extractNumber(b.itemDetails);
  });

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
      <>
        <ItemWrapperStyled>
          <ItemTitleWrapperStyled
              isToggled={isToggled}
              onClick={onClickToggleBtn}
          >
            <ItemTitleStyled>
              <h2>{convertToItemTypeLabel(itemsType)}</h2>
              <CautionWrapperStyled>
                <CautionIconStyled
                    src={CautionIcon}
                    alt="Notification Icon"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                />
                {showTooltip && (
                    <TooltipBoxDateStyled
                        onMouseEnter={() => handleMouseEnter()}
                        onMouseLeave={() => handleMouseLeave()}
                    >
                      {itemTooltip}
                    </TooltipBoxDateStyled>
                )}
              </CautionWrapperStyled>
            </ItemTitleStyled>
            <button>
              <SelectIcon/>
            </button>
          </ItemTitleWrapperStyled>
          <ItemCardSectionStyled isToggled={isToggled}>
            {sortedItems.length ? (
                <>
                  {sortedItems.map((item, idx) => {
                    const hasTypes =
                        item.itemDetails !== convertToItemTypeLabel(itemsType);
                    return (
                        <ItemCardStyled key={idx} hasTypes={hasTypes}>
                          <ItemIconStyled itemType={itemType}>
                            <ItemIcon/>
                          </ItemIconStyled>
                          <CardTextStyled hasTypes={hasTypes}>
                      <span id="title">
                        {convertToItemTypeLabel(itemsType)}
                      </span>
                            {hasTypes && <span id="type">{item.itemDetails}</span>}
                          </CardTextStyled>
                        </ItemCardStyled>
                    );
                  })}
                </>
            ) : (
                !isToggled && (
                    <UnavailableDataInfo
                        msg="해당 아이템을 보유하고 있지 않습니다"
                        fontSize="1rem"
                        iconWidth="24px"
                        iconHeight="24px"
                    />
                )
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
  border: 1.5px solid var(--capsule-btn-border-color);
`;

const ItemIconStyled = styled.div<{ itemType: StoreItemType }>`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;

  & > svg > path {
    stroke: var(--sys-main-color);
    stroke-width: ${(props) =>
        props.itemType === StoreItemType.EXTENSION ? "2.8px" : "1.5px"};
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
    color: var(--gray-line-btn-color);
  }
`;

const ItemTitleWrapperStyled = styled.div<{ isToggled: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 1.1rem;
  color: var(--normal-text-color);
  padding-left: 5px;
  padding-right: 5px;
  border-bottom: 1.5px solid var(--inventory-item-title-border-btm-color);
  margin: 50px 0 14px;
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
    stroke: var(--gray-line-btn-color);
  }

  & > h2 {
    font-weight: bold;
  }
`;

const ItemCardSectionStyled = styled.div<{ isToggled: boolean }>`
  display: ${(props) => (props.isToggled ? "none" : "flex")};
  transition: all 0.3s ease-in-out;
  flex-wrap: wrap;
  gap: 20px;
`;

const ItemWrapperStyled = styled.div`
  width: 70%;

  @media (max-width: 1040px) {
    width: 80%;
  }
`;

const CautionWrapperStyled = styled.div`
  display: flex;
  position: relative;
`;

const CautionIconStyled = styled.img`
  margin-top: 2px;
  margin-left: 5px;
  width: 16px;
  height: 16px;
  opacity: 0.6;

  :hover {
    cursor: pointer;
    opacity: 1;
  }
`;

export const ItemTitleStyled = styled.div`
  font-weight: bold;
  display: flex;
  align-items: center;
`;

const TooltipBoxDateStyled = styled.div`
  position: absolute;
  top: -60px;
  left: 155px;
  transform: translateX(-50%);
  font-weight: 400;
  color: var(--white-text-with-bg-color);
  background-color: var(--tooltip-shadow-color);
  width: 240px;
  padding: 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  text-align: center;
  line-height: 1.25rem;
  letter-spacing: -0.02rem;
  white-space: pre-line;
  z-index: 100;
  opacity: 0;
  transition: opacity 0.5s ease;

  &::after {
    content: "";
    position: absolute;
    top: 82%;
    right: 100%;
    margin-top: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent var(--tooltip-shadow-color) transparent transparent;
  }

  ${ItemTitleStyled}:hover & {
    opacity: 1;
  }
`;

export default InventoryItem;
