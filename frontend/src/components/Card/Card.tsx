import React from "react";
import styled, { css } from "styled-components";

export interface IButtonProps {
  label?: string; // NOTE: icon 이 없을 경우, label 을 표시
  onClick?: () => void;
  backgroundColor?: string;
  fontColor?: string;
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | null; // NOTE: icon 이 있을 경우, icon 을 표시
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
          {title && <CardTitleStyled>{title}</CardTitleStyled>}
          {buttons.length > 0 && (
            <CardButtonWrapper>
              {buttons?.map((button, index) => (
                <CardButtonStyled
                  key={index}
                  onClick={button.onClick}
                  fontColor={button.fontColor}
                  backgroundColor={button.backgroundColor}
                  icon={button.icon}
                  isClickable={button.isClickable}
                  isExtensible={button.isExtensible}
                >
                  {!button.icon ? button.label : <button.icon />}
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
  background-color: var(--gray-tmp-1);
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
  fontColor?: string;
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | null;
  isClickable?: boolean;
  isExtensible?: boolean;
}>`
  ${(props) =>
    props.icon
      ? css`
          height: 20px;
          width: 20px;
        `
      : css`
          background-color: ${props.backgroundColor
            ? props.backgroundColor
            : "var(--color-background)"};
          color: ${props.fontColor
            ? props.fontColor
            : props.isExtensible
            ? "var(--main-color)"
            : "var(--gray-tmp-5)"};
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

  & > svg {
    height: 20px;
    width: 20px;
  }

  & > svg > path {
    transform: ${(props) =>
      props.icon?.name === "SvgLock" ? "" : "scale(1.1)"};
    stroke: var(--color-text-normal);
  }
`;

export default Card;
