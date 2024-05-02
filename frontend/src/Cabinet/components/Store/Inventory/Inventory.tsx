import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { userState } from "@/Cabinet/recoil/atoms";
import { ItemIconMap, ItemTypeLabelMap } from "@/Cabinet/assets/data/maps";
import { IItem, IItemDetail } from "@/Cabinet/types/dto/store.dto";
import { StoreItemType } from "@/Cabinet/types/enum/store.enum";
import { axiosMyItems } from "@/Cabinet/api/axios/axios.custom";
import Test from "./InventoryItem";

interface IInventory {
  연장권: IItem[];
  이사권: IItem[];
  "알림 등록권": IItem[];
  "페널티 축소권": IItem[];
}

const dummyData: IInventory = {
  연장권: [
    {
      Sku: "EXTENSTION_31",
      ItemPrice: -2000,
      ItemName: "연장권",
      StoreItemType: "31일",
    },
    {
      Sku: "EXTENSION_15",
      ItemPrice: -1200,
      ItemName: "연장권",
      StoreItemType: "15일",
    },
  ],
  이사권: [
    {
      Sku: "SWAP",
      ItemPrice: -100,
      ItemName: "이사권",
      StoreItemType: "이사권",
    },
  ],
  "알림 등록권": [
    {
      Sku: "ALARM",
      ItemPrice: -100,
      ItemName: "알림 등록권",
      StoreItemType: "알림 등록권",
    },
  ],
  "페널티 축소권": [],
};

const Inventory = () => {
  const [myInfo] = useRecoilState(userState);
  const [myItems, setMyItems] = useState<IInventory | null>(null);
  const getMyItems = async () => {
    try {
      //   const response = axiosMyItems(myInfo.userId);
      //   console.log(response);
      setMyItems(dummyData);
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
            <Test itemName={key as StoreItemType} items={value} />
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
