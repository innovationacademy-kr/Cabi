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
  onClickToolTip?: () => void;
  children: React.ReactElement;
  buttons?: IButtonProps[];
  gridArea: string;
  width?: string;
  height?: string;
}

const Card = ({
  title,
  onClickToolTip,
  gridArea,
  width = "350px",
  height = "163px",
  buttons = ([] = []),
  children,
}: CardProps) => {
  return (
    <CardStyled gridArea={gridArea} width={width} height={height}>
      {(title || buttons.length > 0) && (
        <CardHeaderStyled>
          <CardTitleWrapperStyled>
            {title && <CardTitleStyled>{title}</CardTitleStyled>}
            {onClickToolTip && <ToolTipIcon onClick={onClickToolTip} />}
          </CardTitleWrapperStyled>
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
  background-color: var(--card-bg-color);
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
  background-image: url("/src/Cabinet/assets/images/notificationSign_grey.svg");
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
  font-size: var(--size-base);
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
            : props.isClickable
            ? "var(--card-content-bg-color)"
            : "var(--bg-color)"};
          color: ${props.fontColor
            ? props.fontColor
            : props.isExtensible
            ? "var(--extension-card-active-btn-color)"
            : "var(--gray-line-btn-color)"};
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
    stroke: var(--normal-text-color);
  }
`;

export default Card;
