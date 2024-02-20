import { useState } from "react";
import styled, { css, keyframes } from "styled-components";
import WedCard from "./WedCard";

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

  const onClick = (index: number) => {
    if (select) setSelect(index);
    else setSelect(index);
  };

  return (
    <ConTainer>
      <WedHeader>
        <WedTitle>
          <p>42 수지회</p>
          <span>수요지식회 메인페이지입니다. 설명문구 필요합니다.</span>
        </WedTitle>
        <button onClick={""} style={{ backgroundColor: "#3F69FD" }}>
          발표하기
        </button>
      </WedHeader>

      <WedCard dummy={dummy} />
      <WedDesc></WedDesc>
    </ConTainer>
  );
};

export default RecentPresentation;

const ImageStyled = styled.div``;

const WedHeader = styled.div`
  display: flex;
  width: 80%;
  justify-content: space-between;
`;

const WedDesc = styled.div`
  background-color: #2c49b1;
  width: 80%;
  height: 250px;
  border-radius: 30px;
`;

const ConTainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
`;

const WedTitle = styled.div`
  & > p {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }
  $ > span {
  }
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
