import style from "@emotion/styled";

const Footer = style.footer`
  width: 100%;
  height: 0.5rem;
  bottom: 0rem;
  left: 0;
  right: 0;
  margin: 0;
  position: fixed;
  a {
    display: inline-block;
    font-weight: bolder;
    margin: 0;
    color: rgba(220, 220, 220, 0.413);
    &visited {
      color: rgba(220, 220, 220, 0.413);
    }
  }
  div {
    color: rgba(220, 220, 220, 0.413);
    font-weight: bolder;
  }
`;

const WholeContainer = style.div`
  width: 100vw;
  position: absolute;
  display: flex;
  bottom: 0%;
  align-items: center;
  justify-content: center;
`;

const TextContainer = style.div`
  font-size: x-small;
  position: absolute;
  bottom: 0;
  display: flexbox;
  width: 100%;
  justify-content: center;
  text-align: center;
  color: rgba(220, 220, 220, 0.413);
  font-weight: bolder;
`;

const TextCopy = style.div`
  bottom: 0vh;
  right: 0vw;
  padding: 0;
  font-weight: 100;
  font-size: 1em;
  text-align: center;
`;

const TextLink = style.a`
  bottom: 0vh;
  right: 0vw;
  padding: 0;
  text-align: center;
`;

const FooterTemplate = (): JSX.Element => {
  return (
    <Footer>
      <WholeContainer>
        <TextContainer>
          <TextLink
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/innovationacademy-kr/42cabi/issues/new?assignees=&labels=&template=bug_report.md&title="
          >
            {" "}
            Report&nbsp;|{" "}
          </TextLink>
          <TextLink
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/innovationacademy-kr/42cabi"
          >
            {" "}
            &nbsp;Github&nbsp;{" "}
          </TextLink>
          <TextLink
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.notion.so/hyunja/42cabi-5fc66d1a6b0a4c48862b2e66e7cf1397"
          >
            {" "}
            |&nbsp;Notion
          </TextLink>
          <TextCopy>© 2022 42Cabi </TextCopy>
        </TextContainer>
      </WholeContainer>
    </Footer>
  );
};

export default FooterTemplate;
