import './footer.css'
export default function Footer(){
    return (
        <footer>
            <div className="wholeContainer">
                <div className="textContainer">
                    <a className="textLink" target="_blank" href='https://github.com/innovationacademy-kr/42cabi/issues/new?assignees=&labels=&template=bug_report.md&title='> Report | </a>
                    <a className="textLink" target="_blank" href='https://github.com/innovationacademy-kr/42cabi'> Github </a>
                    <a className="textLink" target="_blank" href='https://www.notion.so/hyunja/42cabi-5fc66d1a6b0a4c48862b2e66e7cf1397'> | Notion</a>
                    <div className="textCopy">© 2022 42Cabi </div>
                </div>
            </div>
        </footer>
    );
}
