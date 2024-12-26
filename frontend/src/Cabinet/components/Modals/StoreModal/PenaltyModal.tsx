import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { userState } from "@/Cabinet/recoil/atoms";
import Dropdown, {
  IDropdownOptions,
  IDropdownProps,
} from "@/Cabinet/components/Common/Dropdown";
import Modal, { IModalContents } from "@/Cabinet/components/Modals/Modal";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/Cabinet/components/Modals/ResponseModal/ResponseModal";
import { IInventoryInfo } from "@/Cabinet/components/Store/Inventory/Inventory";
import {
  IItemDetail,
  IItemTimeRemaining,
  IStoreItem,
} from "@/Cabinet/types/dto/store.dto";
import { UserDto } from "@/Cabinet/types/dto/user.dto";
import {
  axiosItems,
  axiosMyInfo,
  axiosMyItems,
  axiosUseItem,
} from "@/Cabinet/api/axios/axios.custom";
import { formatDate, formatDateTime } from "@/Cabinet/utils/dateUtils";

interface PenaltyModalProps {
  onClose: () => void;
  remainPenaltyPeriod: IItemTimeRemaining | null;
}

const PenaltyModal: React.FC<PenaltyModalProps> = ({
  onClose,
  remainPenaltyPeriod,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const setMyInfo = useSetRecoilState<UserDto>(userState);
  const [statusOptions, setStatusOptions] = useState<IDropdownOptions[]>([]);
  const [isPenaltyItem, setIsPenaltyItem] = useState<boolean>(false);
  const [urlTitle, setUrlTitle] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const [items, setItems] = useState<IItemDetail[]>([]);
  const [myItems, setMyItems] = useState<IInventoryInfo | null>(null);

  useEffect(() => {
    getItems();
    getMyItems();
    tryPenaltyItemGet();
  }, []);

  const getItems = async () => {
    try {
      const response = await axiosItems();
      setItems(response.data.items);
    } catch (error) {
      throw error;
    }
  };

  const getMyItems = async () => {
    try {
      const response = await axiosMyItems();
      setMyItems(response.data);
    } catch (error: any) {
      console.error("Error getting inventory:", error);
    }
  };

  const handleDropdownChange = (option: string) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    if (items.length && myItems) {
      const penaltyItems = items.find(
        (item) => item.itemName === "페널티 감면권"
      );
      if (penaltyItems) {
        const options = penaltyItems.items.map((item) => ({
          name: item.itemDetails,
          value: item.itemSku,
          isDisabled: !myItems.penaltyItems.some(
            (myItem) => myItem.itemSku === item.itemSku
          ),
        }));
        setStatusOptions(options);
        setSelectedOption(
          options.find((option) => !option.isDisabled)?.value || ""
        );

        if (myItems.penaltyItems.length === 0) {
          setShowResponseModal(true);
          setHasErrorOnResponse(true);
          setModalTitle("페널티 감면권이 없습니다");
          setModalContent("페널티 감면권은 까비상점에서 구매하실 수 있습니다.");
          setUrlTitle("까비상점으로 이동");
          setUrl("/store");
        } else {
          setIsPenaltyItem(true);
        }
      }
    }
  }, [items, myItems]);

  const STATUS_DROP_DOWN_PROPS: IDropdownProps = {
    options: statusOptions,
    defaultValue:
      statusOptions.find((option) => !option.isDisabled)?.name || "",
    onChangeValue: handleDropdownChange,
    isOpen: isOpen,
    setIsOpen: setIsOpen,
  };

  const tryPenaltyItemGet = async () => {
    try {
      const { data } = await axiosMyItems();
      const penaltyTypes = data.penaltyItems.map(
        (item: IStoreItem) => item.itemSku
      );
      setStatusOptions((prevOptions) =>
        prevOptions.map((option) => ({
          ...option,
          isDisabled: !penaltyTypes.includes(option.value),
        }))
      );
      if (data.penaltyItems.length == 0) {
        setShowResponseModal(true);
        setHasErrorOnResponse(true);
        setModalTitle("페널티 감면권이 없습니다");
        setModalContent("페널티 감면권은 까비상점에서 구매하실 수 있습니다.");
        setUrlTitle("까비상점으로 이동");
        setUrl("/store");
      } else {
        setIsPenaltyItem(true);
      }
    } catch (error) {
      throw error;
    }
  };

  const tryPenaltyItemUse = async (sku: string) => {
    try {
      await axiosUseItem(sku, null, null, null, null);
      const { data: myInfo } = await axiosMyInfo();
      setMyInfo(myInfo);
      setModalTitle("페널티 감면권 사용 완료");
      if (myInfo.unbannedAt === null) {
        setModalContent("남은 페널티 기간이 모두 소멸되었습니다");
      } else {
        const unbannedAtDate = new Date(myInfo.unbannedAt);
        setModalContent(
          `해제 날짜 : <strong> ${formatDate(
            unbannedAtDate,
            ".",
            4,
            2,
            2
          )} ${formatDateTime(unbannedAtDate, ":")}</strong> `
        );
      }
    } catch (error) {
      throw error;
    }
  };

  const HandlePenaltyItemUse = async (sku: string) => {
    setIsLoading(true);
    try {
      await tryPenaltyItemUse(sku);
    } catch (error: any) {
      setModalTitle(error.response);
      setHasErrorOnResponse(true);
    } finally {
      setIsLoading(false);
      setShowResponseModal(true);
    }
  };

  const modalContents: IModalContents = {
    type: "hasProceedBtn",
    iconType: "CHECK",
    iconScaleEffect: false,
    title: "페널티 감면권 사용 안내",
    proceedBtnText: "사용하기",
    cancelBtnText: "취소",
    closeModal: onClose,
    isLoading: isLoading,
    // urlTitle: isPenaltyItem ? null : "까비상점으로 이동",
    // url: isPenaltyItem ? null : "store",
    onClickProceed: async () => {
      HandlePenaltyItemUse(selectedOption);
    },
    renderAdditionalComponent: () => (
      <>
        <ModalContainerStyled>
          <ModalDropdownNameStyled>페널티권 타입</ModalDropdownNameStyled>
          <Dropdown {...STATUS_DROP_DOWN_PROPS} />
        </ModalContainerStyled>
        <ModalDetailStyled>
          <ModalDetailContentStyled>
            현재 남아있는 페널티 기간은 <br />
            <strong>
              {remainPenaltyPeriod && remainPenaltyPeriod.days}일{" "}
              {remainPenaltyPeriod && remainPenaltyPeriod.hours}시간{" "}
              {remainPenaltyPeriod && remainPenaltyPeriod.minutes}분{" "}
            </strong>{" "}
            입니다. <br />
            선택한 페널티 감면권에 해당하는 일수만큼 <br />
            페널티가 감소합니다. <br />
            페널티 감면권 사용은 취소할수 없습니다.
          </ModalDetailContentStyled>
        </ModalDetailStyled>
      </>
    ),
  };

  return (
    <ModalPortal>
      {isPenaltyItem && !showResponseModal && (
        <Modal modalContents={modalContents} />
      )}
      {showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal
            modalTitle={modalTitle}
            modalContents={modalContent}
            urlTitle={urlTitle}
            url={url}
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
const ModalDetailStyled = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 30px;
  & > p {
    margin: 10px;
    & > span {
      font-weight: 600;
    }
  }
`;

const ModalDetailContentStyled = styled.div`
  line-height: 1.5;
  font-size: 0.8rem;
`;

export default PenaltyModal;
