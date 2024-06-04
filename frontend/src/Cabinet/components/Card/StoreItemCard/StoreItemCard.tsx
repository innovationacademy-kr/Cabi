import styled from "styled-components";
import Card from "@/Cabinet/components/Card/Card";
import type { IButtonProps } from "@/Cabinet/components/Card/Card";
import { ItemIconMap } from "@/Cabinet/assets/data/maps";
import { ReactComponent as CoinImg } from "@/Cabinet/assets/images/coinIcon.svg";
import { IItemDetail } from "@/Cabinet/types/dto/store.dto";
import { StoreItemType } from "@/Cabinet/types/enum/store.enum";

const convertToItemType = (itemType: string) => {
  switch (itemType) {
    case "EXTENSION":
      return StoreItemType.EXTENSION;
    case "SWAP":
      return StoreItemType.SWAP;
    case "ALARM":
      return StoreItemType.ALARM;
    case "PENALTY":
      return StoreItemType.PENALTY;
    default:
      return StoreItemType.EXTENSION;
  }
};

const StoreItemCard = ({
  item,
  button,
}: {
  item: IItemDetail;
  button: IButtonProps;
}) => {
  const ItemIcon = ItemIconMap[convertToItemType(item.itemType)];
  return (
    <WrapperStyled>
      <Card
        title={item.itemName}
        gridArea={item.itemType}
        width={"340px"}
        height={"150px"}
        buttons={[button]}
        cardType="store"
      >
        <SectionStyled>
          <BlockStyled>
            <IconBlockStyled>
              <ItemIconStyled itemType={item.itemType}>
                <ItemIcon />
              </ItemIconStyled>
            </IconBlockStyled>
            <PriseBlockStyled>
              <CoinImg />
              <span>{item.items[0].itemPrice * -1}</span>
            </PriseBlockStyled>
          </BlockStyled>
          <ItemDetailStyled>{item.description}</ItemDetailStyled>
        </SectionStyled>
      </Card>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  font-size: 15px;
`;

const SectionStyled = styled.div`
  display: flex;
  height: 80px;
  width: 90%;
  align-items: center;
`;

const BlockStyled = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 15px;
  justify-content: center;
`;

const IconBlockStyled = styled.div`
  width: 53px;
  height: 53px;
  border-radius: 10px;
  background-color: var(--sys-main-color);
  margin-bottom: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PriseBlockStyled = styled.div`
  width: 53px;
  height: 22px;
  background-color: var(--card-content-bg-color);
  border-radius: 5px;
  font-size: 12px;
  color: var(--sys-main-color);
  display: flex;
  justify-content: center;
  align-items: center;
  > span {
    margin-left: 3px;
    font-weight: 600;
  }

  & > svg {
    width: 14px;
    height: 14px;
  }
  & > svg > path {
    stroke: var(--sys-main-color);
    stroke-width: 2px;
  }
`;

const ItemDetailStyled = styled.div`
  width: 100%;
  height: 100%;
  background-color: var(--card-content-bg-color);
  font-size: var(--size-base);
  word-wrap: normal;
  padding: 10px 16px;
  line-height: 1.4;
  border-radius: 10px;
`;

const ItemIconStyled = styled.div<{ itemType: StoreItemType }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;

  & > svg {
    width: 32px;
    height: 32px;
  }

  & > svg > path {
    stroke: var(--white-text-with-bg-color);
    stroke-width: ${(props) =>
      props.itemType === StoreItemType.EXTENSION ? "2.8px" : "1.5px"};
  }
`;

export default StoreItemCard;
