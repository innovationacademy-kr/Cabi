import { useEffect, useState } from "react";
import styled from "styled-components";
import StoreItemCard from "@/Cabinet/components/Card/StoreItemCard/StoreItemCard";
import StoreBuyItemModal from "@/Cabinet/components/Modals/StoreModal/StoreBuyItemModal";
import StoreCoinPick from "@/Cabinet/components/Store/StoreCoinPick";
import { IItemDetail } from "@/Cabinet/types/dto/store.dto";
import { axiosItems } from "@/Cabinet/api/axios/axios.custom";

const StoreMainPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IItemDetail | null>(null);
  const [items, setItem] = useState([] as IItemDetail[]);
  const [myCoin, setMyCoin] = useState<number | null>(null); // TODO : 실제 데이터 들어오면 지우기
  // TODO : const [userInfo] = useRecoilState(userState);
  const checkMyCoin = (item: IItemDetail) => {
    return (
      myCoin !== null &&
      myCoin > item.items[item.items.length - 1].itemPrice * -1
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
    setMyCoin(400);
    // TODO : 실제 데이터 들어오면 지우기
    // TODO : setMyCoin(userInfo.coins);
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
        {items.map((item: IItemDetail) => (
          <StoreItemCard
            key={item.itemName}
            item={item}
            button={{
              label: "구매하기",
              onClick: checkMyCoin(item) ? () => buttonClick(item) : () => {},
              isClickable: checkMyCoin(item),
              color: checkMyCoin(item)
                ? "var(--main-color)"
                : "var(--gray-color)",
            }}
          />
        ))}
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
    "coinPick extension move"
    "coinPick alarm penalty";

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
