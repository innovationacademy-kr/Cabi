import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { IStoreItem } from "@/Cabinet/pages/StoreMainPage";
import Dropdown from "@/Cabinet/components/Common/Dropdown";
import IconType from "@/Cabinet/types/enum/icon.type.enum";
import Modal, { IModalContents } from "../Modal";
import ModalPortal from "../ModalPortal";

interface StorModalProps {
  onClose: () => void;
  onPurchase: (selectedOption: string) => void;
  selectItem: IStoreItem;
}

const StoreModal: React.FC<StorModalProps> = ({
  onClose,
  onPurchase,
  selectItem,
}) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleDropdownChange = (option: string) => {
    setSelectedOption(option);
  };

  const modalContents: IModalContents = {
    type: "hasProceedBtn",
    iconType: "CHECK",
    iconScaleEffect: true,
    title: "구매 확인",
    detail: "",
    proceedBtnText: "네, 구매할게요",
    cancelBtnText: "취소",
    closeModal: onClose,
    onClickProceed: async () => {
      onPurchase(selectedOption);
    },
    renderAdditionalComponent: () => (
      <>
        {(selectItem.ItemId === 1 || selectItem.ItemId === 4) && (
          <>
            <ModalDropdownNameStyled>
              {selectItem.ItemName} 타입
            </ModalDropdownNameStyled>
            <Dropdown
              options={[
                { name: "31일권", value: "31일" },
                { name: "15일권", value: "15일" },
                { name: "3일권", value: "3일" },
              ]}
              defaultValue={selectedOption}
              onChangeValue={handleDropdownChange}
            />{" "}
          </>
        )}

        <ModalDetailStyled>
          <p>
            <span>
              {selectItem.ItemName}
              {selectedOption && <span> -{selectedOption}</span>}
            </span>
            을 구매합니다.
          </p>
          <p>
            구매시
            <span> {selectItem.ItemPrice}까비</span>가 소모됩니다.
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

const ModalDropdownNameStyled = styled.div`
  display: flex;
  margin: 10px 10px 15px 10px;
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
export default StoreModal;
