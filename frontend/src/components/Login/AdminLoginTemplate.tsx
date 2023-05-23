import { useState } from "react";
import styled from "styled-components";
import "@/assets/css/loginPage.css";
import LoadingAnimation from "@/components/Common/LoadingAnimation";
import UnavailableModal from "@/components/Modals/UnavailableModal/UnavailableModal";
import { additionalModalType } from "@/assets/data/maps";
import { axiosAdminAuthLogin } from "@/api/axios/axios.custom";
import { useNavigate } from "react-router-dom";

const AdminLoginTemplate = (props: {
  url: string;
  pageTitle: string;
  pageSubTitle: string;
  imgSrc?: string;
}) => {
  const navigate = useNavigate();
  const { url, pageTitle, pageSubTitle, imgSrc } = props;
  const [isClicked, setIsClicked] = useState(false);
  const [isIdFocused, setIsIdFocused] = useState(false);
  const [isPwFocused, setIsPwFocused] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [adminPw, setAdminPw] = useState("");

  const handleLoginButton = async () => {
    if (adminId === "" || adminPw === "") {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }
    try {
      const response = await axiosAdminAuthLogin(adminId, adminPw);
      if (response.status === 200) {
        navigate("/admin/home");
      }
    } catch (error) {
      console.error(error);
    }
    setIsClicked(true);
    setAdminId("");
    setAdminPw("");
  };

  return (
    <LoginPageStyled id="loginPage">
      <LeftSectionStyled className="leftLoginPage">
        <TopContentsStyled>
          <LoginTitleStyled color="var(--black)">
            42서울 캐비닛 서비스
          </LoginTitleStyled>
          <LoginTitleStyled color="var(--lightpurple-color)">
            여러분의 일상을 가볍게
          </LoginTitleStyled>
        </TopContentsStyled>
        <LoginImgStyled isAdmin={!!imgSrc}>
          <img src={imgSrc ?? "/src/assets/images/loginImg.svg"} alt="" />
        </LoginImgStyled>
        <BottomContentsStyled>
          <p>
            <CabiStyled>Cabi</CabiStyled>로
          </p>
          <p>일상의 무게를 덜어보세요.</p>
        </BottomContentsStyled>
      </LeftSectionStyled>
      <RightSectionStyled className="rightLoginPage">
        <LoginCardStyled className="modal">
          <CardLogoStyled>
            <img src="/src/assets/images/logo.svg" alt="" />
          </CardLogoStyled>
          <CardTitleBoxStyled>
            <CardTitleStyled>{pageTitle}</CardTitleStyled>
            <CardSubTitleStyled>{pageSubTitle}</CardSubTitleStyled>
          </CardTitleBoxStyled>

          <CardInputBoxStyled>
            <CardInputStyled
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="ID"
              disabled={isClicked ? true : false}
              onFocus={() => {
                setIsIdFocused(true);
              }}
              onBlur={() => {
                setIsIdFocused(false);
              }}
              isFocus={isIdFocused}
            ></CardInputStyled>
            <CardInputStyled
              value={adminPw}
              onChange={(e) => setAdminPw(e.target.value)}
              type="password"
              placeholder="PASSWORD"
              disabled={isClicked ? true : false}
              onFocus={() => {
                setIsPwFocused(true);
              }}
              onBlur={() => {
                setIsPwFocused(false);
              }}
              onKeyUp={(e) => {
                if (e.key == "Enter") handleLoginButton();
              }}
              isFocus={isPwFocused}
            ></CardInputStyled>
          </CardInputBoxStyled>
          <button onClick={handleLoginButton}>
            {isClicked ? <LoadingAnimation></LoadingAnimation> : "L O G I N"}
          </button>
          <CardGoogleOauthStyled
            onClick={() => {
              window.location.replace(url);
            }}
          >
            Sign in with Google
          </CardGoogleOauthStyled>
        </LoginCardStyled>
      </RightSectionStyled>
    </LoginPageStyled>
  );
};

const LoginPageStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  width: 100%;
  height: 100%;
`;

const LeftSectionStyled = styled.section`
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  padding-left: 7%;
`;
const TopContentsStyled = styled.div`
  font-size: 2rem;
  font-family: var(--main-font);
  font-weight: 700;
  line-height: 3rem;
`;

const LoginTitleStyled = styled.p<{ color: string }>`
  font-size: 2rem;
  font-family: var(--main-font);
  color: ${(props) => props.color};
  font-weight: 700;
  line-height: 3rem;
`;

const LoginImgStyled = styled.div<{ isAdmin?: boolean }>`
  margin: 10%;
  margin-left: 0;
  transform: ${(props) => (props.isAdmin ? "scaleX(-1)" : "scaleX(1)")};
`;

const BottomContentsStyled = styled.div`
  font-size: 1.75rem;
  font-family: var(--main-font);
  font-weight: 700;
  line-height: 3rem;
`;

const CabiStyled = styled.span`
  color: var(--main-color);
`;

const RightSectionStyled = styled.section`
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--main-color);
`;

const LoginCardStyled = styled.div`
  width: 350px;
  min-height: 500px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  padding: 85px 0;
  background-color: var(--white);
`;

const CardLogoStyled = styled.div`
  width: 70px;
  height: 70px;
`;

const CardTitleBoxStyled = styled.div`
  text-align: center;
  margin-top: 30px;
`;

const CardTitleStyled = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const CardSubTitleStyled = styled.p`
  color: var(--main-color);
`;

const CardInputBoxStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: 40px 0 10px;
`;

const CardInputStyled = styled.input<{ isFocus: boolean }>`
  text-align: left;
  padding-left: 15px;
  font-family: var(--main-font);
  font-size: 18px;
  letter-spacing: 0.05rem;
  height: 48px;
  background-color: var(--white);
  border-radius: 8px;
  margin-bottom: 8px;
  border: ${(props) =>
    props.isFocus
      ? "1px solid var(--main-color)"
      : "1px solid var(--line-color)"};
`;

const CardGoogleOauthStyled = styled.button`
  background-color: var(--white);
  color: var(--black);
  font-style: oblique;
  height: 30px;
  margin-top: 10px;
`;

export default AdminLoginTemplate;
