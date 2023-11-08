import React from "react";
import {
  CardButtonStyled,
  CardButtonWrapper,
  CardHeaderStyled,
  CardStyled,
  CardTitleStyled,
} from "@/components/Card/CardStyles";

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

export default Card;
