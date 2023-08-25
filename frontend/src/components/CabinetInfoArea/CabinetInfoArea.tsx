import React from "react";
import styled, { css, keyframes } from "styled-components";
import {
  ICurrentModalStateInfo,
  ISelectedCabinetInfo,
  TModalState,
} from "@/components/CabinetInfoArea/CabinetInfoArea.container";
import ButtonContainer from "@/components/Common/Button";
import LentModal from "@/components/Modals/LentModal/LentModal";
import MemoModalContainer from "@/components/Modals/MemoModal/MemoModal.container";
import PasswordCheckModalContainer from "@/components/Modals/PasswordCheckModal/PasswordCheckModal.container";
import ReturnModal from "@/components/Modals/ReturnModal/ReturnModal";
import UnavailableModal from "@/components/Modals/UnavailableModal/UnavailableModal";
import {
  additionalModalType,
  cabinetIconSrcMap,
  cabinetLabelColorMap,
  cabinetStatusColorMap,
} from "@/assets/data/maps";
import cabiLogo from "@/assets/images/logo.svg";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import CancelModal from "../Modals/CancelModal/CancelModal";
import InvitationCodeModalContainer from "../Modals/InvitationCodeModal/InvitationCodeModal.container";
import CountTimeContainer from "./CountTime/CountTime.container";

const CabinetInfoArea: React.FC<{
  selectedCabinetInfo: ISelectedCabinetInfo | null;
  closeCabinet: () => void;
  expireDate: string | null;
  isMine: boolean;
  isAvailable: boolean;
  userModal: ICurrentModalStateInfo;
  openModal: (modalName: TModalState) => void;
  closeModal: (modalName: TModalState) => void;
  wrongCodeCounts: { [cabinetId: number]: number };
  timeOver: boolean;
}> = ({
  selectedCabinetInfo,
  closeCabinet,
  expireDate,
  isMine,
  isAvailable,
  userModal,
  openModal,
  closeModal,
  wrongCodeCounts,
  timeOver,
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
    <CabinetDetailAreaStyled>
      <TextStyled fontSize="1rem" fontColor="var(--gray-color)">
        {selectedCabinetInfo!.floor + "F - " + selectedCabinetInfo!.section}
      </TextStyled>
      <CabinetRectangleStyled
        cabinetStatus={selectedCabinetInfo!.status}
        isMine={isMine}
      >
        {selectedCabinetInfo!.visibleNum}
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
          selectedCabinetInfo.status === "IN_SESSION" ? (
            <>
              <ButtonContainer
                onClick={() => {
                  openModal("cancelModal");
                }}
                text="대기열 취소"
                theme="fill"
                disabled={timeOver}
              />
              <ButtonContainer
                onClick={closeCabinet}
                text="닫기"
                theme="grayLine"
              />
              <CountTimeContainer isMine={true} />
            </>
          ) : (
            <>
              <ButtonContainer
                onClick={() => {
                  openModal("returnModal");
                }}
                text="반납"
                theme="fill"
              />
              <ButtonContainer
                onClick={() => openModal("memoModal")}
                text="메모관리"
                theme="line"
              />
              <ButtonContainer
                onClick={closeCabinet}
                text="닫기"
                theme="grayLine"
              />
            </>
          )
        ) : (
          <>
            <ButtonContainer
              onClick={() =>
                openModal(
                  selectedCabinetInfo.status == "IN_SESSION"
                    ? "invitationCodeModal"
                    : "lentModal"
                )
              }
              text="대여"
              theme="fill"
              disabled={
                !isAvailable ||
                selectedCabinetInfo.lentType === "CLUB" ||
                wrongCodeCounts[selectedCabinetInfo?.cabinetId] >= 3 ||
                (selectedCabinetInfo.status == "IN_SESSION" && timeOver)
              }
            />
            <ButtonContainer onClick={closeCabinet} text="닫기" theme="line" />
            {selectedCabinetInfo.status == "IN_SESSION" && (
              <CountTimeContainer isMine={false} />
            )}
            {wrongCodeCounts[selectedCabinetInfo?.cabinetId] >= 3 && (
              <WarningMessageStyled>
                초대 코드 입력 오류 초과로 <br />
                입장이 제한된 상태입니다.
              </WarningMessageStyled>
            )}
          </>
        )}
      </CabinetInfoButtonsContainerStyled>
      <CabinetLentDateInfoStyled
        textColor={selectedCabinetInfo!.detailMessageColor}
      >
        {selectedCabinetInfo!.detailMessage}
      </CabinetLentDateInfoStyled>
      <CabinetLentDateInfoStyled textColor="var(--black)">
        {expireDate}
      </CabinetLentDateInfoStyled>
      {userModal.unavailableModal && (
        <UnavailableModal
          status={additionalModalType.MODAL_UNAVAILABLE_ALREADY_LENT}
          closeModal={() => closeModal("unavailableModal")}
        />
      )}
      {userModal.lentModal && (
        <LentModal
          lentType={selectedCabinetInfo!.lentType}
          closeModal={() => closeModal("lentModal")}
        />
      )}
      {userModal.returnModal && (
        <ReturnModal
          lentType={selectedCabinetInfo!.lentType}
          handleOpenPasswordCheckModal={() => openModal("passwordCheckModal")}
          closeModal={() => closeModal("returnModal")}
        />
      )}
      {userModal.memoModal && (
        <MemoModalContainer onClose={() => closeModal("memoModal")} />
      )}
      {userModal.passwordCheckModal && (
        <PasswordCheckModalContainer
          onClose={() => closeModal("passwordCheckModal")}
        />
      )}
      {userModal.invitationCodeModal && (
        <InvitationCodeModalContainer
          onClose={() => closeModal("invitationCodeModal")}
          cabinetId={selectedCabinetInfo?.cabinetId}
        />
      )}
      {userModal.cancelModal && (
        <CancelModal
          lentType={selectedCabinetInfo!.lentType}
          closeModal={() => closeModal("cancelModal")}
        />
      )}
    </CabinetDetailAreaStyled>
  );
};

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
  ${({ cabinetStatus }) =>
    cabinetStatus === "PENDING" &&
    css`
      background: linear-gradient(135deg, #dac6f4ea, var(--main-color));
    `}
  ${({ cabinetStatus }) =>
    cabinetStatus === "IN_SESSION" &&
    css`
      border: 3px solid var(--main-color);
      animation: ${Animation} 3.5s infinite;
    `}
`;

const Animation = keyframes`
  0%, 100% {
    background-color: var(--main-color);
  }
  50% {
    background-color: #d9d9d9;
  }
`;

const CabinetInfoButtonsContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  max-height: 300px;
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

const WarningMessageStyled = styled.p`
  color: red;
  font-size: 1rem;
  margin-top: 8px;
  text-align: center;
  font-weight: 700;
  line-height: 26px;
`;

export default CabinetInfoArea;
