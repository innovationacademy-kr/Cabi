import styled from "styled-components";
import { ReactComponent as CoinCheckOnFinImg } from "@/Cabinet/assets/images/storeCoinCheckFin.svg";
import { ReactComponent as CoinCheckOffImg } from "@/Cabinet/assets/images/storeCoinCheckOff.svg";
import { ReactComponent as CoinCheckOnImg } from "@/Cabinet/assets/images/storeCoinCheckOn.svg";

const StoreCoinCheckBox = ({
  monthlyCoinCount,
}: {
  monthlyCoinCount: number;
}) => {
  console.log("monthlyCoinCount", monthlyCoinCount);
  return (
    <WrapperStyled>
      {Array.from({ length: 20 }, (_, index) => (
        <CoinCheckOffStyled key={index}>
          {index < monthlyCoinCount && index !== 19 ? (
            <CoinCheckOnImg />
          ) : index === 19 && monthlyCoinCount === 20 ? (
            <CoinCheckOnFinImg />
          ) : (
            <CoinCheckOffImgStyled>
              <CoinCheckOffImg />
              <IndexStyled>{index + 1}</IndexStyled>
            </CoinCheckOffImgStyled>
          )}
        </CoinCheckOffStyled>
      ))}
    </WrapperStyled>
  );
};

export default StoreCoinCheckBox;

const CoinCheckOffStyled = styled.div`
  position: relative;
  // cursor: pointer;
  & > svg > circle {
    fill: var(--white-text-with-bg-color);
  }
`;

const CoinCheckOffImgStyled = styled.div`
  position: relative;
`;

const IndexStyled = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.5;
`;

const WrapperStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(5, 1fr);
  grid-gap: 5px;
  margin-top: 15px;
  margin-bottom: 30px;
`;
