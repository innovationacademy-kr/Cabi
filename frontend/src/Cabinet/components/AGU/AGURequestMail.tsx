import { useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { serverTimeState } from "@/Cabinet/recoil/atoms";
import Button from "@/Cabinet/components/Common/Button";
import { axiosAGU } from "@/Cabinet/api/axios/axios.custom";

// TODO : 파일/컴포넌트 이름 변경
const AGURequestMail = ({
  mail,
  idRef,
  setIsLoading,
  setMail,
}: {
  mail: string;
  idRef: React.RefObject<HTMLInputElement>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setMail: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [timerTimeInMs, setTimerTimeInMs] = useState(0); // agu code 인증 링크 요청 유효 타이머 시간 ms로 표현
  // TODO : 변수명
  const [serverTime, setServerTime] = useRecoilState<Date>(serverTimeState);
  const subHeaderMsg = `인트라 아이디를 입력하시면 <span>인트라 이메일 주소</span>로 <span>인증 링크</span>가 전송됩니다.`;
  const subHeaderMsg2 = `<span>${mail}</span>로 인증 링크가 전송되었습니다.`;

  const handleButtonClick = async () => {
    setIsLoading(true);

    try {
      if (idRef.current) {
        const id = idRef.current.value;
        const response = await axiosAGU(id);
        // TODO: 200일때 alert / 화면 글자
        // {
        //   "oauthMail" : "ㅁㄴㅇㄹ",
        //   "date" : 현재 서버 시각,
        //   "expiryTime": 3
        //  }
        // TODO : response 타입 설정
        setMail(response.data.oauthMail);
        setTimerTimeInMs(response.data.expiryTime * 60 * 1000);
        const formattedServerTime = response.data.date.split(" KST")[0];
        setServerTime(new Date(formattedServerTime)); // 최초 서버 시간
        // TODO : oauthmail, date, expirytime 하나의 객체에 저장?
      }
    } catch (error: any) {
      console.log(error);
      alert(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <SubHeaderStyled
        dangerouslySetInnerHTML={{ __html: subHeaderMsg }}
      ></SubHeaderStyled>
      {/* <SubHeaderStyled
        dangerouslySetInnerHTML={{ __html: subHeaderMsg2 }}
      ></SubHeaderStyled> */}
      {mail}
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

const SubHeaderStyled = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: var(--sys-sub-color);
  margin-top: 25px;
  line-height: 1.5;
  word-break: keep-all;
  margin: 25px 10px 0px 10px;
  color: var(--sys-main-color);

  span {
    font-weight: 700;
    text-decoration: underline;
  }
`;

export default AGURequestMail;
