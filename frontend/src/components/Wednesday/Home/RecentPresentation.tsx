import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import WedCard from "./WedCard";
import WedCardMobile from "./WedCardMobile";
import WedMainDesc from "./WedMainDesc";

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

export interface IDummyList {
  image: string;
  title: string;
  username: string;
  subtitle: string;
  cal: string;
}
export interface IAnimation {
  min_width: number;
  min_height: number;
  max_width: number;
  max_height: number;
}

// 전체 데이터 받음

const RecentPresentation = ({
  presentButtonHandler,
}: {
  presentButtonHandler: () => void;
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const navigator = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 700); // 화면 너비가 768px 미만인 경우 작은 화면으로 간주
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ConTainerStyled>
      <WedHeaderStyled>
        <WedTitleStyled>
          <p>42 수요지식회</p>
          <span>수요지식회 메인페이지입니다. 설명문구 필요합니다.</span>
        </WedTitleStyled>
        <RegistButtonStyled
          onClick={() => {
            navigator("/wed/register");
          }}
        >
          발표하기
        </RegistButtonStyled>
      </WedHeaderStyled>
      {isMobile ? <WedCardMobile dummy={dummy} /> : <WedCard dummy={dummy} />}
      <WedMainDesc />
    </ConTainerStyled>
  );
};

export default RecentPresentation;

const ConTainerStyled = styled.div`
  padding-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
`;

const WedHeaderStyled = styled.div`
  display: flex;
  width: 80%;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: flex-end;
  margin-bottom: 40px;
  max-width: 1100px;
`;

const WedTitleStyled = styled.div`
  & > p {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 20px;
  }

  margin-right: 20px;
`;

const RegistButtonStyled = styled.button`
  background-color: #3f69fd;
  margin-top: 20px;
`;
