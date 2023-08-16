import { useEffect, useState } from "react";
import CodeAndTime from "@/components/CabinetInfoArea/CountTime/CodeAndTime";
import CountTime from "@/components/CabinetInfoArea/CountTime/CountTime";

const CountTimeContainer = ({ isMine }: { isMine: boolean }) => {
  const ReturnCountTime = (countDown: number) => {
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60))
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000)
      .toString()
      .padStart(2, "0");
    return [minutes, seconds];
  };

  const CountDown = (targetDate: Date): string[] => {
    const countDownTime = new Date(targetDate).getTime() - new Date().getTime();
    const [countDown, setCountDown] = useState(countDownTime);

    useEffect(() => {
      const interval = setInterval(() => {
        setCountDown((prevCountDown) => prevCountDown - 1000);
      }, 1000);
      return () => clearInterval(interval);
    }, []);

    return ReturnCountTime(countDown);
  };
  // 세션 만료시간 받아오기
  const endDate = new Date("2023-08-16 09:42:14"); //임의 종료시간 설정
  const [minutes, seconds] = CountDown(endDate);

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
