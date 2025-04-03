import { HttpStatusCode } from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AGUHeaderStyled, AGUSubHeaderStyled } from "@/Cabinet/pages/AGUPage";
import Button from "@/Cabinet/components/Common/Button";
import { axiosVerifyAGUUser } from "@/Cabinet/api/axios/axios.custom";

const AGUMailVerificationSection = ({
  handleButtonClick,
  isProcessingButtonClick,
}: {
  handleButtonClick: (key: string, callback: () => void) => void;
  isProcessingButtonClick: boolean;
}) => {
  const [mail, setMail] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigator = useNavigate();
  const ButtonText = mail ? "재요청" : "인증 요청";

  const renderSubHeaderMsg = () => {
    if (mail)
      return (
        <>
          <span>{mail}</span>로 인증 링크가 전송되었습니다.
        </>
      );

    return (
      <>
        인트라 아이디를 입력하시면 <span>인트라 이메일 주소</span>로{" "}
        <span>인증 링크</span>가 전송됩니다.
      </>
    );
  };

  const verifyAGUUser = async () => {
    try {
      if (inputRef.current) {
        const id = inputRef.current.value;
        const response = await axiosVerifyAGUUser(id);
        if (response.status === HttpStatusCode.Ok) {
          const oauthMail = response.data.oauthMail;

          setMail(oauthMail);
          alert(`${oauthMail}로 인증 링크가 전송되었습니다.`);
        }
      }
    } catch (error: any) {
      console.error(error);
      if (error.response?.status !== HttpStatusCode.Forbidden)
        alert(error.response.data.message);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <>
      <AGUHeaderStyled>A.G.U 이메일 인증</AGUHeaderStyled>
      <AGUSubHeaderStyled>{renderSubHeaderMsg()}</AGUSubHeaderStyled>
      <FormInputStyled
        ref={inputRef}
        placeholder="인트라 아이디를 입력해주세요"
      />
      <Button
        onClick={() => handleButtonClick("aguUserVerification", verifyAGUUser)}
        theme="fill"
        text={ButtonText}
        maxWidth="500px"
        disabled={isProcessingButtonClick}
      ></Button>
      <Button
        onClick={() => navigator("/login")}
        theme="grayLine"
        text="취소"
        maxWidth="500px"
        disabled={isProcessingButtonClick}
      ></Button>
    </>
  );
};

const FormInputStyled = styled.input`
  height: 60px;
  border: 1px solid var(--agu-form-input-border-color);
  border-radius: 8px;
  background-color: var(--card-content-bg-color);
  text-align: left;
  padding: 0 16px;
  margin: 48px 0 24px 0;
  color: var(--notion-btn-text-color);
  min-width: 290px;
  max-width: 500px;
  width: 70%;

  :focus {
    border: 1px solid var(--sys-main-color);
  }

  ::placeholder {
    color: var(--line-color);
  }
`;

export default AGUMailVerificationSection;
