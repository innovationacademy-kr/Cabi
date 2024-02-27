import { useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { IAnimation, IDummyList } from "./RecentPresentation";

// width 1000기준으로 모바일뷰로 전환
const WedCard = ({ dummy }: { dummy: IDummyList[] }) => {
  const [select, setSelect] = useState(1);

  const onClick = (index: number) => {
    if (select) setSelect(index);
    else setSelect(index);
  };

  return (
    <ContainerStyled>
      {dummy.map((p, index) => (
        <WedCardStyled
          onClick={() => onClick(index)}
          className={index == select ? "check" : "not-check"}
        >
          <ImageStyled>{p.image}</ImageStyled>
          <NameStyled>{p.username}</NameStyled>
          <TitleStyled>{p.title}</TitleStyled>
          <SubTitleStyled>{p.subtitle}</SubTitleStyled>

          <CalendarStyled>
            <IconStyled>
              <img src="/src/assets/images/calendar.svg" alt="" />
            </IconStyled>
            <span>{p.cal}</span>
          </CalendarStyled>
        </WedCardStyled>
      ))}
    </ContainerStyled>
  );
};

export default WedCard;

const restore = ({
  min_width,
  min_height,
  max_width,
  max_height,
}: IAnimation) => keyframes`{
  0% {
    width: ${max_width}px;
	  height: ${max_height}px;
	}
	100% {
    width:${min_width}px;
	  height: ${min_height}px;
	}
}`;

const transform = ({
  min_width,
  min_height,
  max_width,
  max_height,
}: IAnimation) => keyframes`{
  0% {
	  width: ${min_width}px;
	  height: ${min_height}px;
	}
	100% {
    width: ${max_width}px;
	  height: ${max_height}px;
	}
}`;

const CalendarStyled = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
  padding-right: 10px;

  & > {
    color: gray;
  }
`;

const IconStyled = styled.div`
  height: 15px;
  margin-right: 8px;
`;

const ContainerStyled = styled.div`
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

const WedCardStyled = styled.div`
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
    animation: ${transform({
        min_width: 280,
        min_height: 280,
        max_width: 370,
        max_height: 370,
      })}
      0.5s ease-in-out;
    width: 370px;
    height: 370px;
  }

  &.not-check {
    animation: ${restore({
        min_width: 280,
        min_height: 280,
        max_width: 370,
        max_height: 370,
      })}
      0.5s ease-in-out;
  }
`;

const ImageStyled = styled.div`
  background-color: gray;
  width: 100px;
  height: 90px;

  border-radius: 300px;

  display: flex;
  justify-content: center;
  align-items: center;

  ${WedCardStyled}.check & {
    animation: ${transform({
        min_width: 100,
        min_height: 90,
        max_width: 150,
        max_height: 140,
      })}
      0.5s ease-in-out;
    width: 150px;
    height: 140px;
  }

  ${WedCardStyled}.not-check & {
    animation: ${restore({
        min_width: 100,
        min_height: 90,
        max_width: 150,
        max_height: 140,
      })}
      0.5s ease-in-out;
    width: 100px;
    height: 90px;
  }
`;

const NameStyled = styled.div`
  color: #9d9d9d;
  font-size: 1.2rem;
  padding-top: 10px;
  padding-bottom: 10px;

  ${WedCardStyled}.check & {
    font-size: 1.5rem;
  }
`;

const TitleStyled = styled.div`
  font-size: 1.5rem;

  ${WedCardStyled}.check & {
    font-size: 2rem;
  }
`;

const SubTitleStyled = styled.div`
  font-size: 1rem;
  margin-top: 30px;
  // padding-bottom: 20px;
`;

const CardCal = styled.div`
  color: gray;
`;
