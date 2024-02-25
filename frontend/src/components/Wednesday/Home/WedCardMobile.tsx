import { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { IDummyList } from "./WedCard";

const WedCardMobile = ({ dummy }: { dummy: IDummyList[] }) => {
  const [select, setSelect] = useState(0);
  const [slideIndex, setSlideIndex] = useState(1);

  // 눌렀을때 해당 페이지로 이동
  // 페이지가 이동하면 그에 맞는 페이지네이션 제공
  const onPageClick = (i: number) => {};

  const components = [];
  for (let i = 0; i < 3; i++) {
    components.push(
      <Paginations
        key={i}
        onClick={() => onPageClick(i)}
        current={i == slideIndex}
      ></Paginations>
    );
  }

  const onClick = (index: number) => {
    if (slideIndex != index) {
      if (index < slideIndex) {
        setSlideIndex(slideIndex - 1);
        setSelect(select + 300);
      } else {
        setSlideIndex(slideIndex + 1);
        setSelect(select - 300);
      }
    }
  };

  useEffect(() => {
    console.log("selecty : " + select);
    console.log("slideIndex : " + slideIndex);
  }, [select]);

  return (
    <WedCardContainer>
      <CardContainer slideIndex={select}>
        {dummy.map((p, index) => (
          <Card
            onClick={() => onClick(index)}
            className={index == select ? "check" : "not-check"}
          >
            <CardImage>{p.image}</CardImage>
            <CardUsername>{p.username}</CardUsername>
            <CardTitle>{p.title}</CardTitle>
            <CardSubTitle>{p.subtitle}</CardSubTitle>

            <CalStyled>
              <ImageStyled>
                <img src="/src/assets/images/calendar.svg" alt="" />
              </ImageStyled>
              <CardCal>{p.cal}</CardCal>
            </CalStyled>
          </Card>
        ))}
      </CardContainer>

      <PaginationContainer>{components}</PaginationContainer>
    </WedCardContainer>
  );
};

export default WedCardMobile;

const WedCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;

  width: 100%;
`;

const PaginationContainer = styled.div`
  display: flex;
`;

const Paginations = styled.div`
  width: 30px;
  height: 10px;
  background-color: ${(props) => (props.current ? "#5378fd" : "gray")};
  border-radius: 12px;
  margin: 0 5px;
`;

const CalStyled = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
  padding-right: 10px;
`;

const ImageStyled = styled.div`
  height: 15px;
`;

const CardContainer = styled.div`
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 380px;
  // width: 90%;
  min-height: 370px;

  max-width: 1300px;
  min-width: 1000px;

  overflow-x: hidden;

  transform: translateX(${(props) => props.slideIndex}px);
  transition: all 500ms ease-in-out;
`;

const Card = styled.div`
  width: 280px;
  height: 280px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  background-color: #fff;
  border-radius: 30px;

  margin: 0 10px;
  box-shadow: 10px 10px 25px 0 rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
`;

const CardImage = styled.div`
  background-color: gray;
  width: 100px;
  height: 90px;
  border-radius: 300px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const CardUsername = styled.div`
  color: #9d9d9d;
  font-size: 1.2rem;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const CardTitle = styled.div`
  font-size: 1.5rem;
`;

const CardSubTitle = styled.div`
  font-size: 1rem;
  margin-top: 30px;
`;

const CardCal = styled.div`
  color: gray;
`;
