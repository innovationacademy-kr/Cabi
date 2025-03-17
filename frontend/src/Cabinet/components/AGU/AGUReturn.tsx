import { HttpStatusCode } from "axios";
import { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { myCabinetInfoState } from "@/Cabinet/recoil/atoms";
import ButtonContainer from "@/Cabinet/components/Common/Button";
import { DetailStyled } from "@/Cabinet/components/Modals/Modal";
import { MyCabinetInfoResponseDto } from "@/Cabinet/types/dto/cabinet.dto";
import {
  axiosAGUReturnCancel,
  axiosReturn,
} from "@/Cabinet/api/axios/axios.custom";
import { axiosMyLentInfo } from "@/Cabinet/api/axios/axios.custom";
import { formatDate } from "@/Cabinet/utils/dateUtils";

// TODO : 파일/컴포넌트 이름 변경
const AGUReturn = ({
  setIsLoading,
  setMail,
  mail,
  aguToken,
}: {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setMail: React.Dispatch<React.SetStateAction<string>>;
  mail: string;
  aguToken: string;
}) => {
  const [myLentInfoState, setMyLentInfoState] =
    useRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const navigator = useNavigate();
  const formattedDate = formatDate(
    myLentInfoState ? new Date(myLentInfoState.lents[0].expiredAt) : null,
    "/",
    4,
    2,
    2
  );
  const returnDetailMsg = myLentInfoState
    ? `<strong>${myLentInfoState.floor}층 - ${myLentInfoState.section}, ${myLentInfoState.visibleNum}번</strong>
대여기간 : <strong>${formattedDate}</strong>까지`
    : "";

  useEffect(() => {
    if (aguToken) getMyLentInfo();
  }, []);

  const getMyLentInfo = async () => {
    try {
      const { data: myLentInfo } = await axiosMyLentInfo();

      setMyLentInfoState(myLentInfo);
    } catch (error) {
      console.error(error);
    }
  };

  const tryReturnRequest = async (e: React.MouseEvent) => {
    setIsLoading(true);

    try {
      const response = await axiosReturn();
      console.log("tryReturnRequest response : ", response);
      if (response.status === HttpStatusCode.Ok) {
        alert("반납되었습니다");
        // setMyLentInfoState(undefined);
        // TODO : setMyLentInfoState 초기값으로 설정
      }
    } catch (error: any) {
      alert(error.response.data.message);
    } finally {
      setIsLoading(false);
      setMail("");
      // TODO : idRef.current.value = "";
      // TODO : 취소 버튼 눌러도. 로그인 페이지로 가도. 그냥 현재 화면을 벗어나면.
      navigator("/login");
    }
  };

  const tryReturnCancelRequest = async () => {
    setIsLoading(true);

    try {
      const response = await axiosAGUReturnCancel();
      console.log("tryReturnCancelRequest response : ", response);
      if (response.status === 200) {
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
      setIsLoading(false);
      // setShowResponseModal(true);
    }
  };

  const handleCancelButtonClick = () => {
    const answer = confirm(
      "다시 처음부터 해야되고 메일 요청 시간 만료안됐으면 기다려야됨. 그래도 진행?"
    );

    if (answer) {
      //
      tryReturnCancelRequest();
      setMail("");
    }
  };
  const subHeaderMsg = `현재 대여중인 사물함 정보입니다. <span>지금 반납 하시겠습니까?</span>`;
  //   TODO : 부모 컴포넌트에서 재사용?

  if (mail)
    return (
      <>
        <SubHeaderStyled
          dangerouslySetInnerHTML={{ __html: subHeaderMsg }}
        ></SubHeaderStyled>
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
          onClick={handleCancelButtonClick}
          text="취소"
          theme="grayLine"
          maxWidth="500px"
        />
      </>
    );
  return null;
  // mail 없는거면 내 대여 정보 불러오지 못했다는거.
};

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

export default AGUReturn;
