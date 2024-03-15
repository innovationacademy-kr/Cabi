import styled from "styled-components";

const NoSearch = () => (
  <WraaperStyled>
    <NoSearchStyled>
      <img src="/src/assets/images/logoBlack.svg" alt="로고 블랙" />
      <p>검색 결과가 없습니다</p>
    </NoSearchStyled>
  </WraaperStyled>
);

const WraaperStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NoSearchStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  & > img {
    width: 35px;
    height: 35px;
  }
  & > p {
    margin-top: 10px;
    font-size: 1.125rem;
    color: var(--gray-color);
  }
`;

export default NoSearch;
