import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import {
  currentCabinetIdState,
  isCurrentSectionRenderState,
  myCabinetInfoState,
  targetCabinetInfoState,
  userState,
} from "@/Cabinet/recoil/atoms";
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
import { IInventoryInfo } from "@/Cabinet/components/Store/Inventory/Inventory";
import { additionalModalType, modalPropsMap } from "@/Cabinet/assets/data/maps";
import { MyCabinetInfoResponseDto } from "@/Cabinet/types/dto/cabinet.dto";
import { IItemDetail, IItemStore } from "@/Cabinet/types/dto/store.dto";
import CabinetStatus from "@/Cabinet/types/enum/cabinet.status.enum";
import IconType from "@/Cabinet/types/enum/icon.type.enum";
import {
  axiosCabinetById,
  axiosItems,
  axiosMyItems,
  axiosMyLentInfo,
  axiosUseItem,
} from "@/Cabinet/api/axios/axios.custom";
import { getExtendedDateString } from "@/Cabinet/utils/dateUtils";

const ExtendModal: React.FC<{
  onClose: () => void;
  cabinetId: Number;
}> = (props) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContents, setModalContents] = useState<string | null>(null);
  const [extensionDate, setExtensionDate] = useState<number>(3);
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<IItemDetail[]>([]);
  const [myItems, setMyItems] = useState<IInventoryInfo | null>(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [myExtensionItems, setMyExtensionItems] = useState<IItemStore[]>([]);
  const [itemDropdownOptions, setItemDropdownOptions] = useState<
    IDropdownOptions[]
  >([]);
  const [url, setUrl] = useState<string | null>(null);
  const [currentCabinetId] = useRecoilState(currentCabinetIdState);
  const [myInfo, setMyInfo] = useRecoilState(userState);
  const [myLentInfo, setMyLentInfo] =
    useRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const setTargetCabinetInfo = useSetRecoilState(targetCabinetInfoState);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );

  const formattedExtendedDate = getExtendedDateString(
    myLentInfo.lents[0].expiredAt,
    extensionDate
  );
  const extensionExpiredDate = getExtendedDateString(
    myInfo.lentExtensionResponseDto?.expiredAt,
    0
  );

  const extendDetail = `사물함 연장권 사용 시,
  대여 기간이 <strong>${formattedExtendedDate} 23:59</strong>으로
  연장됩니다.
  연장권 사용은 취소할 수 없습니다.`;
  const extendInfoDetail = `사물함을 대여하시면 연장권 사용이 가능합니다.
연장권은 <strong>${extensionExpiredDate} 23:59</strong> 이후 만료됩니다.`;
  const noExtensionMsg = `현재 연장권을 보유하고 있지 않습니다.
연장권은 까비 상점에서 구매하실 수 있습니다.`;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (myItems?.extensionItems.length === 0) {
      setShowResponseModal(true);
      setHasErrorOnResponse(true);
      setModalContents(noExtensionMsg);
    } else {
      setShowResponseModal(false);
      setHasErrorOnResponse(false);
      setMyExtensionItems(myItems?.extensionItems.reverse() || []);
      setExtensionDate(
        getExtensionDate(myItems?.extensionItems[0].itemSku || "")
      );
      setSelectedOption(myItems?.extensionItems[0].itemSku || "");
    }
    if (items.length) {
      const sortedItems = sortItems(items);
      const dropdownOptions: IDropdownOptions[] = getItemDropDownOption(
        sortedItems[0]
      );

      const extensionPrevOption = {
        name: "출석 연장권 보상",
        value: "EXTENSION_PREV",
        isDisabled: findMyItem("EXTENSION_PREV"),
      };

      dropdownOptions.push(extensionPrevOption);

      setItemDropdownOptions(dropdownOptions);
    }
  }, [myItems]);

  const fetchData = async () => {
    try {
      const [itemsResponse, myItemsResponse] = await Promise.all([
        axiosItems(),
        axiosMyItems(),
      ]);
      setItems(itemsResponse.data.items);
      setMyItems(myItemsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const findMyItem = (period: string) => {
    return !myItems?.extensionItems.some((item) => item.itemSku === period);
  };

  const getItemDropDownOption = (curItem: IItemDetail): IDropdownOptions[] => {
    if (curItem) {
      return curItem.items.map((item) => ({
        name: item.itemDetails,
        value: item.itemSku,
        isDisabled: findMyItem(item.itemSku),
      }));
    }
    return [];
  };

  const getModalTitle = (cabinetId: number | null) => {
    return cabinetId === null
      ? modalPropsMap[additionalModalType.MODAL_OWN_EXTENSION].title
      : modalPropsMap[additionalModalType.MODAL_USE_EXTENSION].title;
  };

  const getModalDetail = (cabinetId: number | null) => {
    return cabinetId === null ? extendInfoDetail : extendDetail;
  };

  const getModalProceedBtnText = (cabinetId: number | null) => {
    return cabinetId === null
      ? modalPropsMap[additionalModalType.MODAL_OWN_EXTENSION].confirmMessage
      : modalPropsMap[additionalModalType.MODAL_USE_EXTENSION].confirmMessage;
  };

  const getExtensionDate = (option: string) => {
    if (option === "EXTENSION_3") return 3;
    if (option === "EXTENSION_15") return 15;
    if (option === "EXTENSION_31") return 31;
    if (option === "EXTENSION_PREV") return 31;
    else return 0;
  };

  const getDropdownDefaultOption = () => {
    if (myExtensionItems.length) {
      return myExtensionItems[0].itemDetails;
    }
    return "연장권이 없습니다.";
  };

  const handleDropdownChange = (option: string) => {
    setSelectedOption(option);
    setExtensionDate(getExtensionDate(option));
  };

  const extensionDropdownProps = {
    options: itemDropdownOptions,
    defaultValue: getDropdownDefaultOption(),
    onChangeValue: handleDropdownChange,
    isOpen: isOpen,
    setIsOpen: setIsOpen,
  };

  const extensionItemUse = async (item: string) => {
    if (currentCabinetId === 0 || myInfo.cabinetId === null) {
      setHasErrorOnResponse(true);
      setModalTitle("연장권 사용실패");
      setModalContents("현재 대여중인 사물함이 없습니다.");
      setShowResponseModal(true);
      return;
    }
    if (myLentInfo.status === CabinetStatus.OVERDUE) {
      setHasErrorOnResponse(true);
      setModalTitle("연장권 사용실패");
      setModalContents(`연체 중에는 연장권을 사용하실 수 없습니다.`);
      setShowResponseModal(true);
      return;
    }

    try {
      await axiosUseItem(item, null, null, null, null);
      const [cabinetData, myLentInfoData] = await Promise.all([
        axiosCabinetById(currentCabinetId),
        axiosMyLentInfo(),
      ]);

      setMyInfo({
        ...myInfo,
        cabinetId: currentCabinetId,
        lentExtensionResponseDto: null,
      });
      setIsCurrentSectionRender(true);
      setModalTitle("연장권 사용완료");
      setModalContents(
        `대여 기간이 <strong>${formattedExtendedDate}</strong>으로 연장되었습니다.`
      );
      setTargetCabinetInfo(cabinetData.data);
      setMyLentInfo(myLentInfoData.data);
    } catch (error: any) {
      setHasErrorOnResponse(true);
      if (error.response.status === 400) {
        setModalTitle("연장권 사용실패");
        setModalContents(noExtensionMsg);
        setUrl("/store");
      } else {
        setModalTitle(error.response?.data.message || error.data.message);
      }
    } finally {
      setShowResponseModal(true);
    }
  };

  const extendModalContents: IModalContents = {
    type: myInfo.cabinetId === null ? "penaltyBtn" : "hasProceedBtn",
    title: getModalTitle(myInfo.cabinetId),
    detail: getModalDetail(myInfo.cabinetId),
    proceedBtnText: getModalProceedBtnText(myInfo.cabinetId),
    onClickProceed:
      myInfo.cabinetId === null
        ? async (e: React.MouseEvent) => {
            props.onClose();
          }
        : async () => {
            extensionItemUse(selectedOption);
          },
    closeModal: props.onClose,
    iconType: IconType.CHECKICON,
    renderAdditionalComponent: () => (
      <>
        <ModalContainerStyled>
          <ModalDropdownNameStyled>연장권 타입</ModalDropdownNameStyled>
          <Dropdown {...extensionDropdownProps} />
        </ModalContainerStyled>
        <ModalDetailStyled></ModalDetailStyled>
      </>
    ),
  };

  return (
    <ModalPortal>
      {!showResponseModal && <Modal modalContents={extendModalContents} />}
      {showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal
            modalTitle={modalTitle}
            modalContents={modalContents}
            closeModal={props.onClose}
            url={url}
            urlTitle={"까비상점으로 이동"}
          />
        ) : (
          <SuccessResponseModal
            modalTitle={modalTitle}
            modalContents={modalContents}
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
  > p {
    margin: 10px;
    > span {
      font-weight: 600;
    }
  }
`;

export default ExtendModal;
