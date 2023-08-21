import { useState } from "react";
import styled from "styled-components";
import alertImg from "@/assets/images/cautionSign.svg";
import clockImg from "@/assets/images/clock.svg";
import ticketImg from "@/assets/images/subtract.svg";

interface CountTimeProps {
  minutes: string;
  seconds: string;
  isTimeOver: boolean;
}

const CodeAndTime = ({ minutes, seconds, isTimeOver }: CountTimeProps) => {
  //초대코드 가져오기
  const code = "4242";
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    });
  };

  return (
    <CodeAndTimeStyled>
      <CodeStyled onClick={handleCopyClick} copySuccess={copySuccess}>
        {copySuccess ? "복사 완료" : `초대코드 | ${code}`}
      </CodeStyled>
      <TimeStyled>
        <ClockStyled>
          <ClockImgStyled src={clockImg} />
          제한시간
        </ClockStyled>
        {isTimeOver ? (
          <CountEndStyled>TIME OVER</CountEndStyled>
        ) : (
          <CountDownStyled>{`${minutes}:${seconds}`}</CountDownStyled>
        )}
      </TimeStyled>
      <HoverBox>
        <AlertImgStyled src={alertImg} />
        <>제한 시간 내 2명 이상이 되면 대여가 완료됩니다.</>
      </HoverBox>
    </CodeAndTimeStyled>
  );
};

const HoverBox = styled.div`
  opacity: 0;
  position: absolute;
  top: -165%;
  width: 270px;
  height: 70px;
  padding: 10px;
  background-color: rgba(73, 73, 73, 0.99);
  border-radius: 10px;
  box-shadow: 4px 4px 20px 0px rgba(0, 0, 0, 0.5);
  font-size: 12px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const CodeAndTimeStyled = styled.div`
  max-width: 240px;
  width: 100%;
  height: 145px;
  padding: 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  border-radius: 10px;
  margin-bottom: 15px;
  background: var(--white);
  color: var(--main-color);
  border: 1px solid var(--main-color);
  position: relative;
  &:hover ${HoverBox} {
    opacity: 1;
  }
`;

const CodeStyled = styled.div<{ copySuccess: boolean }>`
  width: 185px;
  height: 48px;
  background-image: url(${ticketImg});
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  letter-spacing: 3.5px;
  cursor: pointer;
  user-select: none;
`;

const TimeStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ClockStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 10px;
`;

const ClockImgStyled = styled.img`
  width: 15px;
  height: 15px;
  margin-bottom: 3px;
`;

const CountDownStyled = styled.div`
  font-size: 28px;
  font-weight: bold;
  margin-left: 15px;
  letter-spacing: 4px;
`;

const CountEndStyled = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-left: 15px;
`;

const AlertImgStyled = styled.img`
  width: 28px;
  height: 28px;
  filter: invert(99%) sepia(100%) saturate(3%) hue-rotate(32deg)
    brightness(104%) contrast(100%);
`;

export default CodeAndTime;
