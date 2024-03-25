import styled from "styled-components";
import { ReactComponent as LogoImg } from "@/assets/images/logo.svg";

const SearchDefault = () => (
  <WraaperStyled>
    <SearchDefaultStyled>
      <LogoImg />
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
  & > p {
    margin-top: 10px;
    font-size: 1.125rem;
    color: var(--gray-tmp-5);
    text-align: center;
    line-height: 1.75rem;
  }
  svg {
    width: 35px;
    height: 35px;
    .logo_svg__currentPath {
      fill: var(--main-color);
    }
    .logo_svg__top {
      fill: var(--color-background);
    }
    .logo_svg__left {
      fill: var(--color-background);
    }
    .logo_svg__line {
      stroke: var(--color-background);
    }
    .logo_svg__border {
      stroke: var(--color-text-normal);
    }
  }
`;

export default SearchDefault;
