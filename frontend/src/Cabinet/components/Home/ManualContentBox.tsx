import styled, { css, keyframes } from "styled-components";
import { manualContentData } from "@/Cabinet/assets/data/ManualContent";
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
        <ManualPeopleImg className="peopleImg" />
      )}
      {contentStatus !== ContentStatus.IN_SESSION &&
        contentData.iconComponent && (
          <contentData.iconComponent className="contentImg" />
        )}
      <ContentTextStyled>
        {contentStatus === ContentStatus.IN_SESSION &&
          contentData.iconComponent && (
            <contentData.iconComponent className="clockImg" />
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
  color: var(--white-text-with-bg-color);
  padding: 25px;
  font-weight: bold;
  cursor: pointer;

  .clockImg {
    width: 35px;
    margin-right: 10px;
    margin-top: 160px;
    animation: ${Rotation} 1s linear infinite;
    stroke: var(--sys-main-color);
  }

  .contentImg {
    width: 80px;
    height: 80px;

    & > path {
      stroke: ${(props) =>
        props.contentStatus === ContentStatus.EXTENSION
          ? "var(--normal-text-color)"
          : "var(--white-text-with-bg-color)"};
    }
  }

  .peopleImg {
    width: 220px;
    height: 500px;
    z-index: 1;
    position: absolute;
    right: 100px;
    bottom: 30px;
    fill: var(--sys-main-color);
  }

  ${({ contentStatus }) =>
    contentStatus === ContentStatus.PENDING &&
    css`
      border: 5px double var(--sys-main-color);
      box-shadow: inset 0px 0px 0px 5px var(--bg-color);
    `}

  ${({ contentStatus }) =>
    contentStatus === ContentStatus.IN_SESSION &&
    css`
      border: 5px solid var(--sys-main-color);
      color: var(--sys-main-color);
    `}

  ${({ contentStatus }) =>
    contentStatus === ContentStatus.EXTENSION &&
    css`
      width: 900px;
      color: var(--normal-text-color);
      @media screen and (max-width: 1000px) {
        width: 280px;
        .peopleImg {
          display: none;
        }
        font-size: 21px;
      }
    `}
  
    p {
    margin-top: 90px;
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
        ? "var(--sys-main-color)"
        : props.contentStatus === ContentStatus.EXTENSION
        ? "var(--normal-text-color)"
        : "var(--white-text-with-bg-color)"};
    cursor: pointer;
  }

  :hover {
    transition: all 0.3s ease-in-out;
    ${({ contentStatus }) =>
      contentStatus === ContentStatus.PENDING
        ? css`
            border: 5px double var(--sys-main-color);
            box-shadow: inset 0px 0px 0px 5px var(--bg-color),
              10px 10px 25px 0 var(--left-nav-border-shadow-color);
          `
        : css`
            box-shadow: 10px 10px 25px 0 var(--left-nav-border-shadow-color);
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
