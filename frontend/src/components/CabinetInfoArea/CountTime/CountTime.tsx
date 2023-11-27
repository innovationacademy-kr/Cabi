import styled from "styled-components";
import { ReactComponent as ClockImg } from "@/assets/images/clock.svg";

interface CountTimeProps {
  minutes: string;
  seconds: string;
  isTimeOver: boolean;
}

const CountTime = ({ minutes, seconds, isTimeOver }: CountTimeProps) => {
  return (
    <CountTimeStyled>
      <ClockStyled>
        <ClockImg stroke="var(--main-color)" />
        제한시간
      </ClockStyled>
      {isTimeOver ? (
        <CountEndStyled>TIME OVER</CountEndStyled>
      ) : (
        <CountDownStyled>{`${minutes}:${seconds}`}</CountDownStyled>
      )}
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

export default CountTime;
