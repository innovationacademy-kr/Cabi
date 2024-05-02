import { StoreItemType } from "../enum/store.enum";

export interface IItem {
  Sku: string;
  ItemName: string;
  ItemPrice: number;
  StoreItemType: string;
  // ex) "3일"
}

export interface IItemStore {
  itemPrice: number;
  // ex) -2000
  itemDetails: string;
  // ex) "3일"
  itemSku: string;
  // ex) "extension_31"
}

export interface IItemDetail {
  description: string;
  // ex) "현재 대여 중인 사물함의 반납 기한을 3일, 15일 또는 30일 연장할 수 있습니다."
  // itemName: string;
  itemName: StoreItemType;
  // ex) "연장권"
  itemTypes: IItemStore[];
  // List<ItemDetailsDto>
  // TODO : 받는 데이터 형태 확인해서 필요시 description type 변경
}
