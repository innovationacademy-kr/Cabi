import { useState } from "react";
import styled, { css, keyframes } from "styled-components";

export interface IDummyList {
  image: string;
  title: string;
  username: string;
  subtitle: string;
  cal: string;
}

// width 1000기준으로 모바일뷰로 전환
const WedCard = ({ dummy }: { dummy: IDummyList[] }) => {
  const [select, setSelect] = useState(1);

  const onClick = (index: number) => {
    if (select) setSelect(index);
    else setSelect(index);
  };

  return (
    <CardContainer>
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
  );
};

export default WedCard;

const restore = (min_width, min_height, max_width, max_height) => keyframes`{
  0% {
    width: ${max_width}px;
	  height: ${max_height}px;
	}
	100% {
    width:${min_width}px;
	  height: ${min_height}px;
	}
}`;

const transform = (min_width, min_height, max_width, max_height) => keyframes`{
  0% {
	  width: ${min_width}px;
	  height: ${min_height}px;
	}
	100% {
    width: ${max_width}px;
	  height: ${max_height}px;
	}
}`;

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
  display: flex;
  justify-content: center;
  align-items: center;

  height: 380px;
  width: 90%;
  min-height: 380px;

  max-width: 1300px;
  min-width: 1000px;
  justify-content: space-around;
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

  margin-left: 20px;
  box-shadow: 10px 10px 25px 0 rgba(0, 0, 0, 0.2);

  &.check {
    animation: ${transform(280, 280, 370, 370)} 0.5s ease-in-out;
    width: 370px;
    height: 370px;
  }

  &.not-check {
    animation: ${restore(280, 280, 370, 370)} 0.5s ease-in-out;
  }
`;

const CardImage = styled.div`
  background-color: gray;
  width: 100px;
  height: 90px;

  border-radius: 300px;

  display: flex;
  justify-content: center;
  align-items: center;

  ${Card}.check & {
    animation: ${transform(100, 90, 150, 140)} 0.5s ease-in-out;
    width: 150px;
    height: 140px;
  }

  ${Card}.not-check & {
    animation: ${restore(100, 90, 150, 140)} 0.5s ease-in-out;
    width: 100px;
    height: 90px;
  }
`;

const CardUsername = styled.div`
  color: #9d9d9d;
  font-size: 1.2rem;
  padding-top: 10px;
  padding-bottom: 10px;

  ${Card}.check & {
    font-size: 1.5rem;
  }
`;

const CardTitle = styled.div`
  font-size: 1.5rem;

  ${Card}.check & {
    font-size: 2rem;
  }
`;

const CardSubTitle = styled.div`
  font-size: 1rem;
  margin-top: 30px;
  // padding-bottom: 20px;
`;

const CardCal = styled.div`
  color: gray;
`;
