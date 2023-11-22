import { useState } from "react";
import styled from "styled-components";
import MaunalContentBox from "@/components/Home/ManualContentBox";
import ManualModal from "@/components/Modals/ManualModal/ManualModal";
import ContentStatus from "@/types/enum/content.status.enum";

const ServiceManual = ({
  lentStartHandler,
}: {
  lentStartHandler: React.MouseEventHandler;
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedContent, setSelectedContent] = useState<ContentStatus>(
    ContentStatus.PRIVATE
  );

  const openModal = (contentStatus: ContentStatus) => {
    setSelectedContent(contentStatus);
    setIsModalOpen(true);
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
          <article
            className="article"
            onClick={() => openModal(ContentStatus.PRIVATE)}
          >
            <MaunalContentBox contentStatus={ContentStatus.PRIVATE} />
          </article>
          <article
            className="article"
            onClick={() => openModal(ContentStatus.SHARE)}
          >
            <MaunalContentBox contentStatus={ContentStatus.SHARE} />
          </article>
          <article
            className="article"
            onClick={() => openModal(ContentStatus.CLUB)}
          >
            <MaunalContentBox contentStatus={ContentStatus.CLUB} />
          </article>
        </InfoSectionStyled>
        <p className="subtitle">
          공정한 대여를 위한
          <br />
          새로운 사물함 서비스.
        </p>
        <InfoSectionStyled className="section">
          <article
            className="article"
            onClick={() => openModal(ContentStatus.PENDING)}
          >
            <MaunalContentBox contentStatus={ContentStatus.PENDING} />
            <p className="redColor">new</p>
          </article>
          <article
            className="article"
            onClick={() => openModal(ContentStatus.IN_SESSION)}
          >
            <MaunalContentBox contentStatus={ContentStatus.IN_SESSION} />
            <p className="redColor">new</p>
          </article>
        </InfoSectionStyled>
        <p className="subtitle">
          사물함을 더 오래
          <br />
          사용할 수 있는 방법.
        </p>
        <InfoSectionStyled className="section">
          <article
            className="article"
            onClick={() => openModal(ContentStatus.EXTENSION)}
          >
            <MaunalContentBox contentStatus={ContentStatus.EXTENSION} />
          </article>
        </InfoSectionStyled>
      </WrapSectionStyled>

      <button onClick={lentStartHandler}>시작하기</button>
      {isModalOpen && (
        <ManualModal
          contentStatus={selectedContent}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 0;
`;

const TitleContainerStyled = styled.div`
  width: 80%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  border-bottom: 2px solid #d9d9d9;
  margin-bottom: 70px;
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
  width: 80%;
  max-width: 1000px;
  .subtitle {
    font-size: 2.5rem;
    line-height: 1.4;
    text-align: left;
    font-weight: bold;
  }
`;

const InfoSectionStyled = styled.section`
  display: flex;
  margin: 40px 0 60px 0;
  width: 100%;
  max-width: 1500px;
  .article {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px 40px 60px 0;
    :hover {
      transition: all 0.3s ease-in-out;
      transform: translateY(-6px);
      .redColor {
        transition: all 0.3s ease-in-out;
        font-weight: 700;
      }
    }
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
    margin-top: 15px;
  }
  .article > p > span {
    font-weight: 700;
  }
`;

export default ServiceManual;
