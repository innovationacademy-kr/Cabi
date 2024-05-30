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

const AdminItemProvisionModal: React.FC<PenaltyModalProps> = ({ onClose }) => {
  const [selectedItem, setSelectedItem] = useState<IItemDetail | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [items, setItems] = useState<IItemDetail[]>([]);
  const [statusOptions, setStatusOptions] = useState<IDropdownOptions[]>([]);
  const [typeOptions, setTypeOptions] = useState<IDropdownOptions[]>([]);


  const HandlePenaltyItemUse = async () => {
    // setPostItemSku(item);
    // console.log("나중에 axios연결 selectOption", selectedItem);
  };

  const handleDropdownStatusChange = (option: StoreItemType) => {
    const foundItem = items.find((item) => {
      return item.itemType === option;
    });

    if (foundItem) {
      setSelectedItem(foundItem);

      setTypeOptions(
        foundItem.items.length === 1
          ? [{ name: "타입이 없습니다", value: foundItem.itemType }]
          : foundItem.items.map((item) => {
              return { name: item.itemDetails, value: item.itemDetails };
            })
      );
    }
  };

  const handleDropdownTypeChange = (option: StoreItemType) => {
    // setSelectedItem(option);
  };

  const STATUS_DROP_DOWN_PROPS = {
    options: statusOptions,
    defaultValue: statusOptions[0]?.name,
    onChangeValue: handleDropdownStatusChange,
  };
  const TYPE_DROP_DOWN_PROPS = {
    options: typeOptions,
    defaultValue: typeOptions[0]?.name,
    onChangeValue: handleDropdownTypeChange,
  };

  const getItems = async () => {
    try {
      const response = await axiosItems();
      setItems(response.data.items);
    } catch (error) {
      throw error;
    }
  };
  useEffect(() => {
    if (items.length) {
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

      setSelectedItem(sortedItems[0]);
      setStatusOptions(
        sortedItems.map((item) => {
          return { name: item.itemName, value: item.itemType };
        })
      );
      setTypeOptions(
        sortedItems[0].items.length === 1
          ? [{ name: "타입이 없습니다", value: sortedItems[0].itemType }]
          : sortedItems[0].items.map((item) => {
              return { name: item.itemDetails, value: item.itemDetails };
            })
      );
    }
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
