import { useState } from "react";
import styled, { css } from "styled-components";

interface MaunalContentBoxProps {
  contentStatus: string;
}

const MaunalContentBox = ({ contentStatus }: MaunalContentBoxProps) => {
  let contentText = "";
  let imagePath = "";
  let background = "";

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  if (contentStatus === "private") {
    contentText = "개인 사물함";
    imagePath = "/src/assets/images/privateIcon.svg";
    background = "linear-gradient(to bottom, #A17BF3, #8337E5)";
  } else if (contentStatus === "share") {
    contentText = "공유 사물함";
    imagePath = "/src/assets/images/shareIcon.svg";
    background = "linear-gradient(to bottom, #7EBFFB, #406EE4)";
  } else if (contentStatus === "club") {
    contentText = "동아리 사물함";
    imagePath = "/src/assets/images/clubIcon.svg";
    background = "linear-gradient(to bottom, #F473B1, #D72766)";
  } else if (contentStatus === "pending") {
    contentText = "오픈예정";
    imagePath = "";
  } else if (contentStatus === "in_session") {
    background = "#9F72FE";
    contentText = "대기중";
    imagePath = "";
  } else if (contentStatus === "extension") {
    contentText = "연장권 이용방법 안내서";
    background = "#F5F5F7";
    imagePath = "/src/assets/images/extensionTicket.svg";
  }

  return (
    <MaunalContentBoxStyled
      background={background}
      contentStatus={contentStatus}
    >
      {contentStatus === "extension" && (
        <img
          className="peopleImg"
          src="/src/assets/images/manualPeople.svg"
          alt=""
        />
      )}
      {contentStatus !== "pending" && contentStatus !== "in_session" && (
        <img className="contentImg" src={imagePath} alt="" />
      )}
      <ContentTextStyeld>
        {contentStatus === "in_session" && (
          <img className="clockImg" src="/src/assets/images/clock.svg" alt="" />
        )}
        <p>{contentText}</p>
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
  contentStatus: string;
}>`
  position: relative;
  width: 320px;
  height: 320px;
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
      ${(props) => (props.contentStatus === "extension" ? 0 : 100)}
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
    contentStatus === "pending" &&
    css`
      border: 5px solid var(--main-color);
      color: var(--main-color);
    `}

  ${({ contentStatus }) =>
    contentStatus === "extension" &&
    css`
      width: 1040px;
      color: black;
    `}
  
    p {
    margin-top: 90px;
    ${({ contentStatus }) =>
      (contentStatus === "pending" || contentStatus === "in_session") &&
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
        props.contentStatus === "pending"
          ? "none"
          : props.contentStatus === "extension"
          ? "0"
          : "100"}
    );
    cursor: pointer;
  }

  :hover {
    box-shadow: 10px 10px 25px 0 rgba(0, 0, 0, 0.2);
    p {
      margin-top: 80px;
      ${({ contentStatus }) =>
        (contentStatus === "pending" || contentStatus === "in_session") &&
        css`
          margin-top: 160px;
        `}
    }
    .clockImg {
      margin-top: 160px;
    }
  }
`;

const ContentTextStyeld = styled.div`
  display: flex;
  align-items: center;
`;

export default MaunalContentBox;
