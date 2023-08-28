import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { timeOverState } from "@/recoil/atoms";
import CodeAndTime from "@/components/CabinetInfoArea/CountTime/CodeAndTime";
import CountTime from "@/components/CabinetInfoArea/CountTime/CountTime";

const returnCountTime = (countDown: number) => {
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60))
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000)
    .toString()
    .padStart(2, "0");
  return [minutes, seconds];
};

const CountTimeContainer = ({
  isMine,
  sessionExpiredAt,
}: {
  isMine: boolean;
  sessionExpiredAt: Date | undefined;
}) => {
  const [timeOver, setTimeOver] = useRecoilState(timeOverState);
  const calculateCountDown = (targetDate: Date) => {
    return targetDate.getTime() - new Date().getTime();
  };

  // const initCountDown = sessionExpiredAt
  //   ? calculateCountDown(sessionExpiredAt)
  //   : 0;
  const endDate = new Date(); //임의 종료시간 설정
  endDate.setMinutes(endDate.getMinutes(), endDate.getSeconds() + 10);

  const initCountDown = calculateCountDown(endDate);
  const [countDown, setCountDown] = useState(initCountDown);
  const lastUpdatedTime = useRef<number>(Date.now());

  const checkTimeOver = () => {
    if (!timeOver && countDown <= 0) {
      setTimeOver(true);
    }
  };

  useEffect(() => {
    const updateCountDown = () => {
      const currentTime = Date.now();
      const timeElapsed = currentTime - lastUpdatedTime.current;
      lastUpdatedTime.current = currentTime;

      setCountDown((prevCountDown) => {
        if (prevCountDown > 0) {
          return Math.max(prevCountDown - timeElapsed, 0);
        } else {
          return 0;
        }
      });

      requestAnimationFrame(updateCountDown);
    };

    updateCountDown();

    return () => {
      lastUpdatedTime.current = Date.now();
    };
  }, []);

  useEffect(() => {
    checkTimeOver();
  }, [countDown]);

  const [minutes, seconds] = returnCountTime(countDown);

  return (
    <>
      {isMine ? (
        <CodeAndTime
          minutes={minutes}
          seconds={seconds}
          isTimeOver={timeOver}
        />
      ) : (
        <CountTime minutes={minutes} seconds={seconds} isTimeOver={timeOver} />
      )}
    </>
  );
};

export default CountTimeContainer;
