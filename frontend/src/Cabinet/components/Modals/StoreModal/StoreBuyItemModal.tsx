import { useEffect, useState } from "react";
import styled from "styled-components";
import Dropdown from "@/Cabinet/components/Common/Dropdown";
import Modal, { IModalContents } from "@/Cabinet/components/Modals/Modal";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import { IItemDetail } from "@/Cabinet/types/dto/store.dto";
import { IItemStore } from "@/Cabinet/types/dto/store.dto";
import IconType from "@/Cabinet/types/enum/icon.type.enum";
import { axiosBuyItem } from "@/Cabinet/api/axios/axios.custom";
import { NotificationModal } from "../NotificationModal/NotificationModal";

const StoreBuyItemModal: React.FC<{
  onClose: () => void;
  selectItem: IItemDetail;
}> = (props) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState(
    String(props.selectItem.items.length - 1)
  );
  const [errorDetails, setErrorDetails] = useState("");
  const [myCoin, setMyCoin] = useState<number | null>(null); // TODO : 실제 데이터 들어오면 지우기

  const handlePurchase = (item: IItemStore) => {
    if (myCoin !== null && item.itemPrice * -1 > myCoin) {
      setShowResponseModal(true);
      setHasErrorOnResponse(true);
      setErrorDetails(`${item.itemPrice * -1 - myCoin} 까비가 더 필요합니다.`);
    } else {
      try {
        axiosBuyItem(item.itemSku);
        setHasErrorOnResponse(false);
      } catch (error) {
        throw error;
      } finally {
        setShowResponseModal(true);
      }
    }
  };

  useEffect(() => {
    setMyCoin(400);
    // TODO : 실제 데이터 들어오면 지우기
    // TODO : setMyCoin(userInfo.coins);
  }, []);

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
            <Dropdown
              options={[
                {
                  name: props.selectItem.items[2].itemDetails,
                  value: "2",
                },
                {
                  name: props.selectItem.items[1].itemDetails,
                  value: "1",
                },
                {
                  name: props.selectItem.items[0].itemDetails,
                  value: "0",
                },
              ]}
              defaultValue={props.selectItem.items[2].itemDetails}
              onChangeValue={handleDropdownChange}
            />{" "}
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
              {props.selectItem.items[Number(selectedOption)].itemPrice
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
          <NotificationModal
            title="코인이 부족합니다."
            detail={errorDetails}
            closeModal={props.onClose}
            iconType={IconType.ERRORICON}
          />
        ) : (
          <NotificationModal
            title="구매 완료."
            detail={""}
            closeModal={props.onClose}
            iconType={IconType.CHECKICON}
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
