import React from "react";
import styled, { css } from "styled-components";
import {
  ICurrentModalStateInfo,
  ISelectedCabinetInfo,
  TModalState,
} from "@/Cabinet/components/CabinetInfoArea/CabinetInfoArea.container";
import CountTimeContainer from "@/Cabinet/components/CabinetInfoArea/CountTime/CountTime.container";
import ButtonContainer from "@/Cabinet/components/Common/Button";
import CancelModal from "@/Cabinet/components/Modals/CancelModal/CancelModal";
import ExtendModal from "@/Cabinet/components/Modals/ExtendModal/ExtendModal";
import InvitationCodeModalContainer from "@/Cabinet/components/Modals/InvitationCodeModal/InvitationCodeModal.container";
import LentModal from "@/Cabinet/components/Modals/LentModal/LentModal";
import MemoModalContainer from "@/Cabinet/components/Modals/MemoModal/MemoModal.container";
import PasswordCheckModalContainer from "@/Cabinet/components/Modals/PasswordCheckModal/PasswordCheckModal.container";
import ReturnModal from "@/Cabinet/components/Modals/ReturnModal/ReturnModal";
import SwapModal from "@/Cabinet/components/Modals/SwapModal/SwapModal";
import UnavailableModal from "@/Cabinet/components/Modals/UnavailableModal/UnavailableModal";
import {
  additionalModalType,
  cabinetIconComponentMap,
  cabinetLabelColorMap,
  cabinetStatusColorMap,
} from "@/Cabinet/assets/data/maps";
import alertImg from "@/Cabinet/assets/images/cautionSign.svg";
import { ReactComponent as ExtensionImg } from "@/Cabinet/assets/images/extensionTicket.svg";
import { ReactComponent as LogoImg } from "@/Cabinet/assets/images/logo.svg";
import CabinetStatus from "@/Cabinet/types/enum/cabinet.status.enum";

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
  isSwappable: boolean;
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
  isSwappable,
}) => {
  const isExtensionVisible =
    isMine &&
    isExtensible &&
    selectedCabinetInfo &&
    selectedCabinetInfo.status !== "IN_SESSION";
  const isHoverBoxVisible =
    selectedCabinetInfo &&
    selectedCabinetInfo.lentsLength <= 1 &&
    selectedCabinetInfo.lentType === "SHARE";
  const CabinetIcon = selectedCabinetInfo
    ? cabinetIconComponentMap[selectedCabinetInfo.lentType]
    : null;

  return selectedCabinetInfo === null ? (
    <NotSelectedStyled>
      <CabiLogoStyled>
        <LogoImg />
      </CabiLogoStyled>
      <TextStyled fontSize="1.125rem" fontColor="var(--shared-gray-color-500)">
        사물함을 <br />
        선택해주세요
      </TextStyled>
    </NotSelectedStyled>
  ) : (
    <CabinetDetailAreaStyled>
      <TextStyled fontSize="1rem" fontColor="var(--shared-gray-color-500)">
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
      <CabinetTypeIconStyled title={selectedCabinetInfo!.lentType}>
        {CabinetIcon && <CabinetIcon />}
      </CabinetTypeIconStyled>
      <TextStyled fontSize="1rem" fontColor="var(--normal-text-color)">
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
                text="사물함 설정"
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
            {selectedCabinetInfo!.cabinetId !== 0 && (
              <>
                <ButtonContainer
                  onClick={() =>
                    openModal(
                      selectedCabinetInfo.status == "IN_SESSION"
                        ? "invitationCodeModal"
                        : isSwappable
                        ? "swapModal"
                        : "lentModal"
                    )
                  }
                  text={isSwappable ? "이사하기" : "대여"}
                  theme="fill"
                  disabled={
                    selectedCabinetInfo.lentType === "CLUB" ||
                    (!isAvailable && !isSwappable)
                  }
                />
                <ButtonContainer
                  onClick={closeCabinet}
                  text="닫기"
                  theme="line"
                />
              </>
            )}
            {selectedCabinetInfo.status == "IN_SESSION" && (
              <CountTimeContainer isMine={false} />
            )}
            {selectedCabinetInfo.status == "PENDING" && (
              <AvailableMessageStyled>
                매일 13:00 오픈됩니다
              </AvailableMessageStyled>
            )}
          </>
        )}
      </CabinetInfoButtonsContainerStyled>
      <CabinetLentDateInfoStyled
        textColor={selectedCabinetInfo!.detailMessageColor}
      >
        {selectedCabinetInfo!.detailMessage}
      </CabinetLentDateInfoStyled>
      <CabinetLentDateInfoStyled textColor="var(--normal-text-color)">
        {selectedCabinetInfo!.cabinetId === 0 ? "" : expireDate}
      </CabinetLentDateInfoStyled>
      <ButtonHoverWrapper>
        <CabinetInfoButtonsContainerStyled>
          {isExtensionVisible && (
            <ButtonContainerStyled
              onClick={() => {
                openModal("extendModal");
              }}
              theme="line"
              disabled={
                selectedCabinetInfo.lentsLength <= 1 &&
                selectedCabinetInfo.lentType === "SHARE"
              }
            >
              <ExtensionImg
                stroke="var(--main-color)"
                width={24}
                height={24}
                style={{ marginRight: "10px" }}
              />
              {"연장권 사용하기"}
            </ButtonContainerStyled>
          )}
          {isExtensionVisible && isHoverBoxVisible && (
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
      </ButtonHoverWrapper>
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
      {userModal.swapModal && (
        <SwapModal
          lentType={selectedCabinetInfo!.lentType}
          closeModal={() => closeModal("swapModal")}
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
  max-width: 330px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const CabiLogoStyled = styled.div`
  width: 35px;
  height: 35px;
  margin-bottom: 10px;
  svg {
    .logo_svg__currentPath {
      fill: var(--main-color);
    }
  }
`;

const CabinetTypeIconStyled = styled.div`
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  margin-bottom: 10px;

  & path {
    stroke: var(--normal-text-color);
  }
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
    isMine ? "var(--mine-color)" : cabinetStatusColorMap[cabinetStatus]};

  font-size: 2rem;
  color: ${(props) =>
    props.isMine
      ? "var(--ref-black)"
      : cabinetLabelColorMap[props.cabinetStatus]};
  /* black */
  text-align: center;

  ${({ cabinetStatus }) =>
    cabinetStatus === "IN_SESSION" &&
    css`
      border: 2px solid var(--main-color);
    `}

  ${({ cabinetStatus }) =>
    cabinetStatus === "PENDING" &&
    css`
      border: 2px double var(--main-color);
      box-shadow: inset 0px 0px 0px 2px var(--bg-color);
    `}
`;

export const DetailStyled = styled.p`
  margin-top: 20px;
  letter-spacing: -0.02rem;
  line-height: 1.5rem;
  font-size: 0.875rem;
  font-weight: 300;
  white-space: break-spaces;
`;

const HoverBox = styled.div<{
  canUseExtendTicket?: boolean;
}>`
  position: absolute;
  opacity: 0;
  visibility: hidden;
  top: -120%;
  width: 270px;
  height: 80px;
  padding: 10px;
  background-color: rgba(73, 73, 73, 0.99);
  border-radius: 10px;
  box-shadow: 4px 4px 20px 0px var(--bg-shadow-color-300);
  font-size: 0.875rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  transition: opacity 0.3s ease;
  line-height: 1.2;
`;

const ButtonHoverWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  &:hover ${HoverBox} {
    opacity: 1;
    visibility: visible;
  }
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
  position: relative;
  align-items: center;
  max-height: 320px;
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

const AvailableMessageStyled = styled.p`
  font-size: 1rem;
  margin-top: 8px;
  text-align: center;
  font-weight: 700;
  line-height: 26px;
  color: var(--normal-text-color);
`;

const ButtonContainerStyled = styled.button`
  max-width: 240px;
  width: 100%;
  height: 60px;
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
  ${(props) =>
    props.theme === "line" &&
    css`
      background: var(--bg-color);
      color: var(--main-color);
      border: 1px solid var(--main-color);
    `}
  @media (max-height: 745px) {
    margin-bottom: 8px;
  }
`;

export default CabinetInfoArea;
