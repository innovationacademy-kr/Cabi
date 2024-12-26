import { StoreItemType } from "@/Cabinet/types/enum/store.enum";

export interface IStoreItem {
  itemSku: string;
  itemType: StoreItemType;
  itemPrice: number;
  itemDetails: string;
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
  itemName: string;
  // ex) "연장권"
  itemType: StoreItemType;
  // ex) "EXTENSION"
  items: IItemStore[];
  // List<ItemDetailsDto>
}

export interface IItemTimeRemaining {
  days: number;
  hours: number;
  minutes: number;
}

export interface ICoinCollectInfoDto {
  coinCount: number;
  userCount: number;
}
