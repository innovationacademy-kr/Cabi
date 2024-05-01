import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { myCoinsState } from "@/Cabinet/recoil/atoms";
import StoreCoinPick from "@/Cabinet/components/Store/StoreCoinPick";
import { ReactComponent as AlarmImg } from "@/Cabinet/assets/images/storeAlarm.svg";
import { ReactComponent as ExtensionImg } from "@/Cabinet/assets/images/storeExtension.svg";
import { ReactComponent as MoveImg } from "@/Cabinet/assets/images/storeMove.svg";
import { ReactComponent as PenaltyImg } from "@/Cabinet/assets/images/storePenalty.svg";
import { axiosBuyItem, axiosItems } from "../api/axios/axios.custom";
import { ItemIconMap } from "../assets/data/maps";
import StoreItemCard from "../components/Card/StoreItemCard/StoreItemCard";
import { NotificationModal } from "../components/Modals/NotificationModal/NotificationModal";
import { SuccessResponseModal } from "../components/Modals/ResponseModal/ResponseModal";
import StoreBuyItemModal from "../components/Modals/StoreModal/StoreBuyItemModal";
import IconType from "../types/enum/icon.type.enum";

export interface IItemType {
  Sku: string;
  ItemName: string;
  ItemPrice: number;
  ItemType: string;
}

export interface IStoreItem {
  ItemName: string;
  Description: string;
  itemTypes: IItemType[];
  logo: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

const ItemStoreDto = [
  {
    ItemName: "연장권",
    Description:
      "현재 대여 중인 사물함의 반납 기한을 3일, 15일 또는 30일 연장할 수 있습니다.",
    itemTypes: [
      {
        Sku: "extension_3",
        ItemName: "연장권",
        ItemPrice: -300,
        ItemType: "3일",
      },
      {
        Sku: "extension_15",
        ItemName: "연장권",
        ItemPrice: -1200,
        ItemType: "15일",
      },
      {
        Sku: "extension_31",
        ItemName: "연장권",
        ItemPrice: -2000,
        ItemType: "31일",
      },
    ],
    logo: ItemIconMap.EXTENSION,
  },
  {
    ItemName: "이사권",
    Description: "내용입니다",
    itemTypes: [
      {
        Sku: "move",
        ItemName: "이사권",
        ItemPrice: -100,
        ItemType: "",
      },
    ],
    logo: ItemIconMap.SWAP,
  },
  {
    ItemName: "알림등록권",
    Description: "내용입니다",
    itemTypes: [
      {
        Sku: "alarm",
        ItemName: "알림등록권",
        ItemPrice: -100,
        ItemType: "",
      },
    ],
    logo: ItemIconMap.ALERT,
  },
  {
    ItemName: "패널티삭제권",
    Description:
      "현재 대여 중인 사물함의 반납 기한을 3일, 15일 또는 30일 연장할 수 있습니다.",
    itemTypes: [
      {
        Sku: "penalty_3",
        ItemName: "패널티삭제권",
        ItemPrice: -600,
        ItemType: "3일",
      },
      {
        Sku: "penalty_15",
        ItemName: "패널티삭제권",
        ItemPrice: -1400,
        ItemType: "7일",
      },
      {
        Sku: "penalty_31",
        ItemName: "패널티삭제권",
        ItemPrice: -6200,
        ItemType: "31일",
      },
    ],
    logo: ItemIconMap.PENALTY,
  },
];

const StoreMainPage = () => {
  const [myCoin, setMyCoin] = useRecoilState(myCoinsState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IStoreItem | null>(null);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [errorDetails, setErrorDetails] = useState("");

  const [Item, setItem] = useState([]);
  const getItems = async () => {
    try {
      const response = await axiosItems();
      console.log("response: ", response);
      setItem(response.data);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const buttonClick = (item: IStoreItem) => {
    console.log(Item);
    console.log(myCoin);
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handlePurchase = (item: IItemType) => {
    // 선택한 옵션에 따른 구매 처리 로직 구현
    console.log("myCoin : ", myCoin);
    if (myCoin !== null && item.ItemPrice * -1 > myCoin) {
      //  보유 코인이 모자란 경우
      setShowErrorModal(true);
      setErrorDetails(`${item.ItemPrice * -1 - myCoin} 까비가 더 필요합니다.`);
      console.log("코인이 부족합니다.");
    } else {
      axiosBuyItem(item.Sku); // 아이템 구매 post 요청
      console.log(`선택한 옵션: `, item);
      setShowSuccessModal(true);
    }
    // 구매 처리 후 모달 닫기
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const Items = [
    {
      ItemId: 1,
      ItemName: "연장권",
      ItemPrice: 300,
      ItemType: "사물함을 연장 할 수 있는 연장권 설명 내용입니다.",
      grid: "extension",
      logo: ExtensionImg,
    },
    {
      ItemId: 2,
      ItemName: "이사권",
      ItemPrice: 100,
      ItemType: "이사권 설명 내용입니다.",
      grid: "move",
      logo: MoveImg,
    },
    {
      ItemId: 3,
      ItemName: "알림 등록권",
      ItemPrice: 100,
      ItemType: "알림 등록권 설명 내용입니다.",
      grid: "alarm",
      logo: AlarmImg,
    },
    {
      ItemId: 4,
      ItemName: "패널티 축소권",
      ItemPrice: 600,
      ItemType: "패널티 축소권 설명 내용입니다.",
      grid: "penalty",
      logo: PenaltyImg,
    },
  ];
  return (
    <WrapperStyled>
      <HeaderStyled>
        <StoreTitleStyled>까비 상점</StoreTitleStyled>
      </HeaderStyled>

      <StoreCoinGridWrapper>
        <StoreCoinPick />
        {ItemStoreDto.map((item: IStoreItem) => (
          <StoreItemCard
            key={item.ItemName}
            Item={item}
            button={{
              label: "구매하기",
              onClick:
                myCoin !== null && myCoin > item.itemTypes[0].ItemPrice * -1
                  ? () => buttonClick(item)
                  : () => {},
              isClickable:
                myCoin !== null && myCoin > item.itemTypes[0].ItemPrice * -1,
              color:
                myCoin !== null && myCoin > item.itemTypes[0].ItemPrice * -1
                  ? "var(--main-color)"
                  : "var(--gray-color)",
            }}
          />
        ))}
      </StoreCoinGridWrapper>
      {isModalOpen && selectedItem && (
        <StoreBuyItemModal
          onClose={handleCloseModal}
          onPurchase={handlePurchase}
          selectItem={selectedItem}
        />
      )}
      {showSuccessModal && (
        <NotificationModal
          title="구매 완료."
          detail={""}
          closeModal={() => setShowSuccessModal(false)}
          iconType={IconType.CHECKICON}
        />
      )}
      {showErrorModal && (
        <NotificationModal
          title="코인이 부족합니다."
          detail={errorDetails}
          closeModal={() => setShowErrorModal(false)}
          iconType={IconType.ERRORICON}
        />
      )}
    </WrapperStyled>
  );
};

const StoreTitleStyled = styled.div`
  margin-bottom: 20px;
  line-height: 1.1;
  // font-size: 3rem;
  font-size: 2.5rem;
  font-weight: 600;
`;

const StoreCoinGridWrapper = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  width: 100%;
  grid-gap: 20px;
  grid-template-columns: 340px 340px 340px;
  grid-template-rows: 150px 150px;
  grid-template-areas: "coinPick extension move" // h: 163px h: 366px
    "coinPick alarm penalty"; // h: 183px;
  // "theme notification"; // h: 230px h: 230px;

  padding-bottom: 30px;

  @media (max-width: 1400px) {
    grid-template-columns: 340px 340px;
    grid-template-rows: 150px 150px 150px;
    grid-template-areas:
      "coinPick extension "
      "coinPick move"
      "alarm penalty";
  }

  // 나중에 고치기
  @media (max-width: 768px) {
    grid-template-columns: 340px;
    grid-template-rows: 150px 150px 150px 150px 150px 150px;
    grid-template-areas:
      "coinPick"
      "coinPick"
      "extension"
      "move"
      "alarm"
      "notification";
  }
`;

const HeaderStyled = styled.div`
  // width: 90%;
  width: 100%;
  max-width: 1060px;
  border-bottom: 2px solid #d9d9d9;
  margin-bottom: 25px;

  @media (max-width: 1400px) {
    max-width: 700px;
  }

  @media (max-width: 768px) {
    max-width: 340px;
  }
`;

const WrapperStyled = styled.div`
  padding-top: 80px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export default StoreMainPage;
