import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

interface Itext {
  title: string;
  subTitle: string;
  content: string;
  subContent?: string;
  buttonText?: string;
  buttonHandler?: React.MouseEventHandler<HTMLButtonElement>;
  type: string;
}

const AnnounceTemplate = (props: Itext) => {
  const {
    title,
    subTitle,
    content,
    subContent,
    buttonText,
    buttonHandler,
    type,
  } = props;
  const [backgroundColor, setBackgroundColor] = useState<string>("");

  useEffect(() => {
    if (type === "LOADING") {
      setBackgroundColor("var(--sub-color)");
    } else if (type === "ERROR") {
      setBackgroundColor("var(--main-color)");
    }
  }, []);

  return (
    <AnnounceTemplateStyled backgroundColor={backgroundColor}>
      <TitleStyled>{title}</TitleStyled>
      <CabiImgStyled>
        {type === "ERROR" ? (
          <img src="/src/assets/images/sadCcabiWhite.png"></img>
        ) : (
          <img src="/src/assets/images/happyCcabiWhite.png"></img>
        )}
      </CabiImgStyled>
      <SubTitleStyled>{subTitle}</SubTitleStyled>
      <ContentStyled>
        {content}
        {!!subContent && <span>{subContent}</span>}
      </ContentStyled>
      {buttonHandler && (
        <ButtonStyled onClick={buttonHandler}>{buttonText}</ButtonStyled>
      )}
    </AnnounceTemplateStyled>
  );
};

const AnnounceTemplateStyled = styled.div<{ backgroundColor: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: ${(props) => props.backgroundColor};
  color: var(--color-background);
`;

const TitleStyled = styled.h1`
  font-size: 5rem;
  color: var(--mine);
  font-family: "Do Hyeon", sans-serif;
  filter: drop-shadow(0 0 0.75rem var(--mine));
  text-align: center;
  @media screen and (max-width: 768px) {
    font-size: 3.25rem;
  }
`;

const SubTitleStyled = styled.h2`
  font-size: 2rem;
  margin: 1.5rem 0;
  font-weight: 700;
  text-align: center;
  @media screen and (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ContentStyled = styled.p`
  font-size: 1.25rem;
  margin-bottom: 60px;
  font-weight: 300;
  text-align: center;
  @media screen and (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.5rem;
    margin-bottom: 30px;
    & > span {
      display: block;
    }
  }
`;

const rotate = keyframes`
  from {
    transform: translateY(5%);
  }
  to {
    transform: translateY(-5%) scale(1.1);
  }
`;

const CabiImgStyled = styled.div`
  width: 200px;
  height: 200px;
  margin: 3% 0;
  animation: ${rotate} 0.5s infinite ease alternate;
  @media screen and (max-width: 768px) {
    width: 160px;
    height: 160px;
    margin: 5% 0;
  }
`;

const ButtonStyled = styled.button`
  box-shadow: 10px 10px 40px 0px var(--bg-black-shadow-200);
  /* black shadow 여야함! */
`;

export default AnnounceTemplate;
