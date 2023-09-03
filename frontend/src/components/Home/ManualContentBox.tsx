import styled, { css, keyframes } from "styled-components";
import { manualContentData } from "@/assets/data/ManualContent";
import ContentStatus from "@/types/enum/content.status.enum";

interface MaunalContentBoxProps {
  contentStatus: ContentStatus;
}

const MaunalContentBox = ({ contentStatus }: MaunalContentBoxProps) => {
  const contentData = manualContentData[contentStatus];

  return (
    <MaunalContentBoxStyled
      background={contentData.background}
      contentStatus={contentStatus}
    >
      {contentStatus === ContentStatus.EXTENSION && (
        <img
          className="peopleImg"
          src="/src/assets/images/manualPeople.svg"
          alt=""
        />
      )}
      {contentStatus !== ContentStatus.PENDING &&
        contentStatus !== ContentStatus.IN_SESSION && (
          <img className="contentImg" src={contentData.imagePath} alt="" />
        )}
      <ContentTextStyeld>
        {contentStatus === ContentStatus.IN_SESSION && (
          <img className="clockImg" src="/src/assets/images/clock.svg" alt="" />
        )}
        <p>{contentData.contentTitle}</p>
      </ContentTextStyeld>
      <img
        className="moveButton"
        src="/src/assets/images/moveButton.svg"
        alt=""
      />
    </MaunalContentBoxStyled>
  );
};

const MaunalContentBoxStyled = styled.div<{
  background: string;
  contentStatus: ContentStatus;
}>`
  position: relative;
  width: 300px;
  height: 300px;
  border-radius: 40px;
  background: ${(props) => props.background};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 32px;
  color: white;
  padding: 25px;
  margin-right: 40px;
  font-weight: bold;
  cursor: pointer;

  .clockImg {
    width: 35px;
    height: 35px;
    filter: brightness(100);
    margin-right: 10px;
    margin-top: 170px;
  }

  .contentImg {
    width: 80px;
    height: 80px;
    filter: brightness(
      ${(props) => (props.contentStatus === ContentStatus.EXTENSION ? 0 : 100)}
    );
  }

  .peopleImg {
    width: 210px;
    height: 500px;
    z-index: 1;
    position: absolute;
    right: 100px;
    bottom: 30px;
  }

  ${({ contentStatus }) =>
    contentStatus === ContentStatus.PENDING &&
    css`
      border: 5px solid var(--main-color);
      color: var(--main-color);
    `}

  ${({ contentStatus }) =>
    contentStatus === ContentStatus.IN_SESSION &&
    css`
      animation: ${Animation} 3s infinite;
    `}

  ${({ contentStatus }) =>
    contentStatus === ContentStatus.EXTENSION &&
    css`
      width: 960px;
      color: black;
    `}
  
    p {
    margin-top: 90px;
    ${({ contentStatus }) =>
      (contentStatus === ContentStatus.PENDING ||
        contentStatus === ContentStatus.IN_SESSION) &&
      css`
        margin-top: 170px;
      `}
  }

  .moveButton {
    width: 50px;
    height: 16px;
    position: absolute;
    right: 35px;
    bottom: 35px;
    filter: brightness(
      ${(props) =>
        props.contentStatus === ContentStatus.PENDING
          ? "none"
          : props.contentStatus === ContentStatus.EXTENSION
          ? "0"
          : "100"}
    );
    cursor: pointer;
  }

  :hover {
    transition: all 0.3s ease-in-out;
    box-shadow: 10px 10px 25px 0 rgba(0, 0, 0, 0.2);
    p {
      transition: all 0.3s ease-in-out;
      margin-top: 85px;
      ${({ contentStatus }) =>
        (contentStatus === ContentStatus.PENDING ||
          contentStatus === ContentStatus.IN_SESSION) &&
        css`
          margin-top: 165px;
        `}
    }
    .clockImg {
      transition: all 0.3s ease-in-out;
      margin-top: 165px;
    }
  }
`;

const Animation = keyframes`
  0%, 100% {
    background-color: var(--main-color);
  }
  50% {
    background-color: #eeeeee;
  }
`;

const ContentTextStyeld = styled.div`
  display: flex;
  align-items: center;
`;

export default MaunalContentBox;
