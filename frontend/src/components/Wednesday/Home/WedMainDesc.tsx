import styled, { css, keyframes } from "styled-components";

const WedMainDesc = () => {
  return (
    <WedDescStyled>
      <WedDescHeaderStyled>
        <TitleStyled>24일 오후 1시</TitleStyled>
        <PlaceStyled>지하 1층</PlaceStyled>
        <TimerStyled>
          <ImageStyled>
            <img src="/src/assets/images/timer.svg" alt="" />
          </ImageStyled>
          <span>45분</span>
        </TimerStyled>
      </WedDescHeaderStyled>

      <WedDescContainerStyled>
        "아니 내가 찍는 사진들 항상 왜 이렇게 나오는 건데? "장비 탓인가 싶어서
        akakakkakakakakakkakkakakakakakakakakakakakaka마맘마아아아아아아
        <br />
        최신 스마트폰으로 바꿔 봤지만 크게 달라지지 않은 결과물😒취미로
        <br />
        시작하고 싶은데 도대체 뭐가 뭔지 모르겠는 사진!2년 간 사진 강의만
        <br />
        빡시게 해온 jisokang이 엑기스만 쫙쫙 뽑아서 알기 쉽게 알려드립니다! 😉
        <br />
      </WedDescContainerStyled>
    </WedDescStyled>
  );
};

export default WedMainDesc;

const WedDescStyled = styled.div`
  @media (max-width: 465px) {
    padding: 30px 30px 30px 30px;
  }
  margin-bottom: 30px;
  background-color: #2c49b1;
  width: 80%;
  max-width: 1100px;
  // min-height: 300px;
  border-radius: 30px;
  margin-top: 50px;
  padding: 50px 50px 50px 50px;
`;

const WedDescHeaderStyled = styled.div`
  display: flex;
  align-items: flex-end;
  color: #fff;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const TitleStyled = styled.div`
  margin-right: 30px;

  @media (max-width: 465px) {
    font-size: 2rem;
  }
`;

const PlaceStyled = styled.div`
  font-size: 2rem;
  margin-top: 10px;
  @media (max-width: 465px) {
    font-size: 1.5rem;
  }
  margin-right: 30px;
  display: inline-block;
`;

const TimerStyled = styled.div`
  display: flex;
  align-items: flex-end;
  height: 18px;
  font-size: 1rem;
  font-weight: 400;
  color: #fff;
`;

const ImageStyled = styled.div`
  margin-right: 15px;
  height: 15px;
`;

const WedDescContainerStyled = styled.div`
  color: #fff;
  text-shadow: 0px 3px 5px black;
  word-break: break-all;
`;
