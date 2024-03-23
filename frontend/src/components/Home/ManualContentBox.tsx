import styled, { css, keyframes } from "styled-components";
import { manualContentData } from "@/assets/data/ManualContent";
import { ReactComponent as ClockImg } from "@/assets/images/clock.svg";
import { ReactComponent as ClubIcon } from "@/assets/images/clubIcon.svg";
import { ReactComponent as ExtensionIcon } from "@/assets/images/extension.svg";
import { ReactComponent as ManualPeopleImg } from "@/assets/images/manualPeople.svg";
import { ReactComponent as MoveBtnImg } from "@/assets/images/moveButton.svg";
import { ReactComponent as PrivateIcon } from "@/assets/images/privateIcon.svg";
import { ReactComponent as ShareIcon } from "@/assets/images/shareIcon.svg";
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
        <ManualPeopleImg className="peopleImg" fill="var(--main-color)" />
      )}
      {/* {contentStatus !== ContentStatus.PENDING &&
        contentStatus !== ContentStatus.IN_SESSION && (
          <img className="contentImg" src={contentData.imagePath} alt="" />
        )} */}
      {contentStatus === ContentStatus.PRIVATE && (
        <PrivateIcon className="contentImg" />
      )}
      {contentStatus === ContentStatus.SHARE && (
        <ShareIcon className="contentImg" />
      )}
      {contentStatus === ContentStatus.CLUB && (
        <ClubIcon className="contentImg" />
      )}
      {contentStatus === ContentStatus.EXTENSION && (
        <ExtensionIcon className="contentImg" />
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
  color: var(--color-background);
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

    & > path {
      stroke: ${(props) =>
        props.contentStatus === ContentStatus.EXTENSION
          ? "var(--color-text-normal)"
          : "var(--color-background)"};
      transform: ${(props) =>
        props.contentStatus === ContentStatus.EXTENSION
          ? "scale(1.4)"
          : "scale(3.3)"};
    }
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
      box-shadow: inset 0px 0px 0px 5px var(--color-background);
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
      color: var(--color-text-normal);
      @media screen and (max-width: 1000px) {
        width: 280px;
        .peopleImg {
          display: none;
        }
        font-size: 21px;
      }
    `}
  
    p {
    margin-top: 80px;
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
        ? "var(--color-text-normal)"
        : "var(--color-background)"};
    cursor: pointer;
  }

  :hover {
    transition: all 0.3s ease-in-out;
    ${({ contentStatus }) =>
      contentStatus === ContentStatus.PENDING
        ? css`
            border: 5px double var(--main-color);
            box-shadow: inset 0px 0px 0px 5px var(--color-background),
              10px 10px 25px 0 var(--bg-shadow-200);
          `
        : css`
            box-shadow: 10px 10px 25px 0 var(--bg-shadow-200);
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
