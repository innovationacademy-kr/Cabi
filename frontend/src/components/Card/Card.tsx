import React from "react";
import styled, { css } from "styled-components";

export interface IButtonProps {
  label?: string; // NOTE: icon 이 없을 경우, label 을 표시
  onClick?: () => void;
  backgroundColor?: string;
  color?: string;
  icon?: string; // NOTE: icon 이 있을 경우, icon 을 표시
  isClickable: boolean;
  isExtensible?: boolean;
}

interface CardProps {
  title?: string;
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
  buttons = [],
  children,
}: CardProps) => {
  return (
    <CardStyled gridArea={gridArea} width={width} height={height}>
      {(title || buttons.length > 0) && (
        <CardHeaderStyled>
          <CardTitleWrapperStyled>
            {title && <CardTitleStyled>{title}</CardTitleStyled>}
            {<ToolTipIcon></ToolTipIcon>}
          </CardTitleWrapperStyled>
          {buttons.length > 0 && (
            <CardButtonWrapper>
              {buttons?.map((button, index) => (
                <CardButtonStyled
                  key={index}
                  onClick={button.onClick}
                  color={button.color}
                  backgroundColor={button.backgroundColor}
                  icon={button.icon}
                  isClickable={button.isClickable}
                  isExtensible={button.isExtensible}
                >
                  {button.label}
                </CardButtonStyled>
              ))}
            </CardButtonWrapper>
          )}
        </CardHeaderStyled>
      )}
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

const CardTitleWrapperStyled = styled.div`
  display: flex;
  align-items: center;
`;

export const CardTitleStyled = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  margin-right: auto;
`;

const ToolTipIcon = styled.div`
  background-image: url("/src/assets/images/cautionSign.svg");
  background-size: contain;
  width: 16px;
  height: 16px;
  margin-top: 0.1rem;
  margin-left: 0.25rem;
  opacity: 0.6;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
`;

export const CardButtonWrapper = styled.div`
  display: flex;
`;

export const CardButtonStyled = styled.div<{
  backgroundColor?: string;
  color?: string;
  icon?: string;
  isClickable?: boolean;
  isExtensible?: boolean;
}>`
  ${(props) =>
    props.icon
      ? css`
          background-image: url(${props.icon});
          height: 20px;
          width: 20px;
          background-size: contain;
          background-repeat: no-repeat;
        `
      : css`
          background-color: ${props.backgroundColor
            ? props.backgroundColor
            : "var(--white)"};
          color: ${props.color
            ? props.color
            : props.isExtensible
            ? "var(--main-color)"
            : "var(--gray-color)"};
          padding: 5px 15px;
          border: none;
          border-radius: 5px;
          font-weight: 350;
          margin-left: 10px;
          &:hover {
            font-weight: ${props.isClickable && 400};
          }
        `}
  cursor: ${(props) => (props.isClickable ? "pointer" : "default")};
`;

export default Card;
