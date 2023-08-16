import styled from "styled-components";
import clockImg from "@/assets/images/clock.svg";

interface CountTimeProps {
  minutes: string;
  seconds: string;
}

const CountTime = ({ minutes, seconds }: CountTimeProps) => {
  return (
    <CountTimeStyled>
      <ClockStyled>
        <ClockImgStyled src={clockImg} />
        제한시간
      </ClockStyled>
      <CountDownStyled>{`${minutes}:${seconds}`}</CountDownStyled>
    </CountTimeStyled>
  );
};

const CountTimeStyled = styled.div`
  max-width: 240px;
  width: 100%;
  height: 80px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-bottom: 15px;
  background: var(--white);
  color: var(--main-color);
  border: 1px solid var(--main-color);
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

export default CountTime;
