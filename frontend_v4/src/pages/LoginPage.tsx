import "./LoginPage.css";

const LoginPage = () => {
  return (
    <div id="loginPage" className="wrapper">
      <section className="leftLoginPage">
        <div className="topContents">
          <p>42서울 캐비닛 서비스</p>
          <p className="lightPuple">여러분의 일상을 가볍게</p>
        </div>
        <div className="loginImg">
          <img src="src/assets/images/loginImg.svg" alt="" />
        </div>
        <div className="bottomContents">
          <p>
            <span>Cabi</span>로
          </p>
          <p>일상의 무게를 덜어보세요.</p>
        </div>
      </section>
      <div className="rightLoginPage">
        <div className="loginCard modal">
          <div className="loginLogo">
            <img src="src/assets/images/logo.svg" alt="" />
          </div>
          <div className="loginTitle">
            <h1>42Cabi</h1>
            <p>여러분의 일상을 가볍게</p>
          </div>
          <button>L O G I N</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
