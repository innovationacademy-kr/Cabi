import './footer.css'
export default function Footer(){
    return (
        <footer>
            {/* <a className="link" href='https://github.com/innovationacademy-kr/42cabi'>42cabi</a> */}
            <div className="wholeContainer">
                {/* <div className="leftImageContainer">
                    {/* <img className="astronaut" src="../img/astronaut.png" alt="astronaut"/> </div>*/}
                <div className="textContainer">
                {/* <img className="constellation" src="../img/constellation.png" alt="constellation"/> */}
                    {/* <div className="textHead">Maker  </div> */}
                    <div className="textBody"> spark | skim | hyoon | hyospark </div>
                    <a className="textLink" href='https://github.com/innovationacademy-kr/42cabi/issues/new'> Bug Report   |   </a>
                    <a className="textLink" href='https://github.com/innovationacademy-kr/42cabi'>    Github </a>
                    <div className="textCopy">© 2021 42Cabi </div>
                </div>
                {/* <div className="rightImageContainer">
                    {/* <img className="planet" src="../img/whith-planet.png" alt="Planet"/> </div>*/}
            </div>
        </footer>
    );
}