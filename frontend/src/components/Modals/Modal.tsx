import React, { ReactElement } from "react";
import styled, { css } from "styled-components";
import AdminClubLogContainer from "@/components/Club/AdminClubLog.container";
import Button from "@/components/Common/Button";
import useMultiSelect from "@/hooks/useMultiSelect";

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
 */
export interface IModalContents {
  type: string;
  icon?: string;
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
}

const Modal: React.FC<{ modalContents: IModalContents }> = (props) => {
  const {
    type,
    icon,
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
  } = props.modalContents;
  const { isMultiSelect, closeMultiSelectMode } = useMultiSelect();

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
        {icon && (
          <ModalIconImgStyled src={icon} iconScaleEffect={iconScaleEffect} />
        )}
        <H2Styled>{title}</H2Styled>
        {isClubLentModal && <AdminClubLogContainer size={5} />}
        {detail && (
          <DetailStyled dangerouslySetInnerHTML={{ __html: detail }} />
        )}
        {renderAdditionalComponent && renderAdditionalComponent()}
        {type === "hasProceedBtn" && (
          <ButtonWrapperStyled>
            <Button
              onClick={closeModal}
              text={cancelBtnText || "취소"}
              theme="line"
            />
            <Button
              onClick={(e) => {
                onClickProceed!(e);
              }}
              text={proceedBtnText || "확인"}
              theme="fill"
              disabled={isLoading}
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
      </ModalStyled>
    </>
  );
};

const ModalStyled = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 360px;
  background: white;
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
`;

const ModalIconImgStyled = styled.img<{ iconScaleEffect: boolean | undefined }>`
  width: 70px;
  margin-bottom: 20px;
  ${(props) =>
    props.iconScaleEffect &&
    css`
      animation: scaleUpModalIcon 1s;
      @keyframes scaleUpModalIcon {
        0% {
          width: 0px;
        }
        100% {
          width: 70px;
        }
      }
    `}
`;

export const DetailStyled = styled.p`
  margin-top: 20px;
  letter-spacing: -0.02rem;
  line-height: 1.5rem;
  font-size: 14px;
  font-weight: 300;
  white-space: break-spaces;
`;

const H2Styled = styled.h2`
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.75rem;
  white-space: break-spaces;
`;

const BackgroundStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgb(0, 0, 0);
  opacity: 0.4;
  animation: fadeInBg 0.5s;
  @keyframes fadeInBg {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 0.4;
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

const Option = styled.option`
  background-color: red;
`;

export default Modal;
