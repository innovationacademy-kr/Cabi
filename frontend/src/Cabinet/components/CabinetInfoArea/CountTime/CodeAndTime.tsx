import { useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { myCabinetInfoState } from "@/Cabinet/recoil/atoms";
import alertImg from "@/Cabinet/assets/images/cautionSign.svg";
import { ReactComponent as ClockImg } from "@/Cabinet/assets/images/clock.svg";
import { MyCabinetInfoResponseDto } from "@/Cabinet/types/dto/cabinet.dto";
import useDebounce from "@/Cabinet/hooks/useDebounce";

interface CountTimeProps {
  minutes: string;
  seconds: string;
  isTimeOver: boolean;
}

const CodeAndTime = ({ minutes, seconds, isTimeOver }: CountTimeProps) => {
  const myCabinetInfo =
    useRecoilValue<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const code = myCabinetInfo.shareCode + "";
  const [copySuccess, setCopySuccess] = useState(false);
  const { debounce } = useDebounce();

  const handleCopyClick = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopySuccess(true);
      debounce(
        "codeCopyClick",
        () => {
          setCopySuccess(false);
        },
        2000
      );
    });
  };

  return (
    <CodeAndTimeStyled>
      <CodeStyled onClick={handleCopyClick} copySuccess={copySuccess}>
        {copySuccess ? "복사 완료" : `초대코드 | ${code}`}
      </CodeStyled>
      <TimeStyled>
        <ClockStyled>
          <ClockImg stroke="var(--sys-main-color)" />
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
  box-shadow: 4px 4px 20px 0px var(--hover-box-shadow-color);
  font-size: 0.75rem;
  color: var(--bg-color);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  transition: opacity 0.3s ease;
  pointer-events: none;
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
  background: var(--bg-color);
  color: var(--sys-main-color);
  border: 1px solid var(--sys-main-color);
  position: relative;
  &:hover ${HoverBox} {
    opacity: 1;
  }
`;

const CodeStyled = styled.div<{ copySuccess: boolean }>`
  width: 185px;
  height: 48px;
  background-color: var(--sys-main-color);
  mask-image: url("data:image/svg+xml,%3Csvg width='184' height='48' viewBox='0 0 184 48' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 0H184V14.4C184 14.4 184 14.4 184 14.4C178.766 14.4 174.523 18.6981 174.523 24C174.523 29.3019 178.766 33.6 184 33.6C184 33.6 184 33.6 184 33.6V48H0V33.6C5.2335 33.5998 9.47603 29.3018 9.47603 24C9.47603 18.6982 5.2335 14.4002 0 14.4V0Z' fill='%239747FF'/%3E%3C/svg%3E%0A");
  color: var(--bg-color);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.875rem;
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
  font-size: 0.625rem;
  svg {
    width: 20px;
    height: 20px;
    margin-bottom: 4px;
  }
`;

const CountDownStyled = styled.div`
  font-size: 1.75rem;
  font-weight: bold;
  margin-left: 15px;
  letter-spacing: 4px;
`;

const CountEndStyled = styled.div`
  font-size: 1.5rem;
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
