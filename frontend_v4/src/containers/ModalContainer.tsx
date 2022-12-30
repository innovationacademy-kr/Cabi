import styled from "styled-components";
import checkIcon from "@/assets/images/checkIcon.svg";
import errorIcon from "@/assets/images/errorIcon.svg";
import ButtonContainer from "./ButtonContainer";
import exitButton from "@/assets/images/exitButton.svg";

interface ModalInterface {
  type: string; //"confirm" : 진행 가능한 모달(메모, 대여, 반납 등에 사용) "erorr": 진행 불가능한 모달(문구와 닫기버튼만 존재)
  title: string | null; //모달 제목
  detail: string | null; //안내문구 (confirm 타입 모달만 가짐)
  confirmMessage: string; //확인 버튼의 텍스트
}

const ModalContainer = (props: ModalInterface) => {
  return (
    <BackgroundStyled>
      <ModalConatinerStyled type={props.type}>
        <CloseButtonStyled type={props.type} src={exitButton} />
        <img
          src={props.type === "confirm" ? checkIcon : errorIcon}
          style={{ width: "70px", marginBottom: "20px" }}
        />
        <H2Styled>{props.title}</H2Styled>
        <DetailStyled>{props.detail}</DetailStyled>
        {props.type === "confirm" ? (
          <ButtonContainer onClick={(e: any) => e} text="취소" theme="white" />
        ) : null}
        {props.type === "confirm" ? (
          <ButtonContainer
            onClick={(e: any) => e}
            text={props.confirmMessage}
            theme="dark"
          />
        ) : null}
      </ModalConatinerStyled>
    </BackgroundStyled>
  );
};

const ModalConatinerStyled = styled.div<{ type: string }>`
  position: relative;
  width: 360px;
  background: white;
  color: black;
  border-radius: 10px;
  display: flex;
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
  margin-bottom: 30px;
`;

const BackgroundStyled = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
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
