import { useRef } from "react";
import { AGUSubHeaderStyled } from "@/Cabinet/pages/AGUPage";
import Button from "@/Cabinet/components/Common/Button";
import { axiosAGU } from "@/Cabinet/api/axios/axios.custom";

// TODO : 파일/컴포넌트 이름 변경
const AGURequestMail = ({
  mail,
  setMail,
}: {
  mail: string;
  setMail: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const idRef = useRef<HTMLInputElement>(null);
  const subHeaderMsg = mail
    ? `<span>${mail}</span>로 인증 링크가 전송되었습니다.`
    : `인트라 아이디를 입력하시면 <span>인트라 이메일 주소</span>로 <span>인증 링크</span>가 전송됩니다.`;

  const handleButtonClick = async () => {
    // setIsLoading(true);

    try {
      if (idRef.current) {
        const id = idRef.current.value;
        const response = await axiosAGU(id);
        // TODO: 200일때 alert / 화면 글자
        // TODO : response 타입 설정
        setMail(response.data.oauthMail);
      }
    } catch (error: any) {
      console.log(error);
      alert(error.response.data.message);
    } finally {
      // setIsLoading(false);
    }
  };

  return (
    <>
      <AGUSubHeaderStyled
        dangerouslySetInnerHTML={{ __html: subHeaderMsg }}
      ></AGUSubHeaderStyled>
      <input ref={idRef} style={{ border: "1px solid black" }}></input>
      <Button
        onClick={handleButtonClick}
        theme="fill"
        text="인증 요청"
        maxWidth="500px"
      ></Button>
    </>
  );
};

export default AGURequestMail;
