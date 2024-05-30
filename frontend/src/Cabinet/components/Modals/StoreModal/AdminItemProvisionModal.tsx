import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { targetUserInfoState } from "@/Cabinet/recoil/atoms";
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
import { StoreItemType } from "@/Cabinet/types/enum/store.enum";
import { axiosItemAssign, axiosItems } from "@/Cabinet/api/axios/axios.custom";

interface IPenaltyModalProps {
  onClose: () => void;
}

// TODO : drop down option 닫기
// TODO : axiosItems items 적은 일수부터 띄워지는지 확인

const AdminItemProvisionModal: React.FC<IPenaltyModalProps> = ({ onClose }) => {
  const [selectedItem, setSelectedItem] = useState<IItemDetail | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<string>("");
  // TODO : sku?
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [items, setItems] = useState<IItemDetail[]>([]);
  const [statusOptions, setStatusOptions] = useState<IDropdownOptions[]>([]);
  const [typeOptions, setTypeOptions] = useState<IDropdownOptions[]>([]);
  const [targetUserInfo] = useRecoilState(targetUserInfoState);

  const HandleItemProvisionBtn = async () => {
    try {
      await axiosItemAssign(selectedItemType, targetUserInfo.userId!);
    } catch (error: any) {
      setHasErrorOnResponse(true);
      console.log("error : ", error);
      error.response
        ? setModalTitle(error.response.data.message)
        : setModalTitle(error.data.message);
      // TODO : error일때 오는 데이터 확인해서 수정
    } finally {
      setShowResponseModal(true);
    }
  };

  const handleDropdownStatusChange = (option: StoreItemType) => {
    const foundItem = items.find((item) => {
      return item.itemType === option;
    });

    if (foundItem) {
      setSelectedItem(foundItem);
      setTypeOptions(
        foundItem.items.length === 1
          ? [
              {
                name: "타입이 없습니다",
                value: foundItem.items[0].itemSku,
                hasNoOptions: true,
              },
            ]
          : foundItem.items.map((item) => {
              return { name: item.itemDetails, value: item.itemSku };
            })
      );
    }
  };

  const handleDropdownTypeChange = (option: any) => {
    // TODO : sku?
    setSelectedItemType(option);
  };

  const statusDropDownProps = {
    options: statusOptions,
    defaultValue: statusOptions[0]?.name,
    onChangeValue: handleDropdownStatusChange,
  };

  const typeDropDownProps = {
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
          ? [
              {
                name: "타입이 없습니다",
                value: sortedItems[0].items[0].itemSku,
                hasNoOptions: true,
              },
            ]
          : sortedItems[0].items.map((item) => {
              return { name: item.itemDetails, value: item.itemSku };
            })
      );
      setSelectedItemType(sortedItems[0].items[0].itemSku);
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
    proceedBtnText: "지급하기",
    cancelBtnText: "취소",
    closeModal: onClose,
    isLoading: isLoading,
    onClickProceed: async () => {
      HandleItemProvisionBtn();
    },
    renderAdditionalComponent: () => (
      <>
        <ModalContainerStyled>
          <ModalDropdownNameStyled>아이템</ModalDropdownNameStyled>
          <Dropdown {...statusDropDownProps} />
        </ModalContainerStyled>

        <ModalContainerStyled>
          <ModalDropdownNameStyled>아이템 타입</ModalDropdownNameStyled>
          <Dropdown {...typeDropDownProps} />
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

const ModalContainerStyled = styled.div`
  padding: 10px 20px 0 20px;
`;

const ModalDropdownNameStyled = styled.div`
  display: flex;
  margin: 10px 10px 15px 5px;
  font-size: 18px;
`;

export default AdminItemProvisionModal;
