import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { myCabinetInfoState, serverTimeState } from "@/Cabinet/recoil/atoms";
import ButtonContainer from "@/Cabinet/components/Common/Button";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import { MyCabinetInfoResponseDto } from "@/Cabinet/types/dto/cabinet.dto";
import {
  axiosAGU,
  axiosAGUReturnCancel,
  axiosMyLentInfo,
  axiosReturn,
} from "@/Cabinet/api/axios/axios.custom";
import { getCookie } from "@/Cabinet/api/react_cookie/cookies";
import AGURequestMail from "../components/AGU/AGURequestMail";
import AGUReturn from "../components/AGU/AGUReturn";
import CabinetStatus from "../types/enum/cabinet.status.enum";
import CabinetType from "../types/enum/cabinet.type.enum";

const tmp: MyCabinetInfoResponseDto = {
  building: "새롬관",
  cabinetId: 91,
  floor: 2,
  lentType: CabinetType.PRIVATE,
  lents: [
    {
      expiredAt: new Date("2025-04-12T23:59:59.932478"),
      lentHistoryId: 3,
      name: "jeekim",
      startedAt: new Date("2025-03-12T18:03:19.932478"),
      userId: 2,
    },
  ],
  maxUser: 1,
  memo: "",
  previousUserName: "",
  section: "End of Cluster 1",
  shareCode: -1,
  status: CabinetStatus.FULL,
  statusNote: "",
  title: "",
  visibleNum: 11,
};

const AGUPage = () => {
  // TODO: animation
  const idRef = useRef<HTMLInputElement>(null);
  const [mail, setMail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [myLentInfoState, setMyLentInfoState] =
    useRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const returnSubTitle = `현재 대여중인 사물함 정보입니다. <strong>지금 반납 하시겠습니까?</strong>`;
  const navigator = useNavigate();
  const aguToken = getCookie("agu_token");
  const [serverTime, setServerTime] = useRecoilState<Date>(serverTimeState);
  const [timerTimeInMs, setTimerTimeInMs] = useState(0); // agu code 인증 링크 요청 유효 타이머 시간 ms로 표현
  // TODO : 변수명

  async function getMyLentInfo() {
    try {
      const { data: myLentInfo } = await axiosMyLentInfo();

      setMyLentInfoState(myLentInfo);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (aguToken) getMyLentInfo();
  }, []);

  const handleButtonClick = async () => {
    setIsLoading(true);

    try {
      if (idRef.current) {
        const id = idRef.current.value;
        const response = await axiosAGU(id);
        // TODO: 200일때 alert / 화면 글자
        // {
        //   "oauthMail" : "ㅁㄴㅇㄹ",
        //   "date" : 현재 서버 시각,
        //   "expiryTime": 3
        //  }
        // TODO : response 타입 설정
        setMail(response.data.oauthMail);
        setTimerTimeInMs(response.data.expiryTime * 60 * 1000);
        const formattedServerTime = response.data.date.split(" KST")[0];
        setServerTime(new Date(formattedServerTime)); // 최초 서버 시간
        // TODO : oauthmail, date, expirytime 하나의 객체에 저장?
      }
    } catch (error: any) {
      console.log(error);
      alert(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WrapperStyled>
      <UtilsSectionStyled></UtilsSectionStyled>
      <HeaderStyled>A.G.U 사물함 반납</HeaderStyled>
      {aguToken && myLentInfoState ? (
        <>
          <AGUReturn
            setIsLoading={setIsLoading}
            setMail={setMail}
            navigator={navigator}
            myLentInfoState={myLentInfoState}
          />
          {/* <SubHeaderStyled>{returnSubTitle}</SubHeaderStyled> */}
          {/* <SubHeaderStyled>
            현재 대여중인 사물함 정보입니다.{" "}
            <span>지금 반납 하시겠습니까?</span>
          </SubHeaderStyled>
          <DetailStyled
            dangerouslySetInnerHTML={{ __html: returnDetailMsg! }}
          />
          <ButtonContainer
            onClick={tryReturnRequest}
            text="네, 반납할게요"
            theme="fill"
          />
          <ButtonContainer
            onClick={handleCancelButtonClick}
            text="취소"
            theme="grayLine"
          /> */}
        </>
      ) : (
        <>
          <AGUReturn
            setIsLoading={setIsLoading}
            setMail={setMail}
            navigator={navigator}
            myLentInfoState={tmp}
          />
          {/* <AGURequestMail />
          <SubHeaderStyled>{mail}</SubHeaderStyled>
          <input ref={idRef} style={{ border: "1px solid black" }}></input>
          <button onClick={handleButtonClick}>요청</button> */}
        </>
      )}
      {/* <LoadingAnimation /> */}
      {/* TODO: 이메일 링크 보냈는데 agu인데 사물함 없을때 */}
    </WrapperStyled>
  );
};
/* myLentInfoState
  building:"새롬관"
  cabinetId:91
  floor:2
  lentType:"PRIVATE"
  lents:[{…}] 
  [{
    expiredAt: "2025-04-12T23:59:59.932478"
    lentHistoryId: 3
    name: "jeekim"
    startedAt: "2025-03-12T18:03:19.932478"
    userId: 2}]
  maxUser:1
  memo:""
  previousUserName:null
  section:"End of Cluster 1"
  sessionExpiredAt:null
  shareCode:null
  status:"FULL"
  statusNote:""
  title:""
  visibleNum:11
  */
/*
 2층 - End of Cluster 1, 8번
대여기간 : 2022/12/21 23:59까지
{floor}층 - {section}, {lents[].lentHistoryId}번
대여기간 : {formattedDate}까지
 */

const WrapperStyled = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow-y: scroll;
`;

const UtilsSectionStyled = styled.section`
  width: 70%;
  margin-top: 50px;
`;

const HeaderStyled = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-top: 30px;
`;

const SubHeaderStyled = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: var(--sys-sub-color);
  margin-top: 25px;
  line-height: 1.5;
  word-break: keep-all;
  margin: 25px 10px 0px 10px;
  color: var(--sys-main-color);

  span {
    font-weight: 700;
    text-decoration: underline;
  }
`;

export default AGUPage;
