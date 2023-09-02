import styled from "styled-components";

const ServiceManual = ({
  lentStartHandler,
}: {
  lentStartHandler: React.MouseEventHandler;
}) => {
  return (
    <WrapperStyled id="infoWrap">
      <TitleContainerStyled className="titleContainer">
        <div className="logo">
          <img src="/src/assets/images/logo.svg" alt="" />
        </div>
        <h1 className="title">
          42Cabi <span>이용 안내서</span>
        </h1>
        <p className="subtitle">캐비닛 대여 전 알아둘 3가지</p>
      </TitleContainerStyled>
      <InfoSectionStyled className="section">
        <article className="article">
          <div>
            <img src="/src/assets/images/privateIcon.svg" alt="" />
          </div>
          <h3>개인 사물함</h3>
          <p>
            <span>1인</span>이 1개의 사물함을 사용합니다.
            <br />
            최대 <span>
              {import.meta.env.VITE_PRIVATE_LENT_PERIOD}일간
            </span>{" "}
            대여할 수 있습니다.
            <br />
            연체 시 연체되는{" "}
            <span className="redColor">일의 제곱 수만큼 페널티</span>가<br />
            부과됩니다.
          </p>
        </article>
        <article className="article">
          <div>
            <img src="/src/assets/images/shareIcon.svg" alt="" />
          </div>
          <h3>공유 사물함</h3>
          <p>
            1개의 사물함을 최대{" "}
            <span>{import.meta.env.VITE_SHARE_MAX_USER}인</span>이 사용합니다.
            <br />
            대여한{" "}
            <span>
              인원수 * {import.meta.env.VITE_SHARE_LENT_PERIOD}일간
            </span>{" "}
            대여할 수 있습니다.
            <br />
            사물함 제목과 메모는 대여자들끼리 공유됩니다.
            <br />
            대여 후 <span className="redColor">대여 만료기간</span> 내 반납 시,
            <br />
            <span className="redColor"> 잔여 기간의 절반</span>으로 대여기간이
            감소됩니다. <br />
            연체 시 연체되는{" "}
            <span className="redColor">일의 제곱 수만큼 페널티</span>가<br />
            부과됩니다.
          </p>
        </article>
        <article className="article">
          <div>
            <img src="/src/assets/images/clubIcon.svg" alt="" />
          </div>
          <h3>동아리 사물함</h3>
          <p>
            모집 기간에만 대여할 수 있습니다.
            <br />
            새로운 기수가 들어올 때 갱신됩니다.
            <br />
            사물함 대여는{" "}
            <AtagStyled
              href="https://42born2code.slack.com/archives/C02V6GE8LD7"
              target="_blank"
              title="슬랙 캐비닛 채널 새창으로 열기"
            >
              슬랙 캐비닛 채널
            </AtagStyled>
            로 문의주세요.
            <br />
            상세 페이지가 제공되지 않습니다.
            <br />
            비밀번호는 동아리 내에서 공유하여 이용하세요.
          </p>
        </article>
      </InfoSectionStyled>
      <button onClick={lentStartHandler}>시작하기</button>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 70px 0;
`;

const TitleContainerStyled = styled.div`
  width: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 70px;
  border-bottom: 2px solid var(--main-color);
  .logo {
    width: 35px;
    height: 35px;
    margin-bottom: 20px;
  }
  .title {
    font-size: 2.5rem;
    letter-spacing: -0.02rem;
    margin-bottom: 20px;
  }
  .title > span {
    font-weight: 700;
  }
  .subtitle {
    font-size: 1.5rem;
    color: var(--lightpurple-color);
  }
`;

const InfoSectionStyled = styled.section`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  width: 90%;
  max-width: 1500px;
  .article {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 70px;
  }
  .article > div {
    width: 58px;
    height: 58px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(113, 46, 255, 0.1);
    border-radius: 50%;
  }
  .article > div > img {
    width: 24px;
    height: 24px;
  }
  .article > h3 {
    min-width: 200px;
    text-align: center;
    font-size: 1.5rem;
    margin: 15px 0;
    font-weight: 700;
  }
  .article > p {
    font-size: 1.125rem;
    line-height: 1.6;
    letter-spacing: -0.02rem;
    text-align: center;
  }
  .redColor {
    color: var(--expired);
  }
  .article > p > span {
    font-weight: 700;
  }
`;

const AtagStyled = styled.a`
  text-decoration: underline;
  font-weight: 700;
`;

export default ServiceManual;
