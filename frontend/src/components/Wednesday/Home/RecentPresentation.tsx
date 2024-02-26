import { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import WedCard from "./WedCard";
import WedCardMobile from "./WedCardMobile";

const dummy = [
  {
    image: "img1",
    title: "h1",
    username: "jusohn",
    subtitle: "H1",
    cal: "cal1",
  },
  { image: "img2", title: "h2", username: "miyu", subtitle: "H2", cal: "cal2" },
  {
    image: "img3",
    title: "h3",
    username: "jeekim",
    subtitle: "H3",
    cal: "cal3",
  },
];

// 전체 데이터 받음

const RecentPresentation = ({
  presentButtonHandler,
}: {
  presentButtonHandler: () => void;
}) => {
  const [select, setSelect] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  const onClick = (index: number) => {
    if (select) setSelect(index);
    else setSelect(index);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 700); // 화면 너비가 768px 미만인 경우 작은 화면으로 간주
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // 컴포넌트 마운트 시 초기화

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ConTainer>
      <WedHeader>
        <WedTitle>
          <p>42 수요지식회</p>
          <span>수요지식회 메인페이지입니다. 설명문구 필요합니다.</span>
        </WedTitle>
        <RegistButton onClick={""}>발표하기</RegistButton>
      </WedHeader>

      {isMobile ? <WedCardMobile dummy={dummy} /> : <WedCard dummy={dummy} />}

      <WedDescStyle>
        <WedDescTitle>
          24일 오후 1시 <span>지하 1층</span>
          <TimerStyled>
            <ImageStyled>
              <img src="/src/assets/images/timer.svg" alt=""></img>
            </ImageStyled>
            <WedDescTime>45분</WedDescTime>
          </TimerStyled>
        </WedDescTitle>
        <WedDesc>
          "아니 내가 찍는 사진들 항상 왜 이렇게 나오는 건데? "장비 탓인가 싶어서
          <br />
          최신 스마트폰으로 바꿔 봤지만 크게 달라지지 않은 결과물😒취미로
          <br />
          시작하고 싶은데 도대체 뭐가 뭔지 모르겠는 사진!2년 간 사진 강의만
          <br />
          빡시게 해온 jisokang이 엑기스만 쫙쫙 뽑아서 알기 쉽게 알려드립니다! 😉
          <br />
        </WedDesc>
      </WedDescStyle>
    </ConTainer>
  );
};

export default RecentPresentation;

const TimerStyled = styled.div`
  display: flex;
  align-items: flex-end;
  // width: 30px;
  height: 18px;
`;

const ImageStyled = styled.div`
  // width: 30px;
  height: 15px;
`;

const RegistButton = styled.button`
  background-color: #3f69fd;
  margin-top: 20px;
`;

const WedDesc = styled.div`
  color: #fff;
  text-shadow: 0px 3px 5px black;
  // ??????
  height: 200px;
`;

const WedDescTime = styled.div`
  font-size: 1rem;
  font-weight: 400;
  color: #fff;
  margin-left: 15px;
`;

const WedDescTitle = styled.div`
  display: flex;
  align-items: flex-end;

  color: #fff;
  font-size: 2.5rem;
  font-weight: 700;
  // text-shadow: -3px -4px 5px black;

  margin-bottom: 20px;
  flex-wrap: wrap;

  & > span {
    font-size: 2rem;
    margin-right: 50px;
    margin-left: 20px;
  }
`;

const WedHeader = styled.div`
  display: flex;
  width: 80%;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: flex-end;
  margin-bottom: 40px;
`;

const WedDescStyle = styled.div`
  background-color: #2c49b1;
  width: 80%;
  height: 300px;
  border-radius: 30px;
  margin-top: 50px;

  padding-top: 50px;
  padding-left: 50px;
`;

const ConTainer = styled.div`
  padding-top: 60px;
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  overflow-y: scroll;
`;

const WedTitle = styled.div`
  & > p {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 20px;
  }

  margin-right: 20px;
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;

  align-items: center;

  width: 70%;
  justify-content: space-around;
  align-items: center;

  height: 300px;
`;

const restore = keyframes`{
  0% {
    width: 250px;
    height: 250px;
  }
  100% {
    width: 180px;
    height: 180px;
  }
}`;

const transform = keyframes`{
  0% {
    width: 180px;
    height: 180px;
  }
  100% {
    width: 250px;
    height: 250px;
  }
}`;

// const WedCard = styled.div`
//   width: 180px;
//   height: 180px;

//   display: flex;
//   align-items: center;
//   justify-content: center;

//   background-color: #fff;
//   border-radius: 30px;

//   margin-left: 20px;
//   box-shadow: 10px 10px 25px 0 rgba(0, 0, 0, 0.2);

//   &.check {
//     animation: ${transform} 0.5s ease-in-out;
//     width: 250px;
//     height: 250px;
//   }

//   &.not-check {
//     animation: ${restore} 0.5s ease-in-out;
//   }
// `;
