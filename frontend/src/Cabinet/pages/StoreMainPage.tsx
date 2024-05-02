import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { myCoinsState } from "@/Cabinet/recoil/atoms";
import StoreItemCard from "@/Cabinet/components/Card/StoreItemCard/StoreItemCard";
import { NotificationModal } from "@/Cabinet/components/Modals/NotificationModal/NotificationModal";
import StoreBuyItemModal from "@/Cabinet/components/Modals/StoreModal/StoreBuyItemModal";
import StoreCoinPick from "@/Cabinet/components/Store/StoreCoinPick";
import { IItemDetail } from "@/Cabinet/types/dto/store.dto";
import { IItemStore } from "@/Cabinet/types/dto/store.dto";
import IconType from "@/Cabinet/types/enum/icon.type.enum";
import { axiosBuyItem, axiosItems } from "@/Cabinet/api/axios/axios.custom";

const StoreMainPage = () => {
  const [myCoin, setMyCoin] = useRecoilState(myCoinsState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IItemDetail | null>(null);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [errorDetails, setErrorDetails] = useState("");
  const [items, setItem] = useState([] as IItemDetail[]);

  const getItems = async () => {
    try {
      const response = await axiosItems();
      console.log("response: ", response.data.items);
      setItem(response.data.items);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const buttonClick = (item: IItemDetail) => {
    console.log(myCoin);
    console.log("Items=", items);
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handlePurchase = (item: IItemStore) => {
    // 선택한 옵션에 따른 구매 처리 로직 구현
    console.log("myCoin : ", myCoin);
    if (myCoin !== null && item.itemPrice * -1 > myCoin) {
      //  보유 코인이 모자란 경우
      setShowErrorModal(true);
      setErrorDetails(`${item.itemPrice * -1 - myCoin} 까비가 더 필요합니다.`);
    } else {
      axiosBuyItem(item.itemSku); // 아이템 구매 post 요청
      console.log(`선택한 옵션: `, item);
      setShowSuccessModal(true);
    }
    // 구매 처리 후 모달 닫기
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <WrapperStyled>
      <HeaderStyled>
        <StoreTitleStyled>까비 상점</StoreTitleStyled>
      </HeaderStyled>

      <StoreCoinGridWrapper>
        <StoreCoinPick />
        {items.map((item: IItemDetail) => (
          <StoreItemCard
            key={item.itemName}
            item={item}
            button={{
              label: "구매하기",
              onClick:
                myCoin !== null &&
                myCoin >
                  item.itemTypes[item.itemTypes.length - 1].itemPrice * -1
                  ? () => buttonClick(item)
                  : () => {},
              isClickable:
                myCoin !== null &&
                myCoin >
                  item.itemTypes[item.itemTypes.length - 1].itemPrice * -1,
              color:
                myCoin !== null &&
                myCoin >
                  item.itemTypes[item.itemTypes.length - 1].itemPrice * -1
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
