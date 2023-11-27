import { useEffect, useState } from "react";
import styled from "styled-components";

const openTime = "오후 1:00:00";

const Timer = ({ observeOpenTime }: { observeOpenTime: () => void }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 500);

    if (currentTime.toLocaleTimeString() === openTime) observeOpenTime();

    return () => clearInterval(intervalId);
  }, [currentTime, observeOpenTime]); //

  const formattedTime = currentTime.toLocaleTimeString().substring(2, 11);

  return (
    <>
      <TimerIconStyled src="/src/assets/images/alarm.svg" />
      <TimerStyled>{formattedTime}</TimerStyled>
    </>
  );
};

const TimerIconStyled = styled.img`
  height: 25px;
  width: 25px;
  margin-top: 50px;
`;

const TimerStyled = styled.div`
  margin-top: 5px;
  color: var(--main-color);
  font-size: 1.8rem;
  font-weight: 600;
`;

export default Timer;
