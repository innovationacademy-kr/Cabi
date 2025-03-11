import { useRef, useState } from "react";
import styled from "styled-components";
import { axiosAGU } from "../api/axios/axios.custom";
import LoadingAnimation from "../components/Common/LoadingAnimation";

const AGUPage = () => {
  const idRef = useRef<HTMLInputElement>(null);
  const [mail, setMail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  console.log("AGUPage!!!");
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
