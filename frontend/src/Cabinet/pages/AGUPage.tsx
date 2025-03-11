import { useEffect, useRef, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { axiosAGU, axiosMyLentInfo } from "../api/axios/axios.custom";
import { getCookie } from "../api/react_cookie/cookies";
import LoadingAnimation from "../components/Common/LoadingAnimation";
import { myCabinetInfoState } from "../recoil/atoms";
import { MyCabinetInfoResponseDto } from "../types/dto/cabinet.dto";

const token = getCookie("access_token");

const AGUPage = () => {
  const idRef = useRef<HTMLInputElement>(null);
  const [mail, setMail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [myLentInfoState, setMyLentInfoState] =
    useRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  // const setMyLentInfoState =
  //   useSetRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);

  async function getMyLentInfo() {
    try {
      const { data: myLentInfo } = await axiosMyLentInfo();

      setMyLentInfoState(myLentInfo);
      console.log("getMyLentInfo : ", myLentInfo);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    console.log("token : ", token);
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
      {/* <LoadingAnimation /> */}
      <UtilsSectionStyled></UtilsSectionStyled>
      <HeaderStyled>AGUPage</HeaderStyled>
      <SubHeaderStyled>{mail}</SubHeaderStyled>
      <input ref={idRef} style={{ border: "1px solid black" }}></input>
      <button onClick={handleButtonClick}>버튼</button>
    </WrapperStyled>
  );
};

{
  /* <button onClick={handleButtonClick}>버튼2</button> */
}
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
