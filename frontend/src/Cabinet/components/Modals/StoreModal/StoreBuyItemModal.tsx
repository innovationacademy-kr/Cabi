import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import Dropdown from "@/Cabinet/components/Common/Dropdown";
import Modal, { IModalContents } from "@/Cabinet/components/Modals/Modal";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import { IItemDetail } from "@/Cabinet/types/dto/store.dto";
import { IItemStore } from "@/Cabinet/types/dto/store.dto";

interface StorModalProps {
  onClose: () => void;
  onPurchase: (item: IItemStore) => void;
  selectItem: IItemDetail;
}

const StoreBuyItemModal: React.FC<StorModalProps> = ({
  onClose,
  onPurchase,
  selectItem,
}) => {
  const [selectedOption, setSelectedOption] = useState(String(selectItem.items.length - 1));

  const handleDropdownChange = (option: string) => {
    setSelectedOption(option);
  };

  const modalContents: IModalContents = {
    type: "hasProceedBtn",
    iconType: "CHECK",
    iconScaleEffect: false,
    title: "구매 확인",
    detail: "",
    proceedBtnText: "네, 구매할게요",
    cancelBtnText: "취소",
    closeModal: onClose,
    onClickProceed: async () => {
      onPurchase(selectItem.items[Number(selectedOption)]);
    },
    renderAdditionalComponent: () => (
      <>
        {selectItem.items.length > 1 && (
          <ModalContainerStyled>
            <ModalDropdownNameStyled>
              {selectItem.itemName} 타입
            </ModalDropdownNameStyled>
            <Dropdown
              options={[
                {
                  name: selectItem.items[2].itemDetails,
                  value: "2",
                },
                {
                  name: selectItem.items[1].itemDetails,
                  value: "1",
                },
                {
                  name: selectItem.items[0].itemDetails,
                  value: "0",
                },
              ]}
              defaultValue={selectItem.items[2].itemDetails}
              onChangeValue={handleDropdownChange}
            />{" "}
          </ModalContainerStyled>
        )}

        <ModalDetailStyled>
          <p>
            <span>
              {selectItem.itemName}
              {selectItem.items.length > 1 && (
                <span>
                  {" "}
                  - {selectItem.items[Number(selectedOption)].itemDetails}
                </span>
              )}
            </span>
            을 구매합니다.
          </p>
          <p>
            구매시
            <span>
              {" "}
              {selectItem.items[Number(selectedOption)].itemPrice
                ? selectItem.items[Number(selectedOption)].itemPrice * -1
                : selectItem.items[0].itemPrice * -1}{" "}
              까비
            </span>
            가 소모됩니다.
          </p>
        </ModalDetailStyled>
      </>
    ),
  };

  return (
    <ModalPortal>
      <Modal modalContents={modalContents} />
    </ModalPortal>
  );
};

const ModalContainerStyled = styled.div`
  padding: 10px 20px 0 20px;
`;

const ModalDropdownNameStyled = styled.div`
  display: flex;
  margin: 10px 10px 15px 5px;
  font-size: 18px;
`;
const ModalDetailStyled = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 30px;
  > p {
    margin: 10px;
    > span {
      font-weight: 600;
    }
  }
`;
export default StoreBuyItemModal;
