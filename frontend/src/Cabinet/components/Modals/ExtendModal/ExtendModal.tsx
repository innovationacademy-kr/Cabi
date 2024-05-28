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
import Dropdown from "@/Cabinet/components/Common/Dropdown";
import Modal, { IModalContents } from "@/Cabinet/components/Modals/Modal";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/Cabinet/components/Modals/ResponseModal/ResponseModal";
import { IInventoryInfo } from "@/Cabinet/components/Store/Inventory/Inventory";
import { additionalModalType, modalPropsMap } from "@/Cabinet/assets/data/maps";
import { MyCabinetInfoResponseDto } from "@/Cabinet/types/dto/cabinet.dto";
import IconType from "@/Cabinet/types/enum/icon.type.enum";
import {
  axiosCabinetById,
  axiosMyItems,
  axiosMyLentInfo,
  axiosUseItem,
} from "@/Cabinet/api/axios/axios.custom";
import { getExtendedDateString } from "@/Cabinet/utils/dateUtils";

const extensionPeriod = [
  { sku: "EXTENSION_3", period: "3일", day: 3 },
  { sku: "EXTENSION_15", period: "15일", day: 15 },
  { sku: "EXTENSION_31", period: "31일", day: 31 },
];

const ExtendModal: React.FC<{
  onClose: () => void;
  cabinetId: Number;
}> = (props) => {
  const [showExtension, setShowExtension] = useState<boolean>(true);
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContents, setModalContents] = useState<string | null>(null);
  const [extensionDate, setExtensionDate] = useState<number>(3);
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
    // myInfo.lentExtensionResponseDto?.extensionPeriod
    extensionDate
    //내가 선택한 옵션의 연장 기간을 number 로 넘겨주기
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

  const extensionItemUse = async (item: string) => {
    // 아이템 사용
    if (currentCabinetId === 0 || myInfo.cabinetId === null) {
      setHasErrorOnResponse(true);
      setModalTitle("현재 대여중인 사물함이 없습니다.");
      setShowResponseModal(true);
      return;
    }
    try {
      await axiosUseItem(item, null, null, null, null);
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
      try {
        const { data } = await axiosCabinetById(currentCabinetId);
        setTargetCabinetInfo(data);
      } catch (error) {
        throw error;
      }
      try {
        const { data: myLentInfo } = await axiosMyLentInfo();
        setMyLentInfo(myLentInfo);
      } catch (error) {
        throw error;
      }
    } catch (error: any) {
      setHasErrorOnResponse(true);
      if (error.response.status === 400) {
        setModalTitle("연장권 사용실패");
        setModalContents(
          `현재 연장권을 보유하고 있지 않습니다.
  연장권은 까비 상점에서 구매하실 수 있습니다.`
        );
      } else
        error.response
          ? setModalTitle(error.response.data.message)
          : setModalTitle(error.data.message);
    } finally {
      setShowResponseModal(true);
    }
  };

  const [myItems, setMyItems] = useState<IInventoryInfo | null>(null);

  const getMyItems = async () => {
    try {
      const response = await axiosMyItems();
      setMyItems(response.data);
    } catch (error: any) {
      console.error("Error getting inventory:", error);
    }
  };

  useEffect(() => {
    getMyItems();
  }, []);

  useEffect(() => {
    if (checkExtension() == true) {
      setShowExtension(true);
      setModalContents(
        `현재 연장권을 보유하고 있지 않습니다.
연장권은 까비 상점에서 구매하실 수 있습니다.`
      );
    } else setShowExtension(false);
    setExtensionDate(
      findMyExtension(extensionPeriod[0].period)
        ? findMyExtension(extensionPeriod[1].period)
          ? 31
          : 15
        : 3
    );
  }, [myItems]);

  const findMyExtension = (period: string) => {
    return !myItems?.extensionItems.some((item) => item.itemDetails === period);
  };

  const checkExtension = () => {
    return (
      findMyExtension("3일") &&
      findMyExtension("15일") &&
      findMyExtension("31일")
    );
  };

  const [selectedOption, setSelectedOption] = useState(0);

  const handleDropdownChange = (option: number) => {
    setSelectedOption(option);
    setExtensionDate(extensionPeriod[option].day);
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
            extensionItemUse(extensionPeriod[selectedOption].sku);
          },
    closeModal: props.onClose,
    iconType: IconType.CHECKICON,
    renderAdditionalComponent: () => (
      <>
        <ModalContainerStyled>
          <ModalDropdownNameStyled>연장권 타입</ModalDropdownNameStyled>
          <Dropdown
            options={[
              {
                name: extensionPeriod[0].period,
                value: 0,
                disabled: findMyExtension(extensionPeriod[0].period),
              },
              {
                name: extensionPeriod[1].period,
                value: 1,
                disabled: findMyExtension(extensionPeriod[1].period),
              },
              {
                name: extensionPeriod[2].period,
                value: 2,
                disabled: findMyExtension(extensionPeriod[2].period),
              },
            ]}
            defaultValue={
              findMyExtension(extensionPeriod[0].period)
                ? findMyExtension(extensionPeriod[1].period)
                  ? extensionPeriod[2].period
                  : extensionPeriod[1].period
                : extensionPeriod[0].period
            }
            onChangeValue={handleDropdownChange}
          />
        </ModalContainerStyled>

        <ModalDetailStyled></ModalDetailStyled>
      </>
    ),
  };

  return (
    <ModalPortal>
      {showExtension && (
        <FailResponseModal
          modalTitle={modalTitle}
          modalContents={modalContents}
          closeModal={props.onClose}
          url={"/store"}
          urlTitle={"까비상점으로 이동"}
        />
      )}
      {!showExtension && !showResponseModal && (
        <Modal modalContents={extendModalContents} />
      )}
      {!showExtension &&
        showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal
            modalTitle={modalTitle}
            modalContents={modalContents}
            closeModal={props.onClose}
            url={"/store"}
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
