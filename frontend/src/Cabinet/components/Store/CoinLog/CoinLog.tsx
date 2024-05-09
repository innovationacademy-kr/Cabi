import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { userState } from "@/Cabinet/recoil/atoms";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import MultiToggleSwitch, {
  toggleItem,
} from "@/Cabinet/components/Common/MultiToggleSwitch";
import { ReactComponent as CoinIcon } from "@/Cabinet/assets/images/coinIcon.svg";
import { ReactComponent as SadCabiIcon } from "@/Cabinet/assets/images/sadCcabi.svg";
import { ReactComponent as Select } from "@/Cabinet/assets/images/selectMaincolor.svg";
import { CoinLogToggleType } from "@/Cabinet/types/enum/store.enum";
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
  history: string;
  amount: number;
  itemDetails?: string;
  // TODO : itemDetails 들어오면 ? 지우기
}

const unavailableCoinLogMsgMap = {
  [CoinLogToggleType.ALL]: "코인",
  [CoinLogToggleType.EARN]: "적립",
  [CoinLogToggleType.USE]: "사용",
};

const CoinLog = () => {
  const [toggleType, setToggleType] = useState<CoinLogToggleType>(
    CoinLogToggleType.ALL
  );
  const [coinLogs, setCoinLogs] = useState<ICoinLog[] | null>(null);
  const [logsLength, setLogsLength] = useState(0);
  const [page, setPage] = useState(0);
  const [moreButton, setMoreButton] = useState<boolean>(false);
  const [moreBtnIsLoading, setMoreBtnIsLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userInfo] = useRecoilState(userState);
  const size = 5;

  const getCoinLog = async (type: CoinLogToggleType) => {
    setIsLoading(true);
    try {
      const response = await axiosCoinLog(type, page, size);
      page
        ? setCoinLogs((prev) => [...prev!, ...response.data.result])
        : setCoinLogs(response.data.result);
      setLogsLength(response.data.totalLength);
    } catch (error: any) {
      console.error("Error getting coin log:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clickMoreButton = () => {
    setTimeout(() => {
      setPage((prev) => prev + 1);
    }, 100);
  };

  useEffect(() => {
    // 다른 토글버튼을 누르면 page 0
    setPage(0);
    getCoinLog(toggleType);
  }, [toggleType]);

  useEffect(() => {
    getCoinLog(toggleType);
  }, [page]);

  useEffect(() => {
    if (coinLogs?.length) setMoreButton(coinLogs.length < logsLength);
  }, [coinLogs]);

  return (
    <WrapperStyled>
      {isLoading ? (
        <LoadingAnimation />
      ) : toggleType === CoinLogToggleType.ALL && !coinLogs?.length ? (
        <EmptyCoinLogTextStyled>
          {unavailableCoinLogMsgMap[toggleType]} 내역이 없습니다.
          <SadCabiIcon />
        </EmptyCoinLogTextStyled>
      ) : (
        <>
          <TitleStyled>코인 내역</TitleStyled>
          <MyCoinWrapperStyled>
            <MyCoinStyled>
              <CoinIconStyled>
                <CoinIcon />
              </CoinIconStyled>
              <span>{userInfo.coins}</span>
              까비
            </MyCoinStyled>
          </MyCoinWrapperStyled>
          <MultiToggleSwitchStyled>
            <MultiToggleSwitch
              initialState={toggleType}
              setState={setToggleType}
              toggleList={toggleList}
            ></MultiToggleSwitch>
          </MultiToggleSwitchStyled>
          <LogItemWrapperStyled>
            {!coinLogs?.length ? (
              <EmptyCoinLogTextStyled>
                {unavailableCoinLogMsgMap[toggleType]} 내역이 없습니다.
                <SadCabiIcon />
              </EmptyCoinLogTextStyled>
            ) : (
              coinLogs.map((log, idx) => {
                const isEarned = log.amount > 0;
                const hasTypes = log.itemDetails !== log.history;
                return (
                  <LogItemStyled isEarned={isEarned} key={idx}>
                    <span id="date">
                      {new Date(log.date).toLocaleString("ko-KR", dateOptions)}
                    </span>
                    <span id="history" title={log.history}>
                      {log.history} {hasTypes && "- " + log.itemDetails}
                    </span>
                    <span id="amount">
                      {isEarned ? "+" : ""}
                      {log.amount}
                    </span>
                  </LogItemStyled>
                );
              })
            )}
          </LogItemWrapperStyled>
          {moreButton && (
            <ButtonContainerStyled>
              <MoreButtonStyled
                onClick={clickMoreButton}
                moreBtnIsLoading={moreBtnIsLoading}
              >
                {moreBtnIsLoading ? (
                  <LoadingAnimation />
                ) : (
                  <ButtonContentWrapperStyled>
                    <ButtonTextWrapperStyled>더보기</ButtonTextWrapperStyled>
                    <SelectIconWrapperStyled>
                      <Select />
                    </SelectIconWrapperStyled>
                  </ButtonContentWrapperStyled>
                )}
              </MoreButtonStyled>
            </ButtonContainerStyled>
          )}
        </>
      )}
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0 100px 0;
`;

const TitleStyled = styled.h1`
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  font-size: 2rem;
  text-align: right;
  margin-top: 20px;
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
  padding: 0 20px;
  display: flex;
  text-align: center;
  display: flex;
  align-items: center;

  & > #date {
    color: #595959;
    width: 16%;
    text-align: center;
  }

  & > #history {
    font-size: 18px;
    color: var(--black);
    width: 74%;
    text-align: start;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  & > #amount {
    color: ${(props) =>
      props.isEarned ? "var(--main-color)" : "var(--black)"};
    font-size: 18px;
    font-weight: bold;
    width: 10%;
    text-align: center;
    min-width: 54px;
  }

  @media (max-width: 810px) {
    & > #date {
      width: 38%;
      font-size: 14px;
    }
    & > #history {
      width: 42%;
      font-size: 16px;
    }
    & > #amount {
      width: 20%;
      font-size: 16px;
    }
  }
`;

const MyCoinWrapperStyled = styled.div`
  width: 80%;
  display: flex;
  justify-content: end;

  @media (max-width: 810px) {
    margin: 10px 0;
  }
`;

const MyCoinStyled = styled.div`
  width: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;

  & > span {
    font-weight: bold;
    margin: 0 4px 0 8px;
  }
`;

const CoinIconStyled = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: end;

  & > svg > path {
    stroke: var(--main-color);
  }
`;

const ButtonContainerStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MoreButtonStyled = styled.button<{
  moreBtnIsLoading: boolean;
}>`
  width: 200px;
  height: 50px;
  margin: 20px auto;
  border: 1px solid var(--main-color);
  border-radius: 30px;
  background-color: var(--white);
  color: var(--main-color);
  position: relative;
`;

const ButtonContentWrapperStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const ButtonTextWrapperStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const SelectIconWrapperStyled = styled.div`
  width: 20px;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 3px;

  & > svg {
    width: 13px;
    height: 9px;
  }

  & > svg > path {
    stroke: var(--main-color);
  }
`;

const EmptyCoinLogTextStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.125rem;
  line-height: 1.75rem;
  color: var(--gray-color);

  & > svg {
    width: 30px;
    height: 30px;
    margin-left: 10px;
  }
`;

export default CoinLog;
