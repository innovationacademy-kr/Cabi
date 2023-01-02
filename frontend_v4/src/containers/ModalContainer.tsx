import styled from "styled-components";
import checkIcon from "@/assets/images/checkIcon.svg";
import errorIcon from "@/assets/images/errorIcon.svg";
import ButtonContainer from "./ButtonContainer";
import React from "react";

export interface ModalInterface {
  type: string; //"confirm" : 진행 가능한 모달(메모, 대여, 반납 등에 사용) "erorr": 진행 불가능한 모달(문구와 닫기버튼만 존재)
  title: string | null; //모달 제목
  detail: string | null | JSX.Element; //안내문구 (confirm 타입 모달만 가짐)
  confirmMessage: string; //확인 버튼의 텍스트
  onClickProceed: () => void | null;
}

interface ModalContainerInterface {
  modalObj: ModalInterface;
  onClose: React.MouseEventHandler;
}

const ModalContainer = ({ modalObj, onClose }: ModalContainerInterface) => {
  const { type, title, detail, confirmMessage, onClickProceed } = modalObj;
  return (
    <>
      <BackgroundStyled onClick={onClose} />
      <ModalContainerStyled type={type}>
        <img
          src={type === "confirm" ? checkIcon : errorIcon}
          style={{ width: "70px", marginBottom: "20px" }}
        />
        <H2Styled>{title}</H2Styled>
        {detail}
        {type === "confirm" && (
          <ButtonWrapperStyled>
            <ButtonContainer onClick={onClose} text="취소" theme="white" />

            <ButtonContainer
              onClick={onClickProceed}
              text={confirmMessage}
              theme="dark"
            />
          </ButtonWrapperStyled>
        )}
      </ModalContainerStyled>
    </>
  );
};

const ModalContainerStyled = styled.div<{ type: string }>`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 360px;
  background: white;
  z-index: 1000;
  border-radius: 10px;
  transform: translate(-50%, -50%);
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  padding: 40px 30px;
`;

export const DetailStyled = styled.p`
  //margin-bottom: 30px;
  margin-top: 30px;
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
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
`;

const ButtonWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
`;

export default ModalContainer;
