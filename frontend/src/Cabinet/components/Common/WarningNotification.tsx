import React from "react";
import styled from "styled-components";
import { ReactComponent as WarningIcon } from "@/Cabinet/assets/images/warningTriangleIcon.svg";

export interface WarningNotificationProps {
  isVisible: boolean;
  message: string;
}

const WarningNotification: React.FC<WarningNotificationProps> = ({
  isVisible,
  message,
}: WarningNotificationProps) => {
  return (
    <WarningWrapper isVisible={isVisible}>
      <IconWrapperStyled isVisible={isVisible}>
        <WarningIcon />
      </IconWrapperStyled>
      <WarningBox>{message}</WarningBox>
    </WarningWrapper>
  );
};

const WarningBox = styled.div`
  position: relative;
  margin: 10px auto;
  visibility: hidden;
  color: transparent;
  background-color: transparent;
  width: 280px;
  padding: 10px;
  border-radius: 4px;
  font-size: 0.875rem;
  text-align: center;
  line-height: 1.25rem;
  letter-spacing: -0.02rem;
  white-space: pre-line;
  z-index: 100;
  transition: visibility 0.5s, color 0.5s, background-color 0.5s, width 0.5s,
    padding 0.5s ease-in-out;
`;

const IconWrapperStyled = styled.div<{ isVisible: boolean }>`
  display: ${({ isVisible }) => (isVisible ? "block" : "none")};
  width: 24px;
  height: 24px;
  cursor: pointer;
  margin: 0px auto;
  opacity: 0.6;
  &:hover {
    opacity: 1;
  }
`;

const WarningWrapper = styled.div<{ isVisible: boolean }>`
  display: ${({ isVisible }) => (isVisible ? "block" : "none")};
  position: relative;
  width: 100%;
  height: 24px;
  justify-content: center;
  & ${IconWrapperStyled}:hover + ${WarningBox} {
    visibility: visible;
    color: var(--white-text-with-bg-color);
    background-color: var(--tooltip-shadow-color);
    &:before {
      border-color: transparent transparent var(--tooltip-shadow-color)
        var(--tooltip-shadow-color);
    }
  }
`;

export default WarningNotification;
