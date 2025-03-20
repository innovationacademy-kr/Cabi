import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { myCabinetInfoState } from "@/Cabinet/recoil/atoms";
import AGUCabinetReturnSection from "@/Cabinet/components/AGU/AGUCabinetReturnSection";
import AGUMailVerificationSection from "@/Cabinet/components/AGU/AGUMailVerificationSection";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import { MyCabinetInfoResponseDto } from "@/Cabinet/types/dto/cabinet.dto";
import { axiosMyLentInfo } from "@/Cabinet/api/axios/axios.custom";
import { getCookie } from "@/Cabinet/api/react_cookie/cookies";
import useDebounce from "@/Cabinet/hooks/useDebounce";

const AGUPage = () => {
  // TODO: animation
  const [isFetchingMyLentInfo, setIsFetchingMyLentInfo] = useState(true);
  const [isProcessingButtonClick, setIsProcessingButtonClick] = useState(false);
  const [userId, setUserId] = useState(0);
  const setMyLentInfo =
    useSetRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const { debounce } = useDebounce();
  const aguToken = getCookie("agu_token");

  const getMyLentInfo = async () => {
    setIsFetchingMyLentInfo(true);
    try {
      const response = await axiosMyLentInfo();
      setMyLentInfo(response.data);
      setUserId(response.data.lents[0].userId);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingMyLentInfo(false);
    }
  };

  useEffect(() => {
    if (aguToken) {
      getMyLentInfo();
    } else setIsFetchingMyLentInfo(false);
  }, []);

  const handleButtonClick = (key: string, callback: () => void) => {
    setIsProcessingButtonClick(true);
    debounce(
      key,
      async () => {
        await callback();
        setIsProcessingButtonClick(false);
      },
      100
    );
  };

  return (
    <WrapperStyled>
      {isFetchingMyLentInfo ? (
        <LoadingAnimation />
      ) : (
        <>
          <UtilsSectionStyled></UtilsSectionStyled>
          <HeaderStyled>A.G.U 사물함 반납</HeaderStyled>
          {aguToken && userId ? (
            <AGUCabinetReturnSection
              handleButtonClick={handleButtonClick}
              isProcessingButtonClick={isProcessingButtonClick}
            />
          ) : (
            <AGUMailVerificationSection
              handleButtonClick={handleButtonClick}
              isProcessingButtonClick={isProcessingButtonClick}
            />
          )}
        </>
      )}
    </WrapperStyled>
  );
};

const WrapperStyled = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow-y: scroll;

  & > button {
    min-width: 290px;
    width: 70%;
  }
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

export const AGUSubHeaderStyled = styled.div`
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
  }
`;

export default AGUPage;
