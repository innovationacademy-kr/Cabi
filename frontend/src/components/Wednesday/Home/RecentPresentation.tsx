import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import WedCard from "./WedCard";
import WedCardMobile from "./WedCardMobile";
import WedMainDesc from "./WedMainDesc";

// "subject": "제목";
// "summary": "한줄요약";
// "detail": "상세설명";
// "dateTime": "2024-01-01-13:42:43T"; // new Date().toISOString()
// "category": "DEVELOP"; // [DEVELOP, HOBBY, JOB, ETC]
// "period": "HALF"; // [HALF, HOUR, HOUR_HALF, TWO_HOUR]
// "userName": "jusohn";

const presentation = [
  {
    image: "img1",
    subject: "h1",
    summary: "한줄요약 1",
    detail: "상세설명 1",
    dateTime: "cal1",
    category: "DEVELOP",
    period: "HALF",
    userName: "jusohn",
  },
  {
    image: "img2",
    subject: "h2",
    summary: "한줄요약 2",
    detail: "상세설명 2",
    dateTime: "cal2",
    category: "DEVELOP",
    period: "HALF",
    userName: "miyu",
  },
  {
    image: "img3",
    subject: "h3",
    summary: "한줄요약 3",
    detail: "상세설명 3",
    dateTime: "cal3",
    category: "DEVELOP",
    period: "HALF",
    userName: "jeekim",
  },
];

export interface IPresentation {
  image: string; // 나중에 뺴기
  subject: string;
  summary: string;
  detail: string;
  dateTime: string;
  category: string;
  period: string;
  userName: string;
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
  const [select, setSelect] = useState(1);

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

      {isMobile ? (
        <WedCardMobile presentation={presentation} />
      ) : (
        <WedCard presentation={presentation} />
      )}
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
