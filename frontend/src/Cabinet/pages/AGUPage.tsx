import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { myCabinetInfoState, serverTimeState } from "@/Cabinet/recoil/atoms";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import { MyCabinetInfoResponseDto } from "@/Cabinet/types/dto/cabinet.dto";
import {
  axiosAGU,
  axiosMyLentInfo,
  axiosReturn,
} from "@/Cabinet/api/axios/axios.custom";
import { getCookie } from "@/Cabinet/api/react_cookie/cookies";
import { formatDate } from "@/Cabinet/utils/dateUtils";

const AGUPage = () => {
  const idRef = useRef<HTMLInputElement>(null);
  const [mail, setMail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [myLentInfoState, setMyLentInfoState] =
    useRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const subTitle = "현재 대여중인 사물함 정보입니다. 지금 반납 하시겠습니까?";
  const navigator = useNavigate();
  const aguToken = getCookie("agu_token");
  const [serverTime, setServerTime] = useRecoilState<Date>(serverTimeState);
  const [timerTimeInMs, setTimerTimeInMs] = useState(0); // 유효 타이머 시간 ms로 표현
  // TODO : 변수명
  const tryReturnRequest = async (e: React.MouseEvent) => {
    setIsLoading(true);
    try {
      const response = await axiosReturn();
      // setModalTitle("반납되었습니다");
      console.log("tryReturnRequest response : ", response);
      if (response.status === 200) {
        alert("success");
        navigator("/login");
      }
    } catch (error: any) {
      alert(error.data);
      console.log(error);
      // if (error.response.status === 418) {
      //   props.closeModal(e);
      //   props.handleOpenPasswordCheckModal();
      //   return;
      // }
      // setHasErrorOnResponse(true);
    } finally {
      // setIsLoading(false);
      // setShowResponseModal(true);
    }
  };

  async function getMyLentInfo() {
    try {
      const { data: myLentInfo } = await axiosMyLentInfo();

      setMyLentInfoState(myLentInfo);
    } catch (error) {
      console.error(error);
    }
  }

  const formattedDate = formatDate(
    myLentInfoState ? new Date(myLentInfoState.lents[0].expiredAt) : null,
    "/",
    4,
    2,
    2
  );

  const returnDetail = `
     ${myLentInfoState?.floor}층 - ${myLentInfoState?.section}, ${myLentInfoState?.visibleNum}번
   대여기간 : ${formattedDate}까지
     `;

  useEffect(() => {
    if (aguToken) getMyLentInfo();
  }, []);

  const handleButtonClick = async () => {
    setIsLoading(true);
    // TODO: animation

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
      <HeaderStyled>AGUPage</HeaderStyled>
      {aguToken ? (
        <>
          <SubHeaderStyled>{subTitle}</SubHeaderStyled>
          <>{returnDetail}</>
          <button onClick={tryReturnRequest}>네, 반납할게요</button>
          <button onClick={() => navigator("//")}>취소</button>
        </>
      ) : (
        <>
          <SubHeaderStyled>{mail}</SubHeaderStyled>
          <input ref={idRef} style={{ border: "1px solid black" }}></input>
          <button onClick={handleButtonClick}>요청</button>
        </>
      )}
      {/* <LoadingAnimation /> */}
      {/* TODO: 이메일 링크 보냈는데 agu인데 사물함 없을때 */}
    </WrapperStyled>
  );
};
/*
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
//  const returnDetail = `${
//    myLentInfoState &&
//    myLentInfoState.lents.length &&
//    `대여기간은 <strong>${myLentInfoState} 23:59</strong>까지 입니다.`
//   }

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
  display: flex;
  flex-direction: column;
  align-items: center;
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
