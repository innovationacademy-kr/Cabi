import styled from "styled-components";

const SearchDefault = () => (
  <WraaperStyled>
    <SearchDefaultStyled>
      <img src="/src/assets/images/logo.svg" alt="로고" />
      <p>
        Intra ID 또는 사물함 번호를
        <br />
        입력하세요
      </p>
    </SearchDefaultStyled>
  </WraaperStyled>
);

const WraaperStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SearchDefaultStyled = styled.div`
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
    text-align: center;
    line-height: 1.75rem;
  }
`;

export default SearchDefault;
