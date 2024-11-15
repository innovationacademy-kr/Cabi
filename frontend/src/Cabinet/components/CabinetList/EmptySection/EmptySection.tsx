import styled from "styled-components";
import { ReactComponent as CabiImage } from "@/Cabinet/assets/images/happyCcabi.svg";

const EmptySection = ({ message }: { message: string }): JSX.Element => {
  return (
    <EmptySectionStyled>
      <CabinetTypeIconStyled>
        <CabiImage />
      </CabinetTypeIconStyled>
      <ContentStyled>{message}</ContentStyled>
    </EmptySectionStyled>
  );
};

const CabinetTypeIconStyled = styled.div`
  width: 200px;
  height: 200px;

  & g {
    fill: var(--normal-text-color);
  }

  & > svg {
    width: 200px;
    height: 200px;
  }
`;

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
