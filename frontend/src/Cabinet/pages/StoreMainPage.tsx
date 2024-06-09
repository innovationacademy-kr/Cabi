import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { userState } from "@/Cabinet/recoil/atoms";
import StoreItemCard from "@/Cabinet/components/Card/StoreItemCard/StoreItemCard";
import StoreBuyItemModal from "@/Cabinet/components/Modals/StoreModal/StoreBuyItemModal";
import StoreCoinPick from "@/Cabinet/components/Store/StoreCoinPick";
import { ItemTypeLabelMap } from "@/Cabinet/assets/data/maps";
import { IItemDetail } from "@/Cabinet/types/dto/store.dto";
import { axiosItems } from "@/Cabinet/api/axios/axios.custom";

export const sortItems = (items: IItemDetail[]) => {
  return items.sort((a, b) => {
    const order = [
      ItemTypeLabelMap.EXTENSION,
      ItemTypeLabelMap.SWAP,
      ItemTypeLabelMap.ALARM,
      ItemTypeLabelMap.PENALTY,
    ];
    const indexA = order.indexOf(a.itemName);
    const indexB = order.indexOf(b.itemName);
    return indexA - indexB;
  });
};

const StoreMainPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IItemDetail | null>(null);
  const [items, setItem] = useState([] as IItemDetail[]);
  const [userInfo] = useRecoilState(userState);
  const sortedItems = sortItems(items);
  const checkMyCoin = (item: IItemDetail) => {
    
    if (item.items.length > 3) {
      return (
        userInfo.coins !== null && userInfo.coins >= item.items[1].itemPrice * -1
      );
    }
    else
    return (
      userInfo.coins !== null && userInfo.coins >= item.items[0].itemPrice * -1
    );
  };

  const getItems = async () => {
    try {
      const response = await axiosItems();
      setItem(response.data.items);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const buttonClick = (item: IItemDetail) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
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
        {sortedItems.map((item: IItemDetail) => {
          const filteredItems = item.items.filter(
            // 연장권 배열에 들어있는 출석 연장권 보상 아이템 제거 후 넘기기
            (innerItem) => innerItem.itemDetails !== "출석 연장권 보상"
          );
          return (
            <StoreItemCard
              key={item.itemName}
              item={{ ...item, items: filteredItems }}
              button={{
                label: "구매하기",
                onClick: checkMyCoin(item) ? () => buttonClick(item) : () => {},
                isClickable: checkMyCoin(item),
                fontColor: checkMyCoin(item)
                  ? "var(--sys-main-color)"
                  : "var(--gray-color)",
              }}
            />
          );
        })}
      </StoreCoinGridWrapper>
      {selectedItem && (
        <StoreBuyItemModal
          onClose={handleCloseModal}
          selectItem={selectedItem}
        />
      )}
    </WrapperStyled>
  );
};

const StoreTitleStyled = styled.div`
  margin-bottom: 20px;
  line-height: 1.1;
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
  grid-template-areas:
    "coinPick EXTENSION SWAP"
    "coinPick ALERT PENALTY";

  padding-bottom: 30px;

  @media (max-width: 1400px) {
    grid-template-columns: 340px 340px;
    grid-template-rows: 150px 150px 150px;
    grid-template-areas:
      "coinPick EXTENSION "
      "coinPick SWAP"
      "ALERT PENALTY";
  }

  // 나중에 고치기
  @media (max-width: 768px) {
    grid-template-columns: 340px;
    grid-template-rows: 150px 150px 150px 150px 150px 150px;
    grid-template-areas:
      "coinPick"
      "coinPick"
      "EXTENSION"
      "SWAP"
      "ALERT"
      "PENALTY";
  }
`;

const HeaderStyled = styled.div`
  // width: 90%;
  width: 100%;
  max-width: 1060px;
  border-bottom: 2px solid var(--service-man-title-border-btm-color);
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
