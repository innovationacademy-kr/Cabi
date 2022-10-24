import "./footer.css";

export default function Footer() {
  return (
    <footer>
      <div className="wholeContainer">
        <div className="textContainer">
          <a
            className="textLink"
            target="_blank"
            href="https://github.com/innovationacademy-kr/42cabi/issues/new?assignees=&labels=&template=bug_report.md&title="
          >
            {" "}
            Report&nbsp;|{" "}
          </a>
          <a
            className="textLink"
            target="_blank"
            href="https://github.com/innovationacademy-kr/42cabi"
          >
            {" "}
            &nbsp;Github&nbsp;{" "}
          </a>
          <a
            className="textLink"
            target="_blank"
            href="https://hyunja.notion.site/42Cabi-04d8a4beba5d46a9bed5ba565e47c45c"
          >
            {" "}
            |&nbsp;Notion
          </a>
          <div className="textCopy">© 2022 42Cabi </div>
        </div>
      </div>
    </footer>
  );
}
