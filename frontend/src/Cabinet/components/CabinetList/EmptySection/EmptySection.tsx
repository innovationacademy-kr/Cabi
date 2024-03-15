import styled from "styled-components";

const EmptySection = ({ message }: { message: string }): JSX.Element => {
  return (
    <EmptySectionStyled>
      <CabiImageStyled
        src="/src/assets/images/happyCcabi.png"
        alt="happy cabi"
      />
      <ContentStyled>{message}</ContentStyled>
    </EmptySectionStyled>
  );
};

const EmptySectionStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 30px;
`;

const CabiImageStyled = styled.img`
  width: 200px;
  height: 200px;
`;

const ContentStyled = styled.p`
  font-size: 1.25rem;
  font-family: var(--building-font);
`;

export default EmptySection;
