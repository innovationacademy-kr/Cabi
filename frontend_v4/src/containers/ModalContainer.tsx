import styled from "styled-components";
import checkIcon from "@/assets/images/checkIcon.svg";
import errorIcon from "@/assets/images/errorIcon.svg";
import ButtonContainer from "./ButtonContainer";
import exitButton from "@/assets/images/exitButton.svg";

export interface ModalInterface {
  type: string; //"confirm" : 진행 가능한 모달(메모, 대여, 반납 등에 사용) "erorr": 진행 불가능한 모달(문구와 닫기버튼만 존재)
  title: string | null; //모달 제목
  detail: string | null; //안내문구 (confirm 타입 모달만 가짐)
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
      <BackgroundStyled />
      <ModalConatinerStyled type={type}>
        <div onClick={onClose}>
          <CloseButtonStyled type={type} src={exitButton} />
        </div>
        <img
          src={type === "confirm" ? checkIcon : errorIcon}
          style={{ width: "70px", marginBottom: "20px" }}
        />
        <H2Styled>{title}</H2Styled>
        <DetailStyled>{detail}</DetailStyled>
        {type === "confirm" ? (
          <ButtonContainer onClick={onClose} text="취소" theme="white" />
        ) : null}
        {type === "confirm" ? (
          <ButtonContainer
            onClick={onClickProceed}
            text={confirmMessage}
            theme="dark"
          />
        ) : null}
      </ModalConatinerStyled>
    </>
  );
};

const ModalConatinerStyled = styled.div<{ type: string }>`
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
  padding: 30px 0 10px 0;
  padding-bottom: ${({ type }) => (type === "error" ? 0 : "10px")};
`;

const DetailStyled = styled.p`
  margin-bottom: 30px;
`;

const H2Styled = styled.h2`
  font-weight: 600;
  font-size: 1.5rem;
  margin: 0 30px 30px 30px;
  white-space: break-spaces;
`;

const BackgroundStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  zindex: 1000;
`;

const CloseButtonStyled = styled.img<{ type: string }>`
  display: ${({ type }) => (type === "confirm" ? "none" : "block")};
  width: 26px;
  height: 26px;
  position: absolute;
  top: 30px;
  right: 30px;
  cursor: pointer;
  &: hover {
    opacity: 0.8;
  }
`;

export default ModalContainer;
