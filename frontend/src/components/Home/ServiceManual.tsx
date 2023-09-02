import { useState } from "react";
import styled from "styled-components";
import MaunalContentBox from "@/components/Home/ManualContentBox";

const ServiceManual = ({
  lentStartHandler,
}: {
  lentStartHandler: React.MouseEventHandler;
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <WrapperStyled id="infoWrap">
      <TitleContainerStyled className="titleContainer">
        <h1 className="title">
          42Cabi <span>이용 안내서</span>
        </h1>
      </TitleContainerStyled>
      <WrapSectionStyled>
        <p className="subtitle">
          가능성의 확장
          <br />
          개인, 공유, 동아리 사물함.
        </p>
        <InfoSectionStyled className="section">
          <article className="article">
            <MaunalContentBox contentStatus={"private"} />
          </article>
          <article className="article">
            <MaunalContentBox contentStatus={"share"} />
          </article>
          <article className="article">
            <MaunalContentBox contentStatus={"club"} />
          </article>
        </InfoSectionStyled>
        <p className="subtitle">
          공정한 대여를 위한
          <br />
          새로운 사물함 상태.
        </p>
        <InfoSectionStyled className="section">
          <article className="article">
            <MaunalContentBox contentStatus={"pending"} />
            <p className="redColor">new</p>
          </article>
          <article className="article">
            <MaunalContentBox contentStatus={"in_session"} />
            <p className="redColor">new</p>
          </article>
        </InfoSectionStyled>
        <p className="subtitle">
          사물함을 더 오래
          <br />
          사용할 수 있는 방법.
        </p>
        <InfoSectionStyled className="section">
          <article className="article">
            <MaunalContentBox contentStatus={"extension"} />
          </article>
        </InfoSectionStyled>
      </WrapSectionStyled>
      <button onClick={lentStartHandler}>시작하기</button>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 70px 0;
`;

const TitleContainerStyled = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  border-bottom: 2px solid #d9d9d9;
  margin-bottom: 100px;
  color: var(--main-color);
  font-weight: 700;
  .logo {
    width: 35px;
    height: 35px;
    margin-bottom: 20px;
  }
  .title {
    font-size: 2.5rem;
    letter-spacing: -0.02rem;
    margin-bottom: 20px;
  }
  .title > span {
    color: black;
  }
`;

const WrapSectionStyled = styled.div`
  width: 70%;
  max-width: 1500px;
  .subtitle {
    font-size: 2.5rem;
    line-height: 1.4;
    text-align: left;
    font-weight: bold;
  }
`;

const InfoSectionStyled = styled.section`
  display: flex;
  margin-top: 40px;
  margin-bottom: 60px;
  width: 100%;
  max-width: 1500px;
  .article {
    //width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 70px;
  }
  .article > h3 {
    min-width: 200px;
    text-align: center;
    font-size: 1.5rem;
    margin: 15px 0;
    font-weight: 700;
  }
  .article > p {
    font-size: 1.125rem;
    line-height: 1.6;
    letter-spacing: -0.02rem;
    text-align: center;
  }
  .redColor {
    color: #ef8172;
    margin: 20px 0 0 140px;
  }
  .article > p > span {
    font-weight: 700;
  }
`;

const AtagStyled = styled.a`
  text-decoration: underline;
  font-weight: 700;
`;

export default ServiceManual;
