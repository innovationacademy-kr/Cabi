import { Link } from "react-router-dom";
import styled from "styled-components";
import LogTable from "./LogTable";

const dummyData = createDummyData();

function createDummyData() {
  const result = [];

  for (let i = 1; i <= 10; i++) {
    result.push({
      loc: "2F - " + i,
      lent_begin: "23-01-01",
      lent_end: "23-01-31",
    });
  }
  return result;
}
const LentLog = () => {
  return (
    <LentLogStyled>
      <TitleContainer>
        <TitleStyled>대여 기록</TitleStyled>
        <Link to="#">뒤로 가기</Link>
      </TitleContainer>
      <LogTable data={dummyData} />
      <ButtonContainerStyled>
        <PageButtonStyled>이전</PageButtonStyled>
        <PageButtonStyled>다음</PageButtonStyled>
      </ButtonContainerStyled>
    </LentLogStyled>
  );
};

const PageButtonStyled = styled.div`
  cursor: pointer;
  color: var(--main-color);
`;

const ButtonContainerStyled = styled.div`
  width: 80%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  margin-top: 25px;
`;

const TitleContainer = styled.div`
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const TitleStyled = styled.h1`
  font-size: 2rem;
`;

const LentLogStyled = styled.div`
  background: var(--white);
  width: 100%;
  height: 100%;
`;

export default LentLog;
