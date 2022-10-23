import style from "@emotion/styled";

const Footer = style.footer`
  height: 10vh;
  position : fixed;
  left: 50%;
  transform:translateX(-50%);
  font-weight: 400;
  font-size: 0.5rem;
  text-align: center;
  color: #dcdcdc69;
`;

const FooterTemplate = (): JSX.Element => {
  return (
    <Footer>
      <section>
        <a
          target="_blank"
          style={{ color: "#dcdcdc69" }}
          rel="noopener noreferrer"
          href="https://github.com/innovationacademy-kr/42cabi/issues/new?assignees=&labels=&template=bug_report.md&title="
        >
          Report&nbsp;|
        </a>
        <a
          target="_blank"
          style={{ color: "#dcdcdc69" }}
          rel="noopener noreferrer"
          href="https://github.com/innovationacademy-kr/42cabi"
        >
          &nbsp;Github&nbsp;
        </a>
        <a
          target="_blank"
          style={{ color: "#dcdcdc69" }}
          rel="noopener noreferrer"
          href="https://www.notion.so/hyunja/42Cabi-04d8a4beba5d46a9bed5ba565e47c45c"
        >
          |&nbsp;Notion
        </a>
      </section>
      <section>© 2022 42Cabi </section>
    </Footer>
  );
};

export default FooterTemplate;
