import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { targetUserInfoState } from "@/Cabinet/recoil/atoms";
import { sortItems } from "@/Cabinet/pages/StoreMainPage";
import Dropdown, {
  IDropdownOptions,
} from "@/Cabinet/components/Common/Dropdown";
import Modal, { IModalContents } from "@/Cabinet/components/Modals/Modal";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/Cabinet/components/Modals/ResponseModal/ResponseModal";
import { IItemDetail } from "@/Cabinet/types/dto/store.dto";
import { StoreItemType } from "@/Cabinet/types/enum/store.enum";
import { axiosItemAssign, axiosItems } from "@/Cabinet/api/axios/axios.custom";

interface IPenaltyModalProps {
  onClose: () => void;
}

// TODO : drop down option 닫기

const AdminItemProvisionModal: React.FC<IPenaltyModalProps> = ({ onClose }) => {
  const [selectedItemSku, setSelectedItemSku] = useState<string>("");
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
    setIsLoading(true);
    try {
      await axiosItemAssign(selectedItemSku, [targetUserInfo.userId!]);
      // TODO : setModalContent
    } catch (error: any) {
      setHasErrorOnResponse(true);
      console.log("error : ", error);
      // TODO : setModalContent
      error.response
        ? setModalTitle(error.response.data.message)
        : setModalTitle(error.data.message);
      // TODO : error일때 오는 데이터 확인해서 수정
    } finally {
      setShowResponseModal(true);
      setIsLoading(false);
    }
  };

  const handleDropdownStatusChange = (option: StoreItemType) => {
    const foundItem = items.find((item) => {
      return item.itemType === option;
    });

    if (foundItem) {
      setTypeOptions(getTypeOptions(foundItem));
      setSelectedItemSku(foundItem.items[0].itemSku);
    }
  };

  const handleDropdownTypeChange = (option: any) => {
    // TODO : sku?
    setSelectedItemSku(option);
  };

  const getItems = async () => {
    try {
      const response = await axiosItems();
      setItems(response.data.items);
    } catch (error) {
      throw error;
    }
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

  useEffect(() => {
    if (items.length) {
      const sortedItems = sortItems(items);

      setStatusOptions(
        sortedItems.map((item) => {
          return { name: item.itemName, value: item.itemType };
        })
      );
      setTypeOptions(getTypeOptions(sortedItems[0]));
      setSelectedItemSku(sortedItems[0].items[0].itemSku);
    }
  }, [items]);

  useEffect(() => {
    getItems();
  }, []);

  const getTypeOptions = (item: IItemDetail) => {
    return item.items.length === 1
      ? [
          {
            name: "타입이 없습니다",
            value: item.items[0].itemSku,
            hasNoOptions: true,
          },
        ]
      : item.items.map((item) => {
          return { name: item.itemDetails, value: item.itemSku };
        });
  };

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
        <ModalWrapperStyled>
          <ModalDropdownNameStyled>아이템</ModalDropdownNameStyled>
          <Dropdown {...statusDropDownProps} />
        </ModalWrapperStyled>

        <ModalWrapperStyled>
          <ModalDropdownNameStyled>아이템 타입</ModalDropdownNameStyled>
          <Dropdown {...typeDropDownProps} />
        </ModalWrapperStyled>
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

const ModalWrapperStyled = styled.div`
  padding: 10px 20px 0 20px;
`;

const ModalDropdownNameStyled = styled.div`
  display: flex;
  margin: 10px 10px 15px 5px;
  font-size: 18px;
`;

export default AdminItemProvisionModal;
