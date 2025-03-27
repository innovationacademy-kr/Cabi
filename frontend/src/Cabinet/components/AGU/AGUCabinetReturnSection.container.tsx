import { HttpStatusCode } from "axios";
import { MouseEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { myCabinetInfoState } from "@/Cabinet/recoil/atoms";
import { MyCabinetInfoResponseDto } from "@/Cabinet/types/dto/cabinet.dto";
import {
  axiosAGUReturnCancel,
  axiosReturn,
} from "@/Cabinet/api/axios/axios.custom";
import { formatDate } from "@/Cabinet/utils/dateUtils";
import AGUCabinetReturnSection from "./AGUCabinetReturnSection";

const AGUCabinetReturnSectionContainer = ({
  handleButtonClick,
  isProcessingButtonClick,
}: {
  handleButtonClick: (key: string, callback: () => void) => void;
  isProcessingButtonClick: boolean;
}) => {
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
    }
  };

  const tryReturnCancelRequest = async () => {
    try {
      const response = await axiosAGUReturnCancel();

      if (response.status === HttpStatusCode.Ok) {
        resetMyLentInfo();
      }
    } catch (error: any) {
      alert(error.data);
      console.error(error);
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

    const isAnswerYes =
      confirm(`진행 중인 반납 과정이 초기화되고, 일정 시간 동안 새 인증 메일 발송이 제한됩니다.
페이지를 나가시겠습니까?`);

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
    <AGUCabinetReturnSection
      handleButtonClick={handleButtonClick}
      isProcessingButtonClick={isProcessingButtonClick}
      subHeaderMsg={subHeaderMsg}
      returnDetailMsg={returnDetailMsg}
      tryReturnRequest={tryReturnRequest}
      handlePageExit={handlePageExit}
    />
  );
};

export default AGUCabinetReturnSectionContainer;
