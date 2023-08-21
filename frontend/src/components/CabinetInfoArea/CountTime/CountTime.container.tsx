import { useEffect, useRef, useState } from "react";
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

const CountTimeContainer = ({ isMine }: { isMine: boolean }) => {
  const calculateCountDown = (targetDate: Date) => {
    return targetDate.getTime() - new Date().getTime();
  };
  const endDate = new Date(); //임의 종료시간 설정
  endDate.setMinutes(endDate.getMinutes() + 4, endDate.getSeconds() + 2);

  const initCountDown = calculateCountDown(endDate);
  const [countDown, setCountDown] = useState(initCountDown);
  const lastUpdatedTime = useRef<number>(Date.now());

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

  const [minutes, seconds] = returnCountTime(countDown);

  return (
    <>
      {isMine ? (
        <CodeAndTime minutes={minutes} seconds={seconds} />
      ) : (
        <CountTime minutes={minutes} seconds={seconds} />
      )}
    </>
  );
};

export default CountTimeContainer;
