import { useState } from "react";
import styled from "styled-components";
import type { IStoreItem } from "@/Cabinet/pages/StoreMainPage";
import Card from "@/Cabinet/components/Card/Card";
import type { IButtonProps } from "@/Cabinet/components/Card/Card";
// import { ReactComponent as CoinImg } from "@/Cabinet/assets/images/dollar-circle.svg";
import { ReactComponent as CoinImg } from "@/Cabinet/assets/images/coinIcon.svg";

const StoreItemCard = ({
  Item,
  button,
}: {
  Item: IStoreItem;
  button: IButtonProps;
}) => {
  return (
    <WrapperStyled>
      <Card
        title={Item.ItemName}
        gridArea={"Extension"}
        width={"340px"}
        height={"150px"}
        buttons={[button]}
      >
        <SectionStyled>
          <BlockStyled>
            <IconBlockStyled>
              <div>
                <Item.logo />
              </div>
            </IconBlockStyled>
            <PriseBlockStyled>
              <CoinImg width={14} height={14} />
              <span>
                {Item.itemTypes[0].ItemPrice * -1}
              </span>
            </PriseBlockStyled>
          </BlockStyled>
          <ItemDetailStyled>{Item.Description}</ItemDetailStyled>
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
  margin-right: 10px;
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
`;

const ItemDetailStyled = styled.div`
  width: 90%;
  height: 100%;
  background-color: var(--white);
  border-radius: 10px;
  padding: 10px 5px 5px 10px;
  margin: 5px 5px 5px 5px;
  display: flex;
  flex-direction: column;
  line-height: 18px;
  word-break: break-all;
`;

export default StoreItemCard;
