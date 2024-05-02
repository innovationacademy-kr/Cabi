import styled from "styled-components";
import Card from "@/Cabinet/components/Card/Card";
import type { IButtonProps } from "@/Cabinet/components/Card/Card";
import { ItemIconMap } from "@/Cabinet/assets/data/maps";
import { ItemTypeLabelMap } from "@/Cabinet/assets/data/maps";
import { ReactComponent as CoinImg } from "@/Cabinet/assets/images/coinIcon.svg";
import { IItemDetail } from "@/Cabinet/types/dto/store.dto";
import { StoreItemType } from "@/Cabinet/types/enum/store.enum";

const StoreItemCard = ({
  item,
  button,
}: {
  item: IItemDetail;
  button: IButtonProps;
}) => {
  return (
    <WrapperStyled>
      <Card
        title={item.itemName}
        gridArea={"Extension"}
        width={"340px"}
        height={"150px"}
        buttons={[button]}
      >
        <SectionStyled>
          <BlockStyled>
            <IconBlockStyled>
              <div>
                {item.itemType === "EXTENSION" ? (
                  <ItemIconMap.EXTENSION />
                ) : null}
                {item.itemType === "SWAP" ? <ItemIconMap.SWAP /> : null}
                {item.itemType === "ALARM" ? <ItemIconMap.ALERT /> : null}
                {item.itemType === "PENALTY" ? <ItemIconMap.PENALTY /> : null}
              </div>
            </IconBlockStyled>
            <PriseBlockStyled>
              <CoinImg width={14} height={14} />
              <span>{item.items[item.items.length - 1].itemPrice * -1}</span>
            </PriseBlockStyled>
          </BlockStyled>
          <ItemDetailStyled>{item.description}</ItemDetailStyled>
        </SectionStyled>
      </Card>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  font-size: var(--size-base);
`;
const SectionStyled = styled.div`
  display: flex;
  height: 80px;
  width: 90%;
  padding-left: 10px;
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
  background-color: var(--main-color);
  margin-bottom: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
  }
`;

const PriseBlockStyled = styled.div`
  width: 53px;
  height: 22px;
  background-color: var(--white);
  border-radius: 5px;
  font-size: 12px;
  color: var(--main-color);
  display: flex;
  justify-content: center;
  align-items: center;
  > span {
    margin-left: 5px;
    font-weight: 600;
  }

  & > svg > path {
    stroke: var(--main-color);
  }
`;

const ItemDetailStyled = styled.div`
  width: 100%;
  height: 100%;
  background-color: var(--white);
  border-radius: 10px;
  padding: 8px 5px 5px 8px;
  /* margin: 5px 5px 5px 5px; */
  display: flex;
  flex-direction: column;
  line-height: 17px;
  /* word-break: break-word; */
  word-wrap: normal;
`;

export default StoreItemCard;
