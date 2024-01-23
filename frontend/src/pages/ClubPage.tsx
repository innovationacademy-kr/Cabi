import styled from "styled-components";

const ClubPage = () => {
  return (
    <WrapperStyled>
      <h2>동아리 정보 페이지</h2>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
`;

export default ClubPage;
