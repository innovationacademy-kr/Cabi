import styled from "styled-components";

export const CardStyled = styled.div<{
  width: string;
  height: string;
  gridArea: string;
}>`
  width: ${(props) => props.width};
  border-radius: 10px;
  background-color: var(--lightgary-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  height: ${(props) => props.height};
  grid-area: ${(props) => props.gridArea};
`;

export const CardHeaderStyled = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 10px 30px;
`;

export const CardTitleStyled = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  margin-right: auto;
`;

export const CardButtonWrapper = styled.div`
  display: flex;
`;

export const CardButtonStyled = styled.div<{
  backgroundColor?: string;
  color?: string;
  isClickable?: boolean;
  isExtensible?: boolean;
}>`
  background-color: ${(props) =>
    props.backgroundColor ? props.backgroundColor : "var(--white)"};
  color: ${(props) =>
    props.color
      ? props.color
      : props.isExtensible
      ? "var(--main-color)"
      : "var(--gray-color)"};
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  cursor: ${(props) => (props.isClickable ? "pointer" : "default")};
  margin-left: 10px;
`;

export const CardContentWrapper = styled.div`
  background-color: var(--white);
  border-radius: 10px;
  padding: 15px 0;
  margin: 5px 5px 10px 5px;
  width: 90%;
  display: flex;
  flex-direction: column;
`;

export const CardContentStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0 5px 0;
`;

export const ContentInfoStyled = styled.div`
  display: flex;
  margin: 0 0 0 10px;
`;

export const ContentDeatilStyled = styled.div`
  display: flex;
  margin: 0 10px 5px 0;
  font-weight: bold;
`;
