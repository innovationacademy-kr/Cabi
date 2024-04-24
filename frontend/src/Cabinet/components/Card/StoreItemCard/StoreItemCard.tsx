import { useState } from "react";
import styled from "styled-components";
import type { Item } from "@/Cabinet/pages/StoreMainPage";
import Card from "@/Cabinet/components/Card/Card";
import type { IButtonProps } from "@/Cabinet/components/Card/Card";

const StoreItemCard = ({
  Item,
  button,
}: {
  Item: Item;
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
            <IconBlockStyled>{"Icon"}</IconBlockStyled>
            <PriseBlockStyled>{Item.ItemPrice}</PriseBlockStyled>
          </BlockStyled>
          <ItemDetailStyled>{Item.ItemType}</ItemDetailStyled>
        </SectionStyled>
      </Card>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  /* padding: 15px; */
`;
const SectionStyled = styled.div`
  display: flex;
  height: 80px;
  width: 90%;
  /* margin: 9px 0 9px 0; */
  align-items: center;
`;

const BlockStyled = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
`;
const IconBlockStyled = styled.div`
  width: 53px;
  height: 53px;
  border-radius: 10px;
  background-color: var(--main-color);
  margin-bottom: 5px;
`;

const PriseBlockStyled = styled.div`
  width: 53px;
  height: 22px;
  background-color: var(--white);
  border-radius: 10px;
  font-size: 14px;
`;

const ItemDetailStyled = styled.div`
  width: 100%;
  height: 100%;
  background-color: var(--white);
  border-radius: 10px;
  padding: 10px 0;
  margin: 5px 5px 5px 5px;
  width: 90%;
  display: flex;
  flex-direction: column;

  &:hover {
    cursor: pointer;
  }
`;

export default StoreItemCard;
