import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { myCabinetInfoState } from "@/Cabinet/recoil/atoms";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import { MyCabinetInfoResponseDto } from "@/Cabinet/types/dto/cabinet.dto";
import {
  axiosAGU,
  axiosMyLentInfo,
  axiosReturn,
} from "@/Cabinet/api/axios/axios.custom";
import { getCookie } from "@/Cabinet/api/react_cookie/cookies";
import { formatDate, getExtendedDateString } from "../utils/dateUtils";

const AGUPage = () => {
  const idRef = useRef<HTMLInputElement>(null);
  const [mail, setMail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [myLentInfoState, setMyLentInfoState] =
    useRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const subTitle = "현재 대여중인 사물함 정보입니다. 지금 반납 하시겠습니까?";
  const navigator = useNavigate();
  const token = getCookie("access_token");

  const tryReturnRequest = async (e: React.MouseEvent) => {
    setIsLoading(true);
    try {
      await axiosReturn();
      // setModalTitle("반납되었습니다");
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

  // const formattedDate = formatDate(
  //   myLentInfoState.lents[0].expiredAt,
  //   "/",
  //   4,
  //   2,
  //   2
  // );

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
  const returnDetail = `
   {floor}층 - {section}, {lents[].lentHistoryId}번
 대여기간 : {formattedDate}까지
   `;

  useEffect(() => {
    if (token) getMyLentInfo();
  }, []);

  useEffect(() => {
    console.log("myLentInfoState : ", myLentInfoState);
  }, [myLentInfoState]);

  const handleButtonClick = async () => {
    setIsLoading(true);
    // TODO: animation
    try {
      if (idRef.current) {
        const id = idRef.current.value;
        const response = await axiosAGU(id);
        setMail(response.data.oauthMail);
      }
    } catch (error: any) {
      alert(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WrapperStyled>
      <UtilsSectionStyled></UtilsSectionStyled>
      <HeaderStyled>AGUPage</HeaderStyled>
      {token ? (
        <>
          <SubHeaderStyled>{subTitle}</SubHeaderStyled>
          <button onClick={tryReturnRequest}>네, 반납할게요</button>
          <button onClick={() => navigator("/login")}>취소</button>
        </>
      ) : (
        <>
          <SubHeaderStyled>{mail}</SubHeaderStyled>
          <input ref={idRef} style={{ border: "1px solid black" }}></input>
          <button onClick={handleButtonClick}>버튼</button>
        </>
      )}
      {/* <LoadingAnimation /> */}
      {/* TODO: 이메일 링크 보냈는데 agu인데 사물함 없을때 */}
    </WrapperStyled>
  );
};

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
