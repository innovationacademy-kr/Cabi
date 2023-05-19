import styled, { css } from "styled-components";
import Button from "@/components/Common/Button";
import React, { ReactElement } from "react";
import useMultiSelect from "@/hooks/useMultiSelect";

export interface IModalContents {
  type: string; // hasProceedBtn(모달 외부 클릭이나 취소 버튼으로 끔), noBtn(모달 내/외부 클릭으로 끔)
  icon?: string; // checkIcon, errorIcon import 해서 넘기거나 다른 아이콘 사용 가능
  iconScaleEffect?: boolean; // iconEffect 적용 여부
  title?: string; // 모달 제목
  detail?: string; // 모달 본문
  renderAdditionalComponent?: () => ReactElement; // 모달에 추가로 띄울 UI를 렌더해주는 함수
  proceedBtnText?: string; // 확인 버튼의 텍스트(기본값: 확인)
  onClickProceed?: ((e: React.MouseEvent) => Promise<void>) | null; // 확인 버튼의 동작함수
  cancleBtnText?: string; // 취소 버튼의 텍스트(기본값: 취소)
  closeModal: React.MouseEventHandler; // 모달 닫는 함수
}

const PasswordCheckModal: React.FC<{
  modalContents: IModalContents;
  password: string;
}> = ({ modalContents, password }) => {
  const {
    type,
    icon,
    iconScaleEffect,
    title,
    detail,
    renderAdditionalComponent,
    proceedBtnText,
    onClickProceed,
    cancleBtnText,
    closeModal,
  } = modalContents;
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
        {detail && (
          <DetailStyled dangerouslySetInnerHTML={{ __html: detail }} />
        )}
        {renderAdditionalComponent && renderAdditionalComponent()}
        <ButtonWrapperStyled>
          <Button
            onClick={closeModal}
            text={cancleBtnText || "취소"}
            theme="line"
          />
          <Button
            onClick={(e) => {
              onClickProceed!(e);
            }}
            text={proceedBtnText || "확인"}
            theme="fill"
            disabled={password.length < 4}
          />
        </ButtonWrapperStyled>
      </ModalStyled>
    </>
  );
};

const Input = styled.input<{ isEmpty: number | null }>`
  width: 20%;
  height: 100%;
  border-radius: 10px;
  outline: none;
  border: ${({ isEmpty }) =>
    isEmpty ? "1px solid var(--main-color)" : "1px solid #dfd0fe"};
`;

const PasswordContainer = styled.div`
  max-width: 240px;
  width: 100%;
  height: 60px;
  margin: 0 auto;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

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

export default PasswordCheckModal;
