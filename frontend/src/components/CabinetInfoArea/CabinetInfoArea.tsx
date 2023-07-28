import React, { useState } from "react";
import styled, { css } from "styled-components";
import ButtonContainer from "@/components/Common/Button";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import cabiLogo from "@/assets/images/logo.svg";
import MemoModalContainer from "@/components/Modals/MemoModal/MemoModal.container";
import LentModal from "@/components/Modals/LentModal/LentModal";
import ReturnModal from "@/components/Modals/ReturnModal/ReturnModal";
import UnavailableModal from "@/components/Modals/UnavailableModal/UnavailableModal";
import {
  additionalModalType,
  cabinetIconSrcMap,
  cabinetLabelColorMap,
  cabinetStatusColorMap,
} from "@/assets/data/maps";
import PasswordCheckModalContainer from "../Modals/PasswordCheckModal/PasswordCheckModal.container";

export interface ISelectedCabinetInfo {
  floor: number;
  section: string;
  cabinetId: number;
  cabinetNum: number;
  status: CabinetStatus;
  lentType: CabinetType;
  userNameList: string;
  expireDate?: Date;
  detailMessage: string | null;
  detailMessageColor: string;
  isAdmin: boolean;
  isLented: boolean;
}

const setExprieDate = (date: Date | undefined) => {
  if (!date) return null;
  if (date.toString().slice(0, 4) === "9999") return null;
  return date.toString().slice(0, 10);
};

const CabinetInfoArea: React.FC<{
  selectedCabinetInfo: ISelectedCabinetInfo | null;
  myCabinetId?: number;
  closeCabinet: () => void;
<<<<<<< HEAD
}> = ({ selectedCabinetInfo, myCabinetId, closeCabinet }) => {
  const [showUnavailableModal, setShowUnavailableModal] =
    useState<boolean>(false);
  const [showLentModal, setShowLentModal] = useState<boolean>(false);
  const [showReturnModal, setShowReturnModal] = useState<boolean>(false);
  const [showMemoModal, setShowMemoModal] = useState<boolean>(false);
  const [showPasswordCheckModal, setPasswordCheckModal] =
    useState<boolean>(false);
  const isMine: boolean = myCabinetId
    ? selectedCabinetInfo?.cabinetId === myCabinetId
    : false;
  const isAvailable: boolean =
    selectedCabinetInfo?.status === "AVAILABLE" ||
    selectedCabinetInfo?.status === "SET_EXPIRE_AVAILABLE"
      ? true
      : false;

  const handleOpenLentModal = () => {
    if (myCabinetId) return handleOpenUnavailableModal();
    setShowLentModal(true);
  };
  const handleCloseLentModal = () => {
    setShowLentModal(false);
  };
  const handleOpenReturnModal = () => {
    setShowReturnModal(true);
  };
  const handleCloseReturnModal = () => {
    setShowReturnModal(false);
  };
  const handleOpenMemoModal = () => {
    setShowMemoModal(true);
  };
  const handleCloseMemoModal = () => {
    setShowMemoModal(false);
  };
  const handleOpenUnavailableModal = () => {
    setShowUnavailableModal(true);
  };
  const handleCloseUnavailableModal = () => {
    setShowUnavailableModal(false);
  };
  const handleOpenPasswordCheckModal = () => {
    setPasswordCheckModal(true);
  };
  const handleClosePasswordCheckModal = () => {
    setPasswordCheckModal(false);
  };

  if (!selectedCabinetInfo)
    //아무 사물함도 선택하지 않았을 때
    return (
      <NotSelectedStyled>
        <CabiLogoStyled src={cabiLogo} />
        <TextStyled fontSize="1.125rem" fontColor="var(--gray-color)">
          사물함를 <br />
          선택해주세요
        </TextStyled>
      </NotSelectedStyled>
    );
  // 단일 선택 시 보이는 cabinetInfoArea
  return (
=======
  expireDate: string | null;
  isMine: boolean;
  isAvailable: boolean;
  userModal: ICurrentModalStateInfo;
  openModal: (modalName: TModalState) => void;
  closeModal: (modalName: TModalState) => void;
}> = ({
  selectedCabinetInfo,
  closeCabinet,
  expireDate,
  isMine,
  isAvailable,
  userModal,
  openModal,
  closeModal,
}) => {
  return selectedCabinetInfo === null ? (
    <NotSelectedStyled>
      <CabiLogoStyled src={cabiLogo} />
      <TextStyled fontSize="1.125rem" fontColor="var(--gray-color)">
        사물함을 <br />
        선택해주세요
      </TextStyled>
    </NotSelectedStyled>
  ) : (
>>>>>>> 1865ccbb74964647ca235340bffa349351f3b906
    <CabinetDetailAreaStyled>
      <TextStyled fontSize="1rem" fontColor="var(--gray-color)">
        {selectedCabinetInfo!.floor + "F - " + selectedCabinetInfo!.section}
      </TextStyled>
      <CabinetRectangleStyled
        cabinetStatus={selectedCabinetInfo!.status}
        isMine={isMine}
      >
        {selectedCabinetInfo!.cabinetNum}
      </CabinetRectangleStyled>
      <CabinetTypeIconStyled
        title={selectedCabinetInfo!.lentType}
        cabinetType={selectedCabinetInfo!.lentType}
      />
      <TextStyled fontSize="1rem" fontColor="black">
        {selectedCabinetInfo!.userNameList}
      </TextStyled>
      <CabinetInfoButtonsContainerStyled>
        {isMine ? (
          <>
            <ButtonContainer
              onClick={handleOpenReturnModal}
              text="반납"
              theme="fill"
            />
            <ButtonContainer
              onClick={handleOpenMemoModal}
              text="메모관리"
              theme="line"
            />
            <ButtonContainer
              onClick={closeCabinet}
              text="닫기"
              theme="grayLine"
            />
          </>
        ) : (
          <>
            <ButtonContainer
              onClick={handleOpenLentModal}
              text="대여"
              theme="fill"
              disabled={isAvailable ? false : true}
            />
            <ButtonContainer onClick={closeCabinet} text="취소" theme="line" />
          </>
        )}
      </CabinetInfoButtonsContainerStyled>
      <CabinetLentDateInfoStyled
        textColor={selectedCabinetInfo!.detailMessageColor}
      >
        {selectedCabinetInfo!.detailMessage}
      </CabinetLentDateInfoStyled>
      <CabinetLentDateInfoStyled textColor="var(--black)">
        {setExprieDate(selectedCabinetInfo!.expireDate)}
      </CabinetLentDateInfoStyled>
      {showUnavailableModal && (
        <UnavailableModal
          status={additionalModalType.MODAL_UNAVAILABLE_ALREADY_LENT}
          closeModal={handleCloseUnavailableModal}
        />
      )}
      {showLentModal && (
        <LentModal
          lentType={selectedCabinetInfo!.lentType}
          closeModal={handleCloseLentModal}
        />
      )}
      {showReturnModal && (
        <ReturnModal
          lentType={selectedCabinetInfo!.lentType}
          handleOpenPasswordCheckModal={handleOpenPasswordCheckModal}
          closeModal={handleCloseReturnModal}
        />
      )}
      {showMemoModal && <MemoModalContainer onClose={handleCloseMemoModal} />}
      {showPasswordCheckModal && (
        <PasswordCheckModalContainer onClose={handleClosePasswordCheckModal} />
      )}
    </CabinetDetailAreaStyled>
  );
};

export default CabinetInfoArea;

const NotSelectedStyled = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CabinetDetailAreaStyled = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const CabiLogoStyled = styled.img`
  width: 35px;
  height: 35px;
  margin-bottom: 10px;
`;

const CabinetTypeIconStyled = styled.div<{ cabinetType: CabinetType }>`
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  margin-bottom: 10px;
  background-image: url(${(props) => cabinetIconSrcMap[props.cabinetType]});
  background-size: contain;
  background-repeat: no-repeat;
`;

const TextStyled = styled.p<{ fontSize: string; fontColor: string }>`
  font-size: ${(props) => props.fontSize};
  font-weight: 400;
  line-height: 28px;
  color: ${(props) => props.fontColor};
  text-align: center;
  white-space: pre-line;
`;

const CabinetRectangleStyled = styled.div<{
  cabinetStatus: CabinetStatus;
  isMine: boolean;
}>`
  width: 80px;
  height: 80px;
  line-height: 80px;
  border-radius: 10px;
  margin-top: 15px;
  margin-bottom: 3vh;
  background-color: ${(props) => cabinetStatusColorMap[props.cabinetStatus]};
  ${(props) =>
    props.isMine &&
    css`
      background-color: var(--mine);
    `};
  font-size: 32px;
  color: ${(props) =>
    props.isMine
      ? cabinetLabelColorMap["MINE"]
      : cabinetLabelColorMap[props.cabinetStatus]};
  text-align: center;
`;

const CabinetInfoButtonsContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  max-height: 210px;
  margin: 3vh 0;
  width: 100%;
`;

const CabinetLentDateInfoStyled = styled.div<{ textColor: string }>`
  color: ${(props) => props.textColor};
  font-size: 1rem;
  font-weight: 700;
  line-height: 28px;
  white-space: pre-line;
  text-align: center;
`;

const MultiCabinetIconWrapperStyled = styled.div`
  display: grid;
  grid-template-columns: 40px 40px;
  width: 90px;
  height: 90px;
  margin-top: 15px;
  grid-gap: 10px;
`;

const MultiCabinetIconStyled = styled.div<{ status: CabinetStatus }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ status }) => cabinetStatusColorMap[status]};
  border-radius: 5px;
  color: ${({ status }) =>
    status === CabinetStatus.SET_EXPIRE_FULL ? "black" : "white"};
`;
