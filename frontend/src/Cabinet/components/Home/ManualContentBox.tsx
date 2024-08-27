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
      {contentStatus === ContentStatus.STORE && (
        <>
          <StoreCardCircle className="top"></StoreCardCircle>
          <StoreCardCircle className="bottom"></StoreCardCircle>
        </>
      )}

      <MoveBtnImg className="moveButton" />
    </ManualContentBoxStyled>
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

  &:hover {
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
          contentStatus === ContentStatus.COIN ||
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

export default ManualContentBox;
