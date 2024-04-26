import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { modalPropsMap } from "@/Cabinet/assets/data/maps";
import { MyCabinetInfoResponseDto } from "@/Cabinet/types/dto/cabinet.dto";
import IconType from "@/Cabinet/types/enum/icon.type.enum";
import Modal, { IModalContents } from "../Modal";
import ModalPortal from "../ModalPortal";
import Dropdown from "@/Cabinet/components/Common/Dropdown";
import styled from "styled-components";


interface StorModalProps {
  onClose: () => void;
  onPurchase: (selectedOption: string) => void;
}

const StorModal: React.FC<StorModalProps> = ({ onClose, onPurchase }) => {
  const [selectedOption, setSelectedOption] = useState("30일권");

  const handleDropdownChange = (option: string) => {
    setSelectedOption(option);
  };

  const modalContents: IModalContents = {
    type: "hasProceedBtn",
    iconType: "CHECK",
    iconScaleEffect: true,
    title: "구매 확인",
    detail: `${selectedOption}을 구매합니다.\n구매시 2000 까비 가 소모됩니다.`,
    proceedBtnText: "네, 구매할게요",
    cancelBtnText: "취소",
    closeModal: onClose,
    onClickProceed: async () => {
      onPurchase(selectedOption);
    },
    renderAdditionalComponent: () => (
        <>
        <ModalDetailStyled>r긒ㄹ자입력</ModalDetailStyled>
      <Dropdown
        options={[
            { name: "30일권", value: "30일권" },
            { name: "10일권", value: "10일권" },
        ]}
        defaultValue={selectedOption}
        onChangeValue={handleDropdownChange}
        />
        </>
    ),
  };

  return (
    <ModalPortal>
      <Modal modalContents={modalContents} />

    </ModalPortal>
  );
};

const ModalDetailStyled = styled.div`
width: 100%;
height: 100%;
background-color: red;
`
  export default StorModal;
