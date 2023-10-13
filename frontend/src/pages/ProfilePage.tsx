import styled from "styled-components";

const ProfilePage = () => {
  return <WrapperStyled>내 정보 여기에 넣어주세용</WrapperStyled>;
};

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 70px 0;
  @media screen and (max-width: 768px) {
    padding: 40px 20px;
  }
`;

export default ProfilePage;
