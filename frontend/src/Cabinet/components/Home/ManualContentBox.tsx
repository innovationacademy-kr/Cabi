import styled, { css, keyframes } from "styled-components";
import { manualContentData } from "@/Cabinet/assets/data/ManualContent";
import { ReactComponent as ClockImg } from "@/Cabinet/assets/images/clock.svg";
import { ReactComponent as ManualPeopleImg } from "@/Cabinet/assets/images/manualPeople.svg";
import { ReactComponent as MoveBtnImg } from "@/Cabinet/assets/images/moveButton.svg";
import ContentStatus from "@/Cabinet/types/enum/content.status.enum";

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
        <ManualPeopleImg className="peopleImg" fill="var(--main-color)" />
      )}
      {contentStatus !== ContentStatus.PENDING &&
        contentStatus !== ContentStatus.IN_SESSION && (
          <img className="contentImg" src={contentData.imagePath} alt="" />
        )}
      <ContentTextStyled>
        {contentStatus === ContentStatus.IN_SESSION && (
          <ClockImg stroke="var(--main-color)" className="clockImg" />
        )}
        <p>{contentData.contentTitle}</p>
      </ContentTextStyled>
      <MoveBtnImg className="moveButton" />
    </MaunalContentBoxStyled>
  );
};

const Rotation = keyframes`
 to {
		transform : rotate(360deg)
	}
`;

const MaunalContentBoxStyled = styled.div<{
  background: string;
  contentStatus: ContentStatus;
}>`
  position: relative;
  width: 280px;
  height: 280px;
  border-radius: 40px;
  background: ${(props) => props.background};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 1.75rem;
  color: white;
  padding: 25px;
  font-weight: bold;
  cursor: pointer;
  .clockImg {
    width: 35px;
    margin-right: 10px;
    margin-top: 160px;
    animation: ${Rotation} 1s linear infinite;
  }

  .contentImg {
    width: 80px;
    height: 80px;
    filter: brightness(
      ${(props) => (props.contentStatus === ContentStatus.EXTENSION ? 0 : 100)}
    );
  }

  .peopleImg {
    width: 220px;
    height: 500px;
    z-index: 1;
    position: absolute;
    right: 100px;
    bottom: 30px;
  }

  ${({ contentStatus }) =>
    contentStatus === ContentStatus.PENDING &&
    css`
      border: 5px double var(--main-color);
      box-shadow: inset 0px 0px 0px 5px var(--white);
    `}

  ${({ contentStatus }) =>
    contentStatus === ContentStatus.IN_SESSION &&
    css`
      border: 5px solid var(--main-color);
      color: var(--main-color);
    `}

  ${({ contentStatus }) =>
    contentStatus === ContentStatus.EXTENSION &&
    css`
      width: 900px;
      color: black;
      @media screen and (max-width: 1000px) {
        width: 280px;
        .peopleImg {
          display: none;
        }
        font-size: 21px;
      }
    `}
  
    p {
    margin-top: 120px;
    ${({ contentStatus }) =>
      (contentStatus === ContentStatus.PENDING ||
        contentStatus === ContentStatus.IN_SESSION) &&
      css`
        margin-top: 160px;
      `}
  }

  .moveButton {
    width: 50px;
    height: 16px;
    position: absolute;
    right: 35px;
    bottom: 35px;
    stroke: ${(props) =>
      props.contentStatus === ContentStatus.IN_SESSION
        ? "var(--main-color)"
        : props.contentStatus === ContentStatus.EXTENSION
        ? "black"
        : "white"};
    cursor: pointer;
  }

  :hover {
    transition: all 0.3s ease-in-out;
    ${({ contentStatus }) =>
      contentStatus === ContentStatus.PENDING
        ? css`
            border: 5px double var(--main-color);
            box-shadow: inset 0px 0px 0px 5px var(--white),
              10px 10px 25px 0 rgba(0, 0, 0, 0.2);
          `
        : css`
            box-shadow: 10px 10px 25px 0 rgba(0, 0, 0, 0.2);
          `}
    p {
      transition: all 0.3s ease-in-out;
      transform: translateY(-5px);
      ${({ contentStatus }) =>
        (contentStatus === ContentStatus.PENDING ||
          contentStatus === ContentStatus.IN_SESSION) &&
        css`
          margin-top: 155px;
        `}
    }
    .clockImg {
      transition: all 0.3s ease-in-out;
      margin-top: 145px;
    }
  }
`;

const ContentTextStyled = styled.div`
  display: flex;
  align-items: center;
`;

export default MaunalContentBox;
