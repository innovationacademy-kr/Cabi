import { useState } from "react";
import styled from "styled-components";
import MaunalContentBox from "@/Cabinet/components/Home/ManualContentBox";
import ManualModal from "@/Cabinet/components/Modals/ManualModal/ManualModal";
import ContentStatus from "@/Cabinet/types/enum/content.status.enum";

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

  const openNotionLink = () => {
    window.open("https://cabi.oopy.io/0bbb08a2-241c-444b-8a96-6b33c3796451");
  };

  return (
    <WrapperStyled id="infoWrap">
      <TitleContainerStyled className="titleContainer">
        <h1 className="title">
          Cabi <span>이용 안내서</span>
        </h1>
        <NotionBtn className="button" onClick={openNotionLink}>
          상세보기
        </NotionBtn>
      </TitleContainerStyled>

      <WrapSectionStyled>
        <p className="subtitle">
          당신의 사물함
          <br />
          당신의 방식으로,
        </p>

        {/* <TicketWrapperStyled>
          <TicketStyled />
        </TicketWrapperStyled> */}

        <InfoSectionStyled className="section">
          <article
            className="article"
            onClick={() => openModal(ContentStatus.COIN)}
          >
            <MaunalContentBox contentStatus={ContentStatus.COIN} />
            {/* <p className="redColor">new</p> */}
          </article>
          <TicketWrapperStyled>
            <article
              className="article"
              onClick={() => openModal(ContentStatus.STORE)}
            >
              <MaunalContentBox contentStatus={ContentStatus.STORE} />
              {/* <p className="redColor">new</p> */}
            </article>
          </TicketWrapperStyled>
        </InfoSectionStyled>

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
            onClick={() => openModal(ContentStatus.IN_SESSION)}
          >
            <MaunalContentBox contentStatus={ContentStatus.IN_SESSION} />
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

const TicketWrapperStyled = styled.div`
  width: 620px;
  &:hover {
    transition: all 0.3s ease-in-out;
    transform: translateY(-5px);
    /* filter: drop-shadow(10px 10px 8px rgba(0, 0, 0, 0.2)); */
    filter: drop-shadow(10px 10px 10px var(--left-nav-border-shadow-color));
  }
`;
// 16.794
const TicketStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 24px;
  font-weight: bold;
  width: 620px;
  height: 300px;
  position: relative;
  background: linear-gradient(
    to bottom,
    var(--ref-purple-400),
    var(--ref-purple-600)
  );
  border-radius: 40px;
  clip-path: path(
    "M 0 175
    A 25 25 1 0 0 0 125
    L 0 0
    L 396.56 0
    L 413.354 16.794
    L 430.148 0
    L 620 0
    L 620 300
    L 430.148 300
    L 413.354 283.206
    L 396.56 300
    L 0 300
    Z"
  );
  /* Explanation of path:
  - M 0 175: Move to (0, 175)
  - A 25 25 1 0 0 0 125: Draw an arc with radius 25, starting from (0, 175) to (0, 125) // radius-x, radius-y, x-axis-rotation, large-arc-flag, sweep-flag, x, y
  - L 0 0: Draw a line from (0, 125) to (0, 0)
  - L 396.56 0: Draw a line from (0, 0) to (396.56, 0)
  - L 413.354 16.794: Draw a line from (396.56, 0) to (413.354, 16.794)
  - L 430.148 0: Draw a line from (413.354, 16.794) to (430.148, 0)
  - L 620 0: Draw a line from (430.148, 0) to (620, 0)
  - L 620 300: Draw a line from (620, 0) to (620, 300)
  - L 430.148 300: Draw a line from (620, 300) to (430.148, 300)
  - L 413.354 283.206: Draw a line from (430.148, 300) to (413.354, 283.206)
  - L 396.56 300: Draw a line from (413.354, 283.206) to (396.56, 300)
  - L 0 300: Draw a line from (396.56, 300) to (0, 300)
  - Z: Close the path
  */
  &:after {
    content: "";
    position: absolute;
    top: 25px;
    right: 32.99%; /* 2/3 point */
    height: 90%;
    width: 4px;
    background-image: linear-gradient(
      to bottom,
      white 33%,
      rgba(255, 255, 255, 0) 0%
    );
    background-position: right;
    background-size: 10px 30px;
    background-repeat: repeat-y;
  }
`;

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
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--service-man-title-border-btm-color);
  margin-bottom: 70px;
  color: var(--sys-main-color);
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
    color: var(--normal-text-color);
  }
`;

const NotionBtn = styled.button`
  width: 120px;
  height: 40px;
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--notion-btn-text-color);
  background: var(--bg-color);
  border: 1px solid var(--line-color);
  :hover {
    color: var(--normal-text-color);
    font-weight: 400;
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
    color: var(--normal-text-color);
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
    color: var(--ref-orange-200);
    margin-top: 15px;
  }
  .article > p > span {
    font-weight: 700;
  }
`;

export default ServiceManual;
