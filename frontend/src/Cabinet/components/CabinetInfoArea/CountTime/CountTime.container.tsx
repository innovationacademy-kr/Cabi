import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import {
  myCabinetInfoState,
  targetCabinetInfoState,
  userState,
} from "@/Cabinet/recoil/atoms";
import CodeAndTime from "@/Cabinet/components/CabinetInfoArea/CountTime/CodeAndTime";
import CountTime from "@/Cabinet/components/CabinetInfoArea/CountTime/CountTime";
import { MyCabinetInfoResponseDto } from "@/Cabinet/types/dto/cabinet.dto";
import {
  axiosCabinetById,
  axiosMyLentInfo,
} from "@/Cabinet/api/axios/axios.custom";
import { padToNDigits } from "@/Cabinet/utils/dateUtils";

const returnCountTime = (countDown: number) => {
  const minutes = padToNDigits(
    Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60)),
    2
  );
  const seconds = padToNDigits(Math.floor((countDown % (1000 * 60)) / 1000), 2);
  return [minutes, seconds];
};

const CountTimeContainer = ({ isMine }: { isMine: boolean }) => {
  const calculateCountDown = (targetDate: Date | undefined) => {
    if (!targetDate) return 0;
    if (typeof targetDate === "string") {
      targetDate = new Date(targetDate);
    }
    const currentTime = new Date().getTime();
    const targetTime = targetDate.getTime();
    if (targetTime <= currentTime) return 0;
    return targetTime - currentTime + 1500;
  };

  const [targetCabinetInfo, setTargetCabinetInfo] = useRecoilState(
    targetCabinetInfoState
  );
  const lastUpdatedTime = useRef<number>(Date.now());
  const initCountDown = calculateCountDown(targetCabinetInfo.sessionExpiredAt);
  const [countDown, setCountDown] = useState(initCountDown);
  const [myCabinetInfo, setMyLentInfo] =
    useRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const [timeOver, setTimeOver] = useState(false);
  const [myInfo, setMyInfo] = useRecoilState(userState);

  const checkTimeOver = async () => {
    if (!timeOver && countDown <= 0) {
      setTimeOver(true);
      try {
        const { data } = await axiosCabinetById(targetCabinetInfo.cabinetId);
        setTargetCabinetInfo(data);
        const { data: myLentInfo } = await axiosMyLentInfo();
        setMyLentInfo(myLentInfo);
        if (myLentInfo.status == "FULL")
          setMyInfo({ ...myInfo, cabinetId: targetCabinetInfo.cabinetId });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
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
