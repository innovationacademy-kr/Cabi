import useState from "react";
import styled from "styled-components";

const ItemUsageLogPage = () => {
  return (
    <WrapperStyled id="infoWrap">
      <TitleContainerStyled className="titleContainer">
        <h1 className="title">
          <span>아이템 사용 내역</span>
        </h1>
      </TitleContainerStyled>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 0;
`;

const TitleContainerStyled = styled.div`
  width: 80%;
  max-width: 1000px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #d9d9d9;
  margin-bottom: 70px;
  color: var(--main-color);
  font-weight: 700;
  .logo {
    width: 35px;
    height: 35px;
    margin-bottom: 20px;
  }
  .title {
    font-size: 2.5rem;
    letter-spacing: -0.02rem;
    margin-bottom: 20px;
  }
  .title > span {
    color: black;
  }
`;

export default ItemUsageLogPage;
