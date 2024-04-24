import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { myCoinsState } from "@/Cabinet/recoil/atoms";
import MultiToggleSwitch, {
  toggleItem,
} from "@/Cabinet/components/Common/MultiToggleSwitch";
import CoinLogToggleType from "@/Cabinet/types/enum/store.enum";
import { axiosCoinLog } from "@/Cabinet/api/axios/axios.custom";

const dateOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

const toggleList: toggleItem[] = [
  { name: "전체", key: CoinLogToggleType.ALL },
  { name: "적립", key: CoinLogToggleType.EARN },
  { name: "사용", key: CoinLogToggleType.USE },
];

interface ICoinLog {
  date: Date;
  title: string;
  amount: number;
}

const test: ICoinLog[] = [
  {
    date: new Date(
      Number(new Date().getFullYear()),
      Number(new Date().getMonth()),
      Number(new Date().getDate())
    ),
    title: "160시간 출석",
    amount: 2000,
  },
  {
    date: new Date(
      Number(new Date().getFullYear()),
      Number(new Date().getMonth()),
      Number(new Date().getDate() + 1)
    ),
    title: "160시간 출석",
    amount: -2000,
  },
];

const CoinLog = () => {
  const [toggleType, setToggleType] = useState<CoinLogToggleType>(
    CoinLogToggleType.ALL
  );
  const [coinLogs, setCoinLogs] = useState<ICoinLog[] | null>(null);
  const inquiryPeriod = 3;
  // 조회기간
  const [myCoin] = useRecoilState(myCoinsState);

  const getCoinLog = async (type: CoinLogToggleType) => {
    try {
      // const response = await axiosCoinLog(
      //   type,
      //   new Date(
      //   Number(new Date().getFullYear()),
      //   Number(month) - inquiryPeriod,
      //   Number(day)
      // ),
      //   new Date()
      // );
      // TODO : 필요시 NOTE: Date 객체의 시간은 UTC 기준이므로 한국 시간 (GMT + 9) 으로 변환, 이후 발표 시작 시간인 14시를 더해줌
      // data.setHours(9 + 14);
      // TODO : setCoinLogs(response.date.coinHistories);
      setCoinLogs(test);
    } catch (error: any) {
      console.error("Error getting coin log:", error);
    }
  };

  useEffect(() => {
    getCoinLog(toggleType);
  }, [toggleType]);

  return (
    <WrapperStyled>
      <TitleWrapperStyled>
        <h1>코인 내역</h1>
        <div>icon</div>
      </TitleWrapperStyled>
      보유 재화 : {myCoin}
      <MultiToggleSwitchStyled>
        <MultiToggleSwitch
          initialState={toggleType}
          setState={setToggleType}
          toggleList={toggleList}
        ></MultiToggleSwitch>
      </MultiToggleSwitchStyled>
      <LogItemWrapperStyled>
        {coinLogs?.map((log, idx) => {
          const isEarned = log.amount > 0;
          return (
            <LogItemStyled isEarned={isEarned} key={idx}>
              <span id="date">
                {new Date(log.date).toLocaleString("ko-KR", dateOptions)}
              </span>
              <span id="title">{log.title}</span>
              <span id="amount">
                {isEarned ? "+" : ""}
                {log.amount}
              </span>
            </LogItemStyled>
          );
        })}
      </LogItemWrapperStyled>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  /* height: 100%; */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;
`;

const TitleWrapperStyled = styled.div`
  width: 80%;
  border-bottom: 2px solid #d9d9d9;
  font-weight: 700;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;

  & > h1 {
    font-size: 2rem;
  }

  & > div {
  }
`;

const MultiToggleSwitchStyled = styled.div`
  width: 80%;
  margin-bottom: 1rem;
`;

const LogItemWrapperStyled = styled.div`
  width: 80%;
`;

const LogItemStyled = styled.div<{
  isEarned: boolean;
}>`
  margin-top: 10px;
  border-radius: 10px;
  height: 70px;
  border: 1px solid #d9d9d9;
  padding: 0 40px;
  display: flex;
  text-align: center;

  & > #date {
    color: #595959;
  }
  & > #title {
    font-size: 18px;
    color: var(--black);
  }
  & > #amount {
    color: ${(props) => (props.isEarned ? "#406ee4" : "var(--expired)")};
  }
`;

export default CoinLog;
