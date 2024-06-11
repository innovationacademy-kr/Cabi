import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { userState } from "@/Cabinet/recoil/atoms";
import Dropdown, { IDropdown } from "@/Cabinet/components/Common/Dropdown";
import Modal, { IModalContents } from "@/Cabinet/components/Modals/Modal";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/Cabinet/components/Modals/ResponseModal/ResponseModal";
import { IItemDetail } from "@/Cabinet/types/dto/store.dto";
import { IItemStore } from "@/Cabinet/types/dto/store.dto";
import { UserDto } from "@/Cabinet/types/dto/user.dto";
import { axiosBuyItem, axiosMyInfo } from "@/Cabinet/api/axios/axios.custom";

const StoreBuyItemModal: React.FC<{
  onClose: () => void;
  selectItem: IItemDetail;
}> = (props) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState("0");
  const [errorDetails, setErrorDetails] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo] = useRecoilState(userState);
  const setUser = useSetRecoilState<UserDto>(userState);

  const handlePurchase = async (item: IItemStore) => {
    if (userInfo.coins !== null && item.itemPrice * -1 > userInfo.coins) {
      setShowResponseModal(true);
      setHasErrorOnResponse(true);
      setErrorDetails(
        `${item.itemPrice * -1 - userInfo.coins} 까비가 더 필요합니다.`
      );
    } else {
      try {
        await axiosBuyItem(item.itemSku);
        const { data: myInfo } = await axiosMyInfo();
        setHasErrorOnResponse(false);
        setUser(myInfo);
      } catch (error) {
        throw error;
      } finally {
        setShowResponseModal(true);
      }
    }
  };

  const handleDropdownChange = (option: string) => {
    setSelectedOption(option);
  };

  let dropdownProps: IDropdown = {
    options:
      props.selectItem.items.length > 1
        ? [
            { name: props.selectItem.items[0].itemDetails, value: "0" },
            { name: props.selectItem.items[1].itemDetails, value: "1" },
            { name: props.selectItem.items[2].itemDetails, value: "2" },
          ]
        : [],
    defaultValue:
      props.selectItem.items.length > 1
        ? props.selectItem.items[0].itemDetails
        : "",
    onChangeValue: handleDropdownChange,
    isOpen: isOpen,
    setIsOpen: setIsOpen,
  };

  const modalContents: IModalContents = {
    type: "hasProceedBtn",
    iconType: "CHECK",
    iconScaleEffect: false,
    title: "구매 확인",
    detail: "",
    proceedBtnText: "네, 구매할게요",
    cancelBtnText: "취소",
    closeModal: props.onClose,
    onClickProceed: async () => {
      handlePurchase(props.selectItem.items[Number(selectedOption)]);
    },
    renderAdditionalComponent: () => (
      <>
        {props.selectItem.items.length > 1 && (
          <ModalContainerStyled>
            <ModalDropdownNameStyled>
              {props.selectItem.itemName} 타입
            </ModalDropdownNameStyled>
            <Dropdown {...dropdownProps} />{" "}
          </ModalContainerStyled>
        )}
        <ModalDetailStyled>
          <p>
            <span>
              {props.selectItem.itemName}
              {props.selectItem.items.length > 1 && (
                <span>
                  {" "}
                  - {props.selectItem.items[Number(selectedOption)].itemDetails}
                </span>
              )}
            </span>
            을 구매합니다.
          </p>
          <p>
            구매시
            <span>
              {" "}
              {props.selectItem.items[Number(selectedOption)]?.itemPrice
                ? props.selectItem.items[Number(selectedOption)].itemPrice * -1
                : props.selectItem.items[0].itemPrice * -1}{" "}
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
      {!showResponseModal && <Modal modalContents={modalContents} />}
      {showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal
            modalTitle="코인이 부족합니다"
            modalContents={errorDetails}
            closeModal={props.onClose}
          />
        ) : (
          <SuccessResponseModal
            modalTitle="구매 완료"
            modalContents={""}
            closeModal={props.onClose}
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
const ModalDetailStyled = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 30px;
  & p {
    margin: 10px;
    & span {
      font-weight: 600;
    }
  }
`;
export default StoreBuyItemModal;
