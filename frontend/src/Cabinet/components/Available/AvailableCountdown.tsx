import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { serverTimeState } from "@/Cabinet/recoil/atoms";
import { ReactComponent as AlarmIcon } from "@/Cabinet/assets/images/alarm.svg";
import Time from "@/Cabinet/types/enum/time.enum";

const openTime = new Date();
openTime.setHours(13, 0, 0, 0); // 오픈 시간인 13:00:00(오후 1시)로 설정

const hours24 = 86400000; // 24시간을 밀리초로 표현

const AvailableCountdown = ({
  observeOpenTime,
}: {
  observeOpenTime: () => void;
}) => {
  const [serverTime] = useRecoilState<Date>(serverTimeState);
  const [remainingTime, setRemainingTime] = useState<number>(hours24); // 기본 24시로 초기화(처음 함수 호출을 위한 값. 큰 의미 없음)

  const hours = Math.floor(remainingTime / 3600000);
  const minutes = Math.floor((remainingTime % 3600000) / 60000);
  const seconds = Math.floor((remainingTime % 60000) / 1000);
  const twoDigitsHours = String(hours).padStart(2, "0");
  const twoDigitsMinutes = String(minutes).padStart(2, "0");
  const twoDigitsSeconds = String(seconds).padStart(2, "0");

  useEffect(() => {
    if (serverTime.toLocaleTimeString() === Time.PENDING_OPEN)
      observeOpenTime(); // 오픈 시간이 되면 업데이트 된 사물함 정보를 가져옴
    if (remainingTime !== 0) setRemainingTime(getRemainingTime()); // 이미 오픈했으면 OPEN으로 표시
  }, [serverTime]);

  function getRemainingTime() {
    let timeRemains;

    timeRemains = openTime.getTime() - serverTime.getTime();

    if (openTime.getTime() < serverTime.getTime()) timeRemains += hours24; // 24시간을 더해줌

    if (timeRemains < 0) return -timeRemains;
    return timeRemains;
  }

  return (
    <>
      <AvailableCountdownStyled>
        {remainingTime === 0
          ? "OPEN"
          : `${twoDigitsHours}:${twoDigitsMinutes}:${twoDigitsSeconds} 남았습니다`}
      </AvailableCountdownStyled>
    </>
  );
};

const AvailableCountdownIconStyled = styled.div`
  height: 25px;
  width: 25px;
  margin-top: 50px;
`;

const AvailableCountdownStyled = styled.div`
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
`;

export default AvailableCountdown;
