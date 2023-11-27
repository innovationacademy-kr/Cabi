import { useEffect } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { serverTimeState } from "@/recoil/atoms";

const openTime = "오후 1:00:00";

const Timer = ({ observeOpenTime }: { observeOpenTime: () => void }) => {
  const [serverTime] = useRecoilState<Date>(serverTimeState);

  useEffect(() => {
    if (serverTime.toLocaleTimeString() === openTime) observeOpenTime();
  }, [serverTime]);

  const formattedTime = serverTime.toLocaleTimeString().substring(2, 11);

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
