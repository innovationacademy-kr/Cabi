import { HttpStatusCode } from "axios";
import { MouseEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useResetRecoilState } from "recoil";
import styled from "styled-components";
import { myCabinetInfoState } from "@/Cabinet/recoil/atoms";
import { AGUSubHeaderStyled } from "@/Cabinet/pages/AGUPage";
import ButtonContainer from "@/Cabinet/components/Common/Button";
import { MyCabinetInfoResponseDto } from "@/Cabinet/types/dto/cabinet.dto";
import {
  axiosAGUReturnCancel,
  axiosReturn,
} from "@/Cabinet/api/axios/axios.custom";
import { formatDate } from "@/Cabinet/utils/dateUtils";

const AGUCabinetReturnSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const myLentInfo =
    useRecoilValue<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const resetMyLentInfo = useResetRecoilState(myCabinetInfoState);
  const navigator = useNavigate();
  const subHeaderMsg = `현재 대여중인 사물함 정보입니다. <span>지금 반납 하시겠습니까?</span>`;
  const formattedDate = formatDate(
    myLentInfo ? new Date(myLentInfo.lents[0].expiredAt) : null,
    "/",
    4,
    2,
    2
  );
  const returnDetailMsg = myLentInfo
    ? `<strong>${myLentInfo.floor}층 - ${myLentInfo.section}, ${myLentInfo.visibleNum}번</strong>
대여기간 : <strong>${formattedDate}</strong>까지`
    : "";
  /*
  2층 - End of Cluster 1, 8번
  대여기간 : 2022/12/21 23:59까지
  */

  const tryReturnRequest = async () => {
    // setIsLoading(true);

    try {
      const response = await axiosReturn();

      if (response.status === HttpStatusCode.Ok) {
        alert("반납되었습니다");
        resetMyLentInfo();
        navigator("/login");
      }
    } catch (error: any) {
      alert(error.response.data.message);
      console.error(error);
    } finally {
      // setIsLoading(false);
    }
  };

  const tryReturnCancelRequest = async () => {
    // setIsLoading(true);

    try {
      const response = await axiosAGUReturnCancel();

      if (response.status === HttpStatusCode.Ok) {
        resetMyLentInfo();
      }
    } catch (error: any) {
      alert(error.data);
      console.error(error);
    } finally {
      // setIsLoading(false);
    }
  };

  const handlePageExit = async (
    e: BeforeUnloadEvent | PopStateEvent | MouseEvent,
    url?: string
  ) => {
    if (e.type === "beforeunload") {
      e.preventDefault();
      return;
    }
    const confirmMsg =
      "진행 중인 반납 과정이 초기화되고, 일정 시간 동안 새 인증 메일 발송이 제한됩니다. 페이지를 나가시겠습니까?";
    // TODO: popstate, 취소버튼 클릭시 로그인 페이지로 이동한다는 내용 추가.

    const isAnswerYes = confirm(confirmMsg);

    if (isAnswerYes) {
      await tryReturnCancelRequest();
      if (url) navigator(url);
    }
  };

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      handlePageExit(e, "/login");
    };
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      handlePageExit(e, "/login");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <AGUSubHeaderStyled
        dangerouslySetInnerHTML={{ __html: subHeaderMsg }}
      ></AGUSubHeaderStyled>
      <ReturnDetailWrapper>
        <ReturnDetailMsgStyled
          dangerouslySetInnerHTML={{ __html: returnDetailMsg! }}
        />
      </ReturnDetailWrapper>
      <ButtonContainer
        onClick={tryReturnRequest}
        text="네, 반납할게요"
        theme="fill"
        maxWidth="500px"
      />
      <ButtonContainer
        onClick={(e) => {
          handlePageExit(e, "/login");
        }}
        text="취소"
        theme="grayLine"
        maxWidth="500px"
      />
    </>
  );
};

const ReturnDetailWrapper = styled.div`
  height: 100px;
  max-width: 500px;
  width: 100%;
  border-radius: 10px;
  border: 1px solid #d9d9d9;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 42px 0;
`;

const ReturnDetailMsgStyled = styled.div`
  letter-spacing: -0.02rem;
  line-height: 1.5rem;
  font-size: 1rem;
  white-space: break-spaces;
  text-align: center;
`;

export default AGUCabinetReturnSection;
