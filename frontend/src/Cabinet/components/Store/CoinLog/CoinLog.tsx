import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { userState } from "@/Cabinet/recoil/atoms";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import MultiToggleSwitch, {
  toggleItem,
} from "@/Cabinet/components/Common/MultiToggleSwitch";
import UnavailableDataInfo from "@/Cabinet/components/Common/UnavailableDataInfo";
import { ReactComponent as CoinIcon } from "@/Cabinet/assets/images/coinIcon.svg";
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
  itemDetails: string;
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
      if (page === 0) {
        setCoinLogs(response.data.result);
      } else {
        setCoinLogs((prev) =>
          prev ? [...prev, ...response.data.result] : response.data.result
        );
      }
      setLogsLength(response.data.totalLength);
      setMoreButton(response.data.result.length === size);
    } catch (error) {
      console.error("Error getting coin log:", error);
      setMoreButton(false);
    } finally {
      setIsLoading(false);
      setMoreBtnIsLoading(false);
    }
  };

  const clickMoreButton = () => {
    setMoreBtnIsLoading(true);
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    getCoinLog(toggleType);
  }, [page, toggleType]);

  useEffect(() => {
    setPage(0);
    setCoinLogs(null);
    setIsLoading(true);
  }, [toggleType]);

  return (
    <>
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <WrapperStyled>
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
            />
          </MultiToggleSwitchStyled>
          {coinLogs?.length ? (
            <LogItemWrapperStyled>
              {coinLogs.map((log, idx) => (
                <LogItemStyled isEarned={log.amount > 0} key={idx}>
                  <span id="date">
                    {new Date(log.date).toLocaleString("ko-KR", dateOptions)}
                  </span>
                  <span id="history" title={log.history}>
                    {log.history}{" "}
                    {log.itemDetails !== log.history && "- " + log.itemDetails}
                  </span>
                  <span id="amount">
                    {log.amount > 0 ? "+" : ""}
                    {log.amount}
                  </span>
                </LogItemStyled>
              ))}
            </LogItemWrapperStyled>
          ) : (
            <UnavailableDataInfo
              msg={unavailableCoinLogMsgMap[toggleType] + "내역이 없습니다."}
              height="390px"
            />
          )}
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
        </WrapperStyled>
      )}
    </>
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
  width: 70%;
  margin-bottom: 1rem;

  @media (max-width: 1040px) {
    width: 80%;
  }
`;

const LogItemWrapperStyled = styled.div`
  width: 70%;

  @media (max-width: 1040px) {
    width: 80%;
  }
`;

const LogItemStyled = styled.div<{
  isEarned: boolean;
}>`
  margin-top: 10px;
  border-radius: 10px;
  height: 76px;
  border: 1px solid var(--inventory-item-title-border-btm-color);
  padding: 0 20px;
  display: flex;
  text-align: center;
  display: flex;
  align-items: center;

  & > #date {
    color: var(--gray-line-btn-color);
    width: 16%;
    text-align: center;
  }

  & > #history {
    margin-left: 6px;
    font-weight: bold;
    font-size: 18px;
    color: var(--normal-text-color);
    width: 74%;
    text-align: start;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 20px;
  }

  & > #amount {
    color: ${(props) =>
      props.isEarned ? "var(--sys-main-color)" : "var(--normal-text-color)"};
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
  width: 70%;
  display: flex;
  justify-content: end;

  @media (max-width: 1040px) {
    width: 80%;
    margin: 10px 0;
  }
`;

const MyCoinStyled = styled.div`
  width: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;

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
    stroke: var(--sys-main-color);
  }
`;

const ButtonContainerStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const MoreButtonStyled = styled.button<{
  moreBtnIsLoading: boolean;
}>`
  width: 200px;
  height: 50px;
  margin: 20px auto;
  border: 1px solid var(--sys-main-color);
  border-radius: 30px;
  background-color: var(--bg-color);
  color: var(--sys-main-color);
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
    stroke: var(--sys-main-color);
  }
`;

export default CoinLog;
