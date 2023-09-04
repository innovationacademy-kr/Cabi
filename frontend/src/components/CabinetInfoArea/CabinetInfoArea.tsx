import React from "react";
import { useState } from "react";
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
import alertImg from "@/assets/images/cautionSign.svg";
import cabiLogo from "@/assets/images/logo.svg";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import CancelModal from "../Modals/CancelModal/CancelModal";
import ExtendModal from "../Modals/ExtendModal/ExtendModal";
import InvitationCodeModalContainer from "../Modals/InvitationCodeModal/InvitationCodeModal.container";
import CountTimeContainer from "./CountTime/CountTime.container";

const CabinetInfoArea: React.FC<{
  selectedCabinetInfo: ISelectedCabinetInfo | null;
  closeCabinet: () => void;
  expireDate: string | null;
  isMine: boolean;
  isAvailable: boolean;
  isExtensible: boolean;
  userModal: ICurrentModalStateInfo;
  openModal: (modalName: TModalState) => void;
  closeModal: (modalName: TModalState) => void;
  previousUserName: string | null;
}> = ({
  selectedCabinetInfo,
  closeCabinet,
  expireDate,
  isMine,
  isAvailable,
  isExtensible,
  userModal,
  openModal,
  closeModal,
  previousUserName,
}) => {
  const [showPreviousUser, setShowPreviousUser] = useState(false);

  const handleLinkTextClick = () => {
    setShowPreviousUser(!showPreviousUser);
  };
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
        {selectedCabinetInfo!.floor !== 0
          ? selectedCabinetInfo!.floor + "F - " + selectedCabinetInfo!.section
          : "-"}
      </TextStyled>
      <CabinetRectangleStyled
        cabinetStatus={selectedCabinetInfo!.status}
        isMine={isMine}
      >
        {selectedCabinetInfo!.visibleNum !== 0
          ? selectedCabinetInfo!.visibleNum
          : "-"}
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
              <LinkTextStyled onClick={handleLinkTextClick}>
                {showPreviousUser ? (
                  previousUserName
                ) : (
                  <>
                    <ImageStyled
                      src="/src/assets/images/happyCcabi.png"
                      alt=""
                    />
                    <HoverTextStyled>
                      이전 <br />
                      대여자
                    </HoverTextStyled>
                  </>
                )}
              </LinkTextStyled>
            </>
          )
        ) : (
          <>
            {selectedCabinetInfo!.cabinetId !== 0 && (
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
                    !isAvailable || selectedCabinetInfo.lentType === "CLUB"
                  }
                />
                <ButtonContainer
                  onClick={closeCabinet}
                  text="닫기"
                  theme="line"
                />
              </>
            )}
            {selectedCabinetInfo!.cabinetId === 0 &&
            selectedCabinetInfo!.lentType === "PRIVATE" ? (
              <>
                <ButtonContainer
                  onClick={() => {
                    openModal("extendModal");
                  }}
                  text={isExtensible ? "연장권 보유중" : "연장권 미보유"}
                  theme={isExtensible ? "line" : "grayLine"}
                  iconSrc={
                    isExtensible
                      ? "/src/assets/images/extensionTicket.svg"
                      : "/src/assets/images/extensionTicketGray.svg"
                  }
                  iconAlt="연장권 아이콘"
                  disabled={!isExtensible}
                />
                <ButtonContainer
                  onClick={closeCabinet}
                  text="닫기"
                  theme="line"
                />
              </>
            ) : null}
            {selectedCabinetInfo.status == "IN_SESSION" && (
              <CountTimeContainer isMine={false} />
            )}
            {selectedCabinetInfo.status == "PENDING" && (
              <PendingMessageStyled>매일 13:00 오픈됩니다</PendingMessageStyled>
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
        {selectedCabinetInfo!.cabinetId === 0 ? "" : expireDate}
      </CabinetLentDateInfoStyled>
      <CabinetInfoButtonsContainerStyled>
        {isMine &&
          isExtensible &&
          selectedCabinetInfo.status !== "IN_SESSION" && (
            <ButtonContainer
              onClick={() => {
                openModal("extendModal");
              }}
              text={"연장권 사용하기"}
              theme="line"
              iconSrc="/src/assets/images/extensionTicket.svg"
              iconAlt="연장권 아이콘"
              disabled={
                selectedCabinetInfo.lentsLength <= 1 &&
                selectedCabinetInfo.lentType === "SHARE"
              }
            />
          )}
        {isMine &&
          selectedCabinetInfo.lentsLength <= 1 &&
          selectedCabinetInfo.lentType === "SHARE" &&
          selectedCabinetInfo.status !== "IN_SESSION" && (
            <HoverBox
              canUseExtendTicket={
                isMine &&
                selectedCabinetInfo.lentsLength <= 1 &&
                selectedCabinetInfo.lentType === "SHARE"
              }
            >
              <AlertImgStyled src={alertImg} />
              공유사물함을 단독으로 이용 시, <br />
              연장권을 사용할 수 없습니다.
            </HoverBox>
          )}
      </CabinetInfoButtonsContainerStyled>
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
      {userModal.extendModal && (
        <ExtendModal
          onClose={() => closeModal("extendModal")}
          cabinetId={selectedCabinetInfo?.cabinetId}
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

const LinkTextStyled = styled.div`
  position: absolute;
  bottom: 3%;
  right: 7%;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 0.875rem;
  color: var(--gray-color);
  :hover {
    cursor: pointer;
  }
`;

const HoverTextStyled = styled.div`
  width: 50px;
  display: none;
  position: absolute;
  bottom: 35px;
  right: -10px;
  color: var(--gray-color);
  text-align: center;
  line-height: 1.2;
`;

const ImageStyled = styled.img`
  width: 30px;
  height: 30px;

  &:hover + ${HoverTextStyled} {
    display: block;
  }
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
  background-color: ${({ cabinetStatus, isMine }) =>
    isMine && cabinetStatus !== "IN_SESSION"
      ? "var(--mine)"
      : cabinetStatusColorMap[cabinetStatus]};

  ${({ cabinetStatus, isMine }) =>
    cabinetStatus === "IN_SESSION" &&
    css`
      animation: ${isMine ? Animation2 : Animation} 2.5s infinite;
    `}

  font-size: 32px;
  color: ${(props) =>
    props.isMine
      ? cabinetLabelColorMap["MINE"]
      : cabinetLabelColorMap[props.cabinetStatus]};
  text-align: center;
  ${({ cabinetStatus }) =>
    cabinetStatus === "PENDING" &&
    css`
      border: 2px solid var(--main-color);
    `}
`;

const Animation = keyframes`
  0%, 100% {
    background-color: var(--main-color);
  }
  50% {
    background-color: #d6c5fa;
  }
`;

const Animation2 = keyframes`
  0%, 100% {
    background-color: var(--mine);
  }
  50% {
    background-color: #eeeeee;
  }
`;

export const DetailStyled = styled.p`
  margin-top: 20px;
  letter-spacing: -0.02rem;
  line-height: 1.5rem;
  font-size: 14px;
  font-weight: 300;
  white-space: break-spaces;
`;

const ButtonWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ButtonContainerStyled = styled.button`
  max-width: 400px;
  width: 110%;
  height: 80px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-bottom: 15px;
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  &:last-child {
    margin-bottom: 0;
  }
  background: var(--white);
  color: var(--main-color);
  border: 1px solid var(--main-color);
  @media (max-height: 745px) {
    margin-bottom: 8px;
  }
`;

const HoverBox = styled.div<{
  canUseExtendTicket?: boolean;
}>`
  position: absolute;
  top: 50%;
  width: 270px;
  height: 80px;
  padding: 10px;
  background-color: rgba(73, 73, 73, 0.99);
  border-radius: 10px;
  box-shadow: 4px 4px 20px 0px rgba(0, 0, 0, 0.5);
  font-size: 14px;
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  opacity: ${(props) => (props.canUseExtendTicket ? "0" : "1")};
`;

const AlertImgStyled = styled.img`
  width: 20px;
  height: 20px;
  filter: invert(99%) sepia(100%) saturate(3%) hue-rotate(32deg)
    brightness(104%) contrast(100%);
`;

const CabinetInfoButtonsContainerStyled = styled.div<{
  canUseExtendTicket?: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  max-height: 320px;
  margin: 3vh 0;
  width: 100%;
  &:hover ${HoverBox} {
    opacity: ${(props) => (props.canUseExtendTicket ? "0" : "1")};
  }
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

const PendingMessageStyled = styled.p`
  font-size: 1rem;
  margin-top: 8px;
  text-align: center;
  font-weight: 700;
  line-height: 26px;
`;

export default CabinetInfoArea;
