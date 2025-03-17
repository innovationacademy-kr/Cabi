import { HttpStatusCode } from "axios";
import { useRef, useState } from "react";
import styled from "styled-components";
import { AGUSubHeaderStyled } from "@/Cabinet/pages/AGUPage";
import Button from "@/Cabinet/components/Common/Button";
import { axiosVerifyAGUUser } from "@/Cabinet/api/axios/axios.custom";

// TODO : 파일/컴포넌트 이름 변경
const AGURequestMail = ({}: {}) => {
  const [mail, setMail] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const subHeaderMsg = mail
    ? `<span>${mail}</span>로 인증 링크가 전송되었습니다.`
    : `인트라 아이디를 입력하시면 <span>인트라 이메일 주소</span>로 <span>인증 링크</span>가 전송됩니다.`;
  const ButtonText = mail ? "재요청" : "인증 요청";

  const handleButtonClick = async () => {
    // setIsLoading(true);

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
      alert(error.response.data.message);
      if (inputRef.current) inputRef.current.value = "";
    } finally {
      // setIsLoading(false);
    }
  };

  return (
    <>
      <AGUSubHeaderStyled
        dangerouslySetInnerHTML={{ __html: subHeaderMsg }}
      ></AGUSubHeaderStyled>
      <FormInputStyled
        ref={inputRef}
        placeholder="인트라 아이디를 입력해주세요"
      />
      <Button
        onClick={handleButtonClick}
        theme="fill"
        text={ButtonText}
        maxWidth="500px"
      ></Button>
    </>
  );
};

const FormInputStyled = styled.input`
  width: 500px;
  height: 60px;
  border: 1px solid var(--agu-form-input-border-color);
  border-radius: 8px;
  background-color: var(--card-content-bg-color);
  text-align: left;
  padding: 0 16px;
  margin: 48px 0 24px 0;
  color: var(--notion-btn-text-color);

  :focus {
    border: 1px solid var(--sys-main-color);
  }

  ::placeholder {
    color: var(--line-color);
  }
`;

export default AGURequestMail;
