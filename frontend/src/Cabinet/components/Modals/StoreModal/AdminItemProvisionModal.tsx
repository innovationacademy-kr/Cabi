import { useEffect, useState } from "react";
import styled from "styled-components";
import Dropdown, {
  IDropdownOptions,
} from "@/Cabinet/components/Common/Dropdown";
import Modal, { IModalContents } from "@/Cabinet/components/Modals/Modal";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/Cabinet/components/Modals/ResponseModal/ResponseModal";
import { ItemTypeLabelMap } from "@/Cabinet/assets/data/maps";
import { IItemDetail } from "@/Cabinet/types/dto/store.dto";
import {
  StoreExtensionType,
  StoreItemType,
  StorePenaltyType,
} from "@/Cabinet/types/enum/store.enum";
import { axiosItems } from "@/Cabinet/api/axios/axios.custom";

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

// const typeOptions: TypeOptions = {
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
    StoreItemType.EXTENSION
  );
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [isHasType, setIsHasType] = useState<boolean>(true);
  const [items, setItems] = useState<IItemDetail[]>([]);
  const [statusOptions, setStatusOptions] = useState<IDropdownOptions[]>([]);
  const [typeOptions, setTypeOptions] = useState<IDropdownOptions[]>([]);

  // const penaltyPeriod = [
  //   { sku: "PENALTY", period: ["3일", "7일", "31일"], str: "페널티" },
  //   { sku: "EXTENSION", period: ["3일", "15일", "31일"], str: "연장권" },
  //   { sku: "SWAP", period: "", str: "이사권" },
  //   { sku: "ALARM", period: "", str: "알람권" },
  // ];

  // const typeOptions = [
  //   { name: "3일", value: selectedOption },
  //   { name: "7일", value: selectedOption },
  //   { name: "15일", value: selectedOption },
  //   { name: "31일", value: selectedOption },
  //   { name: "타입이 없습니다", value: selectedOption, isDisable: true },
  // ];

  const HandlePenaltyItemUse = async () => {
    // setPostItemSku(item);
    console.log("나중에 axios연결 selectOption", selectedOption);
  };

  const handleDropdownStatusChange = (option: StoreItemType) => {
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
    options: statusOptions,
    defaultValue: statusOptions[0]?.name,
    onChangeValue: handleDropdownStatusChange,
  };

  // const TYPE_DROP_DOWN_PROPS = {
  //   options: typeOptions,
  //   defaultValue: typeOptions[0].name,
  //   onChangeValue: handleDropdownTypeChange,
  // };

  const getItems = async () => {
    try {
      const response = await axiosItems();
      setItems(response.data.items);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const sortedItems = items.sort((a, b) => {
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

    setStatusOptions(
      sortedItems.map((item) => {
        return { name: item.itemName, value: item.itemType };
      })
    );
  }, [items]);

  useEffect(() => {
    getItems();
  }, []);

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
        </ModalContainerStyled>

        <ModalContainerStyled>
          <ModalDropdownNameStyled>아이템 타입</ModalDropdownNameStyled>
          {/* <Dropdown {...TYPE_DROP_DOWN_PROPS} /> */}
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
