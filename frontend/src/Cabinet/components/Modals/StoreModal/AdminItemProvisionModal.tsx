import { useState } from "react";
import styled from "styled-components";
import Dropdown from "@/Cabinet/components/Common/Dropdown";
import Modal, { IModalContents } from "@/Cabinet/components/Modals/Modal";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/Cabinet/components/Modals/ResponseModal/ResponseModal";
import {
  StoreExtensionType,
  StoreItemType,
  StorePenaltyType,
} from "@/Cabinet/types/enum/store.enum";

interface PenaltyModalProps {
  onClose: () => void;
}

type TypeOptions = {
  [key in StoreItemType]: {
    name: string;
    value: StorePenaltyType | StoreExtensionType | StoreItemType;
    isDisable?: boolean;
  }[];
};

const STATUS_OPTIONS = [
  { name: "이사권", value: StoreItemType.SWAP },
  { name: "연장권", value: StoreItemType.EXTENSION },
  { name: "알람권", value: StoreItemType.ALARM },
  { name: "페널티", value: StoreItemType.PENALTY },
];

// const TYPE_OPTIONS: TypeOptions = {
//   [StoreItemType.PENALTY]: [
//     { name: "3일", value: StorePenaltyType.PENALTY_3 },
//     { name: "7일", value: StorePenaltyType.PENALTY_7 },
//     { name: "31일", value: StorePenaltyType.PENALTY_31 },
//   ],
//   [StoreItemType.EXTENSION]: [
//     { name: "3일", value: StoreExtensionType.EXTENSION_3 },
//     { name: "15일", value: StoreExtensionType.EXTENSION_15 },
//     { name: "31일", value: StoreExtensionType.EXTENSION_31 },
//   ],
//   [StoreItemType.SWAP]: [
//     { name: "타입이 없습니다.", value: StoreItemType.SWAP, isDisable: true },
//   ],
//   [StoreItemType.ALARM]: [
//     { name: "타입이 없습니다.", value: StoreItemType.ALARM, isDisable: true },
//   ],
// };

const AdminItemProvisionModal: React.FC<PenaltyModalProps> = ({ onClose }) => {
  const [selectedOption, setSelectedOption] = useState<StoreItemType>(
    StoreItemType.SWAP
  );
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [isHasType, setIsHasType] = useState<boolean>(true);

  // const penaltyPeriod = [
  //   { sku: "PENALTY", period: ["3일", "7일", "31일"], str: "페널티" },
  //   { sku: "EXTENSION", period: ["3일", "15일", "31일"], str: "연장권" },
  //   { sku: "SWAP", period: "", str: "이사권" },
  //   { sku: "ALARM", period: "", str: "알람권" },
  // ];

  const TYPE_OPTIONS = [
    { name: "3일", value: selectedOption },
    { name: "7일", value: selectedOption },
    { name: "15일", value: selectedOption },
    { name: "31일", value: selectedOption },
    { name: "타입이 없습니다", value: selectedOption, isDisable: true },
  ];

  const HandlePenaltyItemUse = async () => {
    // setPostItemSku(item);
    console.log("나중에 axios연결 selectOption", selectedOption);
  };

  const handleDropdownStatusChange = (
    option: StorePenaltyType | StoreExtensionType | StoreItemType
  ) => {
    // console.log("admin optionss", option);
    setSelectedOption(option);
    // if (option === StoreItemType.PENALTY || option === StoreItemType.EXTENSION)
    //   setIsHasType(true);
    // else setIsHasType(false);
  };

  const handleDropdownTypeChange = (option: StoreItemType) => {
    // console.log("admin optionss", option);
    setSelectedOption(option);
  };

  const STATUS_DROP_DOWN_PROPS = {
    options: STATUS_OPTIONS,
    defaultValue: STATUS_OPTIONS[0].name,
    onChangeValue: handleDropdownStatusChange,
  };

  // const TYPE_DROP_DOWN_PROPS = {
  //   options: TYPE_OPTIONS[selectedOption as StoreItemType],
  //   defaultValue: TYPE_OPTIONS[selectedOption as StoreItemType][0].name,
  //   onChangeValue: handleDropdownTypeChange,
  // };
  const TYPE_DROP_DOWN_PROPS = {
    options: TYPE_OPTIONS,
    defaultValue: TYPE_OPTIONS[0].name,
    onChangeValue: handleDropdownTypeChange,
  };

  const modalContents: IModalContents = {
    type: "hasProceedBtn",
    iconType: "CHECK",
    iconScaleEffect: false,
    title: "아이템 지급",
    proceedBtnText: "네, 사용할게요",
    cancelBtnText: "취소",
    closeModal: onClose,
    isLoading: isLoading,
    onClickProceed: async () => {
      HandlePenaltyItemUse();
    },
    renderAdditionalComponent: () => (
      <>
        <ModalContainerStyled>
          <ModalDropdownNameStyled>아이템</ModalDropdownNameStyled>
          <Dropdown {...STATUS_DROP_DOWN_PROPS} />
          {/* <Dropdown
            options={[
              {
                name: penaltyPeriod[0].str,
                value: "0",
              },
              {
                name: penaltyPeriod[1].str,
                value: "1",
              },
              {
                name: penaltyPeriod[2].str,
                value: "2",
              },
              {
                name: penaltyPeriod[3].str,
                value: "3",
              },
            ]}
            defaultValue={penaltyPeriod[0].str}
            onChangeValue={handleDropdownChange}
          /> */}
        </ModalContainerStyled>

        <ModalContainerStyled>
          <ModalDropdownNameStyled>아이템 타입</ModalDropdownNameStyled>
          <Dropdown {...TYPE_DROP_DOWN_PROPS} />
        </ModalContainerStyled>
      </>
    ),
  };

  return (
    <ModalPortal>
      {!showResponseModal && <Modal modalContents={modalContents} />}
      {showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal
            modalTitle={modalTitle}
            modalContents={modalContent}
            closeModal={onClose}
          />
        ) : (
          <SuccessResponseModal
            modalTitle={modalTitle}
            modalContents={modalContent}
            closeModal={onClose}
          />
        ))}
    </ModalPortal>
  );
};

const ModalDropdownTypeEmptyStyled = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid var(--line-color);
  width: 100%;
  height: 60px;
  border-radius: 10px;
  text-align: start;
  padding-left: 20px;
  font-size: 1.125rem;
  color: var(--sys-main-color);
`;

const ModalContainerStyled = styled.div`
  padding: 10px 20px 0 20px;
`;

const ModalDropdownNameStyled = styled.div`
  display: flex;
  margin: 10px 10px 15px 5px;
  font-size: 18px;
`;

export default AdminItemProvisionModal;
