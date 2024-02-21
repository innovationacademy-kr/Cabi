import { useState } from "react";
import styled, { css, keyframes } from "styled-components";

interface IDummyList {
  image: string;
  title: string;
  username: string;
  subtitle: string;
  cal: string;
}

const WedCard = ({ dummy }: { dummy: IDummyList[] }) => {
  const [select, setSelect] = useState(1);

  const onClick = (index: number) => {
    if (select) setSelect(index);
    else setSelect(index);
  };
  //   console.log(dummy);
  return (
    <CardContainer>
      {dummy.map((p, index) => (
        <Card
          onClick={() => onClick(index)}
          className={index == select ? "check" : "not-check"}
        >
          <CardImage>{p.image}</CardImage>
          <CardUsername>{p.username}</CardUsername>
          {/* <CardTitle>{p.title}</CardTitle>
          <CardSubTitle>{p.subtitle}</CardSubTitle>
          <CardCal>{p.cal}</CardCal> */}
        </Card>
      ))}
    </CardContainer>
  );
};

export default WedCard;

const restore = keyframes`{
	0% {
	  width: 370px;
	  height: 370px;
	}
	100% {
	  width: 280px;
	  height: 280px;
	}
  }`;

const transform = keyframes`{
	0% {
	  width: 280px;
	  height: 280px;
	}
	100% {
	  width: 370px;
	  height: 370px;
	}
  }`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 380px;
  width: 90%;
  // overflow-y: auto;

  // height: 90%;
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
    animation: ${transform} 0.5s ease-in-out;
    width: 370px;
    height: 370px;
  }

  &.not-check {
    animation: ${restore} 0.5s ease-in-out;
  }
`;

const CardImage = styled.div`
  background-color: gray;
  width: 40px;
  height: 40px;
  border-radius: 300px;

  display: flex;
  justify-content: center;
  align-items: center;
`;
const CardUsername = styled.div``;

const CardTitle = styled.div`
  font-size: 2rem;
`;
const CardSubTitle = styled.div``;
const CardCal = styled.div``;
