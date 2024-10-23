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
import { HttpStatusCode } from "axios";

interface IPenaltyModalProps {
  onClose: () => void;
}

const AdminItemProvisionModal: React.FC<IPenaltyModalProps> = ({ onClose }) => {
  const [selectedItemSku, setSelectedItemSku] = useState<string>("");
  // TODO : sku?
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [items, setItems] = useState<IItemDetail[]>([]);
  const [itemOptions, setItemOptions] = useState<IDropdownOptions[]>([]);
  const [itemTypeOptions, setItemTypeOptions] = useState<IDropdownOptions[]>(
    []
  );
  const [isItemDropdownOpen, setIsItemDropdownOpen] = useState(false);
  const [isItemTypeDropdownOpen, setIsItemTypeDropdownOpen] = useState(false);
  const [targetUserInfo] = useRecoilState(targetUserInfoState);

  const HandleItemProvisionBtn = async () => {
    setIsLoading(true);
    try {
      await axiosItemAssign(selectedItemSku, [targetUserInfo.userId!]);
      setModalTitle("아이템 지급완료");
    } catch (error: any) {
      setHasErrorOnResponse(true);
      if (error.response.status === HttpStatusCode.BadRequest) setModalTitle("아이템 지급실패");
      else
        error.response
          ? setModalTitle(error.response.data.message)
          : setModalTitle(error.data.message);
    } finally {
      setShowResponseModal(true);
      setIsLoading(false);
    }
  };

  const handleItemDropdownChange = (option: StoreItemType) => {
    const foundItem = items.find((item) => {
      return item.itemType === option;
    });

    if (foundItem) {
      setItemTypeOptions(getItemTypeOptions(foundItem));
      setSelectedItemSku(foundItem.items[0].itemSku);
    }
  };

  const handleItemTypeDropdownChange = (option: any) => {
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

  const itemDropDownProps = {
    options: itemOptions,
    defaultValue: itemOptions[0]?.name,
    onChangeValue: handleItemDropdownChange,
    isOpen: isItemDropdownOpen,
    setIsOpen: setIsItemDropdownOpen,
    closeOtherDropdown: () => setIsItemTypeDropdownOpen(false),
  };

  const itemTypeDropDownProps = {
    options: itemTypeOptions,
    defaultValue: itemTypeOptions[0]?.name,
    onChangeValue: handleItemTypeDropdownChange,
    isOpen: isItemTypeDropdownOpen,
    setIsOpen: setIsItemTypeDropdownOpen,
    closeOtherDropdown: () => setIsItemDropdownOpen(false),
  };

  useEffect(() => {
    if (items.length) {
      const sortedItems = sortItems(items);

      setItemOptions(
        sortedItems.map((item) => {
          return { name: item.itemName, value: item.itemType };
        })
      );
      setItemTypeOptions(getItemTypeOptions(sortedItems[0]));
      setSelectedItemSku(sortedItems[0].items[0].itemSku);
    }
  }, [items]);

  useEffect(() => {
    getItems();
  }, []);

  const getItemTypeOptions = (item: IItemDetail) => {
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
          <Dropdown {...itemDropDownProps} />
        </ModalWrapperStyled>

        <ModalWrapperStyled>
          <ModalDropdownNameStyled>아이템 타입</ModalDropdownNameStyled>
          <Dropdown {...itemTypeDropDownProps} />
        </ModalWrapperStyled>
      </>
    ),
  };

  return (
    <ModalPortal>
      {!showResponseModal && <Modal modalContents={modalContents} />}
      {showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal modalTitle={modalTitle} closeModal={onClose} />
        ) : (
          <SuccessResponseModal modalTitle={modalTitle} closeModal={onClose} />
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
