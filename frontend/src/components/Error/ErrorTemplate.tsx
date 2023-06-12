import styled, { keyframes } from "styled-components";

interface Itext {
  id?: string;
  title: string;
  subTitle: string;
  content: string;
  subContent?: string;
  buttonText: string;
  buttonHandler: React.MouseEventHandler<HTMLButtonElement>;
}

const ErrorTemplate = (props: Itext) => {
  const {
    id,
    title,
    subTitle,
    content,
    subContent,
    buttonText,
    buttonHandler,
  } = props;

  return (
    <ErrorTemplateStyled id={id}>
      <TitleStyled>{title}</TitleStyled>
      <CabiImgStyled>
        <img src="/src/assets/images/sadCcabiWhite.png" alt="sad_cabi" />
      </CabiImgStyled>
      <SubTitleStyled>{subTitle}</SubTitleStyled>
      <ContentStyled>
        {content}
        {!!subContent && <span>{subContent}</span>}
      </ContentStyled>
      <ButtonStyled onClick={buttonHandler}>{buttonText}</ButtonStyled>
    </ErrorTemplateStyled>
  );
};

const ErrorTemplateStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: var(--main-color);
  color: var(--white);
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
  box-shadow: 10px 10px 40px 0px rgba(0, 0, 0, 0.25);
`;

export default ErrorTemplate;
