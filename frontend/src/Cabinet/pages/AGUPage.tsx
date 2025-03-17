import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { myCabinetInfoState } from "@/Cabinet/recoil/atoms";
import AGURequestMail from "@/Cabinet/components/AGU/AGURequestMail";
import AGUReturn from "@/Cabinet/components/AGU/AGUReturn";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import { MyCabinetInfoResponseDto } from "@/Cabinet/types/dto/cabinet.dto";
import { axiosMyLentInfo } from "@/Cabinet/api/axios/axios.custom";
import { getCookie } from "@/Cabinet/api/react_cookie/cookies";

const AGUPage = () => {
  // TODO: animation
  // const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(0);
  const setMyLentInfo =
    useSetRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const aguToken = getCookie("agu_token");

  const getMyLentInfo = async () => {
    // setIsLoading(true);
    try {
      const response = await axiosMyLentInfo();
      setMyLentInfo(response.data);
      setUserId(response.data.lents[0].userId);
    } catch (error) {
      console.error(error);
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    if (aguToken) {
      getMyLentInfo();
      // setIsLoading(true);

      // let timerId = setTimeout(() => {
      //   getMyLentInfo();
      // }, 1000);

      // return () => {
      //   clearTimeout(timerId);
      // };
    }
  }, []);

  return (
    <WrapperStyled>
      {/* {isLoading ? (
        <LoadingAnimation />
      ) : ( */}
      <>
        <UtilsSectionStyled></UtilsSectionStyled>
        <HeaderStyled>A.G.U 사물함 반납</HeaderStyled>
        {aguToken && userId ? (
          <AGUReturn />
        ) : (
          <AGURequestMail
          // setIsLoading={setIsLoading}
          />
        )}
      </>
      {/* )} */}
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
    /* text-decoration: underline; */
  }
`;

export default AGUPage;
