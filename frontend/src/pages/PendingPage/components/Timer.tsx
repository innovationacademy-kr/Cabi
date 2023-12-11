import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { s } from "vitest/dist/env-afee91f0";
import { serverTimeState } from "@/recoil/atoms";

const openTime = "오후 1:00:00";

const Timer = ({ observeOpenTime }: { observeOpenTime: () => void }) => {
  const [serverTime] = useRecoilState<Date>(serverTimeState);
  const [remainingTime, setRemainingTime] = useState<number>(86400000); // 기본 24시로 초기화

  useEffect(() => {
    if (serverTime.toLocaleTimeString() === openTime) observeOpenTime();
    setRemainingTime(calculateRemainingTime());
  }, [serverTime]);

  function calculateRemainingTime() {
    if (remainingTime === 0) return 0; // 이미 오픈했으면 OPEN으로 표시
    const openTime = new Date();
    openTime.setHours(13, 0, 0, 0); // 13:00:00로 설정

    let timeDiff;

    timeDiff = openTime.getTime() - serverTime.getTime();
    if (openTime.getTime() < serverTime.getTime()) timeDiff += 86400000; // 24시간을 더해줌

    if (timeDiff < 0) return -timeDiff;
    return timeDiff;
  }

  const hours = Math.floor(remainingTime / 3600000);
  const minutes = Math.floor((remainingTime % 3600000) / 60000);
  const seconds = Math.floor((remainingTime % 60000) / 1000);

  return (
    <>
      <TimerIconStyled src="/src/assets/images/alarm.svg" />
      <TimerStyled>
        {remainingTime === 0
          ? "OPEN"
          : `${hours}시간 ${minutes}분 ${seconds}초`}
      </TimerStyled>
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
