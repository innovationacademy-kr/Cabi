import React, { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import AdminClubLogContainer from "@/Cabinet/components/Club/AdminClubLog.container";
import Button from "@/Cabinet/components/Common/Button";
import { ReactComponent as CheckIcon } from "@/Cabinet/assets/images/checkIcon.svg";
import { ReactComponent as ErrorIcon } from "@/Cabinet/assets/images/errorIcon.svg";
import { ReactComponent as NotificationIcon } from "@/Cabinet/assets/images/notificationSign.svg";
import useMenu from "@/Cabinet/hooks/useMenu";
import useMultiSelect from "@/Cabinet/hooks/useMultiSelect";

/**
 * @interface
 * @description 모달 정보
 * @property {string} type : hasProceedBtn(모달 외부 클릭이나 취소 버튼으로 끔), noBtn(모달 내/외부 클릭으로 끔)
 * @property {string} icon : checkIcon, errorIcon import 해서 넘기거나 다른 아이콘 사용 가능
 * @property {boolean} iconScaleEffect : iconEffect 적용 여부
 * @property {string} title : 모달 제목
 * @property {string} detail : 모달 본문
 * @property {() => ReactElement} renderAdditionalComponent : 모달에 추가로 띄울 UI를 렌더해주는 함수
 * @property {string} proceedBtnText : 확인 버튼의 텍스트(기본값: 확인)
 * @property {((e: React.MouseEvent) => Promise<void>) | null} onClickProceed : 확인 버튼의 동작함수
 * @property {string} cancelBtnText : 취소 버튼의 텍스트(기본값: 취소)
 * @property {React.MouseEventHandler} closeModal : 모달 닫는 함수
 * @property {boolean} isClubLentModal : 동아리 (CLUB) 대여 모달인지 여부
 * @property {boolean} isLoading : 로딩중 요청 버튼 비활성화 감지를 위한 변수
 * @property {boolean} isCheckIcon : checkIcon인지 errorIcon인지 감지를 위한 변수
 * @property {string} urlTitle : 모달에서 링크로 이동할 url의 제목
 * @property {string} url : 모달에서 링크로 이동할 url 값
 */
export interface IModalContents {
  type: string;
  iconScaleEffect?: boolean;
  title?: string;
  detail?: string;
  renderAdditionalComponent?: () => ReactElement;
  proceedBtnText?: string;
  onClickProceed?: ((e: React.MouseEvent) => Promise<void>) | null;
  cancelBtnText?: string;
  closeModal: React.MouseEventHandler;
  isClubLentModal?: boolean;
  isLoading?: boolean;
  iconType?: string;
  urlTitle?: string | null;
  url?: string | null;
}

const Modal: React.FC<{ modalContents: IModalContents }> = (props) => {
  const {
    type,
    iconScaleEffect,
    title,
    detail,
    renderAdditionalComponent,
    proceedBtnText,
    onClickProceed,
    cancelBtnText,
    closeModal,
    isClubLentModal,
    isLoading,
    iconType,
    urlTitle,
    url,
  } = props.modalContents;
  const { isMultiSelect, closeMultiSelectMode } = useMultiSelect();
  const navigator = useNavigate();
  const { closeAll } = useMenu();

  return (
    <>
      <BackgroundStyled
        onClick={(e) => {
          closeModal(e);
          if (isMultiSelect) {
            closeMultiSelectMode();
          }
        }}
      />
      <ModalStyled onClick={type === "noBtn" ? closeModal : undefined}>
        {iconType === "CHECK" && (
          <ModalIconImgStyled iconScaleEffect={iconScaleEffect}>
            <CheckIcon stroke="var(--sys-main-color)" />
          </ModalIconImgStyled>
        )}
        {iconType === "ERROR" && !isClubLentModal && (
          <ModalIconImgStyled iconScaleEffect={iconScaleEffect}>
            <ErrorIcon stroke="var(--sys-main-color)" />
          </ModalIconImgStyled>
        )}
        {iconType === "NOTIFICATION" && (
          <ModalIconImgStyled iconScaleEffect={iconScaleEffect}>
            <NotificationIcon stroke="var(--sys-main-color)" />
          </ModalIconImgStyled>
        )}
        <H2Styled>{title}</H2Styled>
        {isClubLentModal && <AdminClubLogContainer size={5} />}
        {detail && (
          <DetailStyled dangerouslySetInnerHTML={{ __html: detail }} />
        )}
        {renderAdditionalComponent?.()}
        {type === "hasProceedBtn" && (
          <ButtonWrapperStyled>
            <Button
              onClick={(e) => {
                onClickProceed!(e);
              }}
              text={proceedBtnText || "확인"}
              theme="fill"
              disabled={isLoading}
            />
            <Button
              onClick={closeModal}
              text={cancelBtnText || "취소"}
              theme="line"
            />
          </ButtonWrapperStyled>
        )}
        {type === "penaltyBtn" && (
          <ButtonWrapperStyled>
            <Button
              onClick={(e) => {
                onClickProceed!(e);
              }}
              text={proceedBtnText || "확인"}
              theme="smallGrayLine"
            />
          </ButtonWrapperStyled>
        )}
        {url && urlTitle && (
          <UrlSectionStyled
            onClick={() => {
              closeAll();
              navigator(url);
            }}
          >
            {urlTitle}
          </UrlSectionStyled>
        )}
      </ModalStyled>
    </>
  );
};

const ModalStyled = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 360px;
  background: var(--bg-color);
  z-index: 1000;
  border-radius: 10px;
  transform: translate(-50%, -50%);
  animation: fadeInModal 0.5s;
  @keyframes fadeInModal {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1.5;
    }
  }
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  padding: 40px 20px;
  color: var(--normal-text-color);
`;

const ModalIconImgStyled = styled.div<{ iconScaleEffect: boolean | undefined }>`
  svg {
    width: 70px;
    margin-bottom: 20px;
    animation: ${(props) =>
      props.iconScaleEffect &&
      css`
        scaleUpModalIcon 1s;
      `};
  }
  @keyframes scaleUpModalIcon {
    0% {
      transform: scale(0.2);
    }
    100% {
      transform: scale(1);
    }
  }
`;

export const DetailStyled = styled.p`
  margin-top: 20px;
  letter-spacing: -0.02rem;
  line-height: 1.5rem;
  font-size: 0.875rem;
  font-weight: 300;
  white-space: break-spaces;
`;

const H2Styled = styled.h2`
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.75rem;
  white-space: break-spaces;
  word-break: keep-all;
`;

const BackgroundStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--modal-bg-shadow-color);
  animation: fadeInBg 0.5s;
  @keyframes fadeInBg {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  z-index: 1000;
`;

const ButtonWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
`;

const DropdownStyled = styled.select`
  margin-top: 20px;
  text-align: center;
  width: 200px;
  height: 40px;
`;

const UrlSectionStyled = styled.div`
  display: inline-block;
  font-size: 0.875rem;
  text-decoration: underline;
  color: var(--sys-main-color);
  margin-top: 20px;

  &:hover {
    cursor: pointer;
  }
`;

export default Modal;
