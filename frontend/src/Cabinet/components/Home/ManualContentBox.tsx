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
        <p>{contentData.contentTitle}</p>
      </ContentTextStyled>
      {contentStatus === ContentStatus.STORE && (
        <>
          <StoreCardCircle className="top"></StoreCardCircle>
          <StoreCardCircle className="bottom"></StoreCardCircle>
        </>
      )}

      <MoveBtnImg className="moveButton" />
    </MaunalContentBoxStyled>
  );
};

const StoreCardCircle = styled.div`
  top: -12px;
  right: 193px;
  rotate: 45deg;
  width: 0;
  height: 0;
  border-bottom: 24px solid white;
  border-left: 24px solid transparent;
  position: absolute;

  :hover {
    transition: all 0.3s ease-in-out;
    transform: translateY(-5px);
  }
  &.bottom {
    border-bottom: 24px solid transparent;
    border-left: 24px solid white;
    top: 268px;
  }
`;

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

    /* & > path {
      stroke: ${(props) =>
      props.contentStatus === ContentStatus.EXTENSION
        ? "var(--normal-text-color)"
        : "var(--white-text-with-bg-color)"};
    } */
    & > path {
      stroke: ${(props) =>
        props.contentStatus === ContentStatus.COIN
          ? "var(--sys-default-main-color)"
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
    contentStatus === ContentStatus.COIN &&
    css`
      border: 6px solid var(--sys-main-color);
      color: var(--sys-main-color);
      /* color: var(--custom-purple-200); */
      /* box-shadow: inset 0px 0px 0px 5px var(--bg-color); */
    `}

  ${({ contentStatus }) =>
    contentStatus === ContentStatus.STORE &&
    css`
      width: 620px;
      color: var(--white-text-with-bg-color);
      position: relative; /* Added for positioning the pseudo-element */

      &:after {
        content: "";
        position: absolute;
        top: 0;
        left: 66.67%; /* 3분의 2 지점 */
        height: 100%;
        width: 4px; /* 점선의 가로 너비 */
        background-image: linear-gradient(
          to bottom,
          white 33%,
          rgba(255, 255, 255, 0) 0%
        );
        background-position: right;
        background-size: 10px 30px; /* 점의 세로 크기 10px, 간격 5px */
        background-repeat: repeat-y;
      }
      @media screen and (max-width: 1000px) {
        width: 280px;
        .peopleImg {
          display: none;
        }
        font-size: 21px;
        &:after {
          left: 186.67px; /* 280px의 3분의 2 지점 */
        }
      }
    `}

  ${({ contentStatus }) =>
    contentStatus === ContentStatus.PENDING &&
    css`
      border: 6px double var(--sys-main-color);
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
      props.contentStatus === ContentStatus.COIN
        ? "var(--sys-default-main-color)"
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

  & > span {
    font-weight: 400;
    font-size: 1rem;
  }
`;

export default MaunalContentBox;
