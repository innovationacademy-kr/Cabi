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
}

const CabinetInfoArea: React.FC<{
  selectedCabinetInfo: ISelectedCabinetInfo | null;
  myCabinetId?: number;
  closeCabinet: () => void;
}> = (props) => {
  const { selectedCabinetInfo, myCabinetId, closeCabinet } = props;
  const [showUnavailableModal, setShowUnavailableModal] =
    useState<boolean>(false);
  const [showLentModal, setShowLentModal] = useState<boolean>(false);
  const [showReturnModal, setShowReturnModal] = useState<boolean>(false);
  const [showMemoModal, setShowMemoModal] = useState<boolean>(false);
  const isMine: boolean = myCabinetId
    ? selectedCabinetInfo?.cabinetId === myCabinetId
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

  if (selectedCabinetInfo === null)
    return (
      <NotSelectedStyled>
        <CabiLogoStyled src={cabiLogo} />
        <TextStyled fontSize="1.125rem" fontColor="var(--gray-color)">
          사물함을 <br />
          선택해주세요
        </TextStyled>
      </NotSelectedStyled>
    );
  return (
    <CabinetDetailAreaStyled>
      <TextStyled fontSize="1rem" fontColor="var(--gray-color)">
        {selectedCabinetInfo.floor + "F - " + selectedCabinetInfo.section}
      </TextStyled>
      <CabinetRectangleStyled
        cabinetStatus={selectedCabinetInfo.status}
        isMine={isMine}
      >
        {selectedCabinetInfo.cabinetNum}
      </CabinetRectangleStyled>
      <CabinetTypeIconStyled
        title={selectedCabinetInfo.lentType}
        cabinetType={selectedCabinetInfo.lentType}
      />
      <TextStyled fontSize="1rem" fontColor="black">
        {selectedCabinetInfo.userNameList}
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
            />
            <ButtonContainer onClick={closeCabinet} text="취소" theme="line" />
          </>
        )}
      </CabinetInfoButtonsContainerStyled>
      <CabinetLentDateInfoStyled
        textColor={selectedCabinetInfo.detailMessageColor}
      >
        {selectedCabinetInfo.detailMessage}
      </CabinetLentDateInfoStyled>
      <CabinetLentDateInfoStyled textColor="var(--black)">
        {selectedCabinetInfo.expireDate
          ? `${selectedCabinetInfo.expireDate.toString().substring(0, 10)}`
          : null}
      </CabinetLentDateInfoStyled>
      {showUnavailableModal && (
        <UnavailableModal
          status={additionalModalType.MODAL_UNAVAILABLE_ALREADY_LENT}
          closeModal={handleCloseUnavailableModal}
        />
      )}
      {showLentModal && (
        <LentModal
          lentType={selectedCabinetInfo.lentType}
          closeModal={handleCloseLentModal}
        />
      )}
      {showReturnModal && (
        <ReturnModal
          lentType={selectedCabinetInfo.lentType}
          closeModal={handleCloseReturnModal}
        />
      )}
      {showMemoModal && <MemoModalContainer onClose={handleCloseMemoModal} />}
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
  margin-bottom: 10px;
  background-image: url(${(props) => cabinetIconSrcMap[props.cabinetType]});
  background-size: contain;
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
  border-radius: 10px;
  margin-top: 15px;
  margin-bottom: 60px;
  background-color: ${(props) => cabinetStatusColorMap[props.cabinetStatus]};
  ${(props) =>
    props.isMine &&
    css`
      background-color: var(--mine);
    `};
  font-size: 32px;
  line-height: 80px;
  color: ${(props) =>
    props.isMine
      ? cabinetLabelColorMap["MINE"]
      : cabinetLabelColorMap[props.cabinetStatus]};
  text-align: center;
`;

const CabinetInfoButtonsContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 40px 0;
`;

const CabinetLentDateInfoStyled = styled.div<{ textColor: string }>`
  color: ${(props) => props.textColor};
  font-size: 1rem;
  font-weight: 700;
  line-height: 28px;
  white-space: pre-line;
  text-align: center;
`;
