import { useEffect, useState } from "react";
import styled from "styled-components";
import InventoryItem from "@/Cabinet/components/Store/Inventory/InventoryItem";
import { IStoreItem } from "@/Cabinet/types/dto/store.dto";
import { StoreItemType } from "@/Cabinet/types/enum/store.enum";
import { axiosMyItems } from "@/Cabinet/api/axios/axios.custom";

export interface IInventoryInfo {
  extensionItems: IStoreItem[];
  swapItems: IStoreItem[];
  alarmItems: IStoreItem[];
  penaltyItems: IStoreItem[];
}

const Inventory = () => {
  const [myItems, setMyItems] = useState<IInventoryInfo | null>(null);

  const getMyItems = async () => {
    try {
      const response = await axiosMyItems();
      setMyItems(response.data);
    } catch (error: any) {
      console.error("Error getting inventory:", error);
    }
  };

  useEffect(() => {
    getMyItems();
  }, []);

  return (
    <WrapperStyled>
      <TitleStyled>인벤토리</TitleStyled>
      <ItemsWrapperStyled>
        {myItems &&
          Object.entries(myItems).map(([key, value]) => (
            <InventoryItem
              key={key}
              itemType={key as StoreItemType}
              items={value}
            />
          ))}
      </ItemsWrapperStyled>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  /* height: 100%; */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0 100px 0;
`;

const TitleStyled = styled.h1`
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  font-size: 2rem;
  text-align: right;
  margin-top: 20px;
`;

const ItemsWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;

export default Inventory;
