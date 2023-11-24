import React from "react";
import styled from "styled-components";

export interface IButtonProps {
  label: string;
  onClick?: () => void;
  backgroundColor?: string;
  color?: string;
  isClickable: boolean;
  isExtensible?: boolean;
}

interface CardProps {
  title: string;
  children: React.ReactElement;
  buttons?: IButtonProps[];
  gridArea: string;
  width?: string;
  height?: string;
}

const Card = ({
  title,
  gridArea,
  width = "350px",
  height = "163px",
  buttons,
  children,
}: CardProps) => {
  return (
    <CardStyled gridArea={gridArea} width={width} height={height}>
      <CardHeaderStyled>
        <CardTitleStyled>{title}</CardTitleStyled>
        <CardButtonWrapper>
          {buttons?.map((button, index) => (
            <CardButtonStyled
              key={index}
              onClick={button.onClick}
              color={button.color}
              backgroundColor={button.backgroundColor}
              isClickable={button.isClickable}
              isExtensible={button.isExtensible}
            >
              {button.label}
            </CardButtonStyled>
          ))}
        </CardButtonWrapper>
      </CardHeaderStyled>
      {children}
    </CardStyled>
  );
};

export const CardStyled = styled.div<{
  width: string;
  height: string;
  gridArea: string;
}>`
  width: ${(props) => props.width};
  border-radius: 10px;
  background-color: var(--lightgray-color);
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
  &:hover {
    text-decoration: ${(props) => (props.isClickable ? "underline" : "none")};
  }
`;

export default Card;
