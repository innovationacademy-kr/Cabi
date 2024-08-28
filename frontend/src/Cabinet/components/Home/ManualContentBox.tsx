import styled, { css, keyframes } from "styled-components";
import { manualContentData } from "@/Cabinet/assets/data/ManualContent";
import { ContentStatusStylesMap } from "@/Cabinet/assets/data/maps";
import { ReactComponent as ManualPeopleImg } from "@/Cabinet/assets/images/manualPeople.svg";
import { ReactComponent as MoveBtnImg } from "@/Cabinet/assets/images/moveButton.svg";
import ContentStatus from "@/Cabinet/types/enum/content.status.enum";

interface ManualContentBoxProps {
  contentStatus: ContentStatus;
}

const ManualContentBox = ({ contentStatus }: ManualContentBoxProps) => {
  const contentData = manualContentData[contentStatus];

  return (
    <ManualContentBoxStyled
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

      <MoveBtnImg className="moveButton" />
    </ManualContentBoxStyled>
  );
};

const Rotation = keyframes`
 to {
   transform : rotate(360deg)
	}
  `;

const ManualContentBoxStyled = styled.div<{
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

  ${(props) => ContentStatusStylesMap[props.contentStatus]}

  .clockImg {
    width: 35px;
    margin-right: 10px;
    margin-top: 160px;
    animation: ${Rotation} 1s linear infinite;
    stroke: var(--sys-default-main-color);
  }

  .contentImg {
    width: 80px;
    height: 80px;

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
    fill: var(--sys-def-main-color);
  }

  p {
    margin-top: 90px;
    ${({ contentStatus }) =>
      (contentStatus === ContentStatus.PENDING ||
        contentStatus === ContentStatus.COIN ||
        contentStatus === ContentStatus.IN_SESSION) &&
      css`
        /* margin-top: 160px; */
        color: var(--sys-default-main-color);
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

  &:hover {
    transition: all 0.3s ease-in-out;
    ${({ contentStatus }) =>
      contentStatus === ContentStatus.PENDING
        ? css`
            border: 5px double var(--sys-default-main-color);
            box-shadow: inset 0px 0px 0px 5px var(--bg-color);
            filter: drop-shadow(
              10px 10px 10px var(--left-nav-border-shadow-color)
            );
          `
        : contentStatus === ContentStatus.STORE
        ? css`` // No box-shadow or filter for STORE status
        : css`
            filter: drop-shadow(
              10px 10px 10px var(--left-nav-border-shadow-color)
            );
          `}

    p {
      transition: all 0.3s ease-in-out;
      transform: translateY(-5px);
      ${({ contentStatus }) =>
        (contentStatus === ContentStatus.PENDING ||
          contentStatus === ContentStatus.COIN ||
          contentStatus === ContentStatus.IN_SESSION) &&
        css`
          /* margin-top: 155px; */
          color: var(--sys-default-main-color);
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

export default ManualContentBox;
