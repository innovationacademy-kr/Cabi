import React from "react";
import styled from "styled-components";

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
      <WarningIcon isVisible={isVisible} />
      <WarningBox>{message}</WarningBox>
    </WarningWrapper>
  );
};

const WarningIcon = styled.div<{ isVisible: boolean }>`
  display: ${({ isVisible }) => (isVisible ? "block" : "none")};
  background-image: url("/src/assets/images/warningTriangleIcon.svg");
  width: 24px;
  height: 24px;
  margin: 0px auto;
  opacity: 0.6;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
`;

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

const WarningWrapper = styled.div<{ isVisible: boolean }>`
  display: ${({ isVisible }) => (isVisible ? "block" : "none")};
  position: relative;
  width: 100%;
  height: 24px;
  justify-content: center;
  & ${WarningIcon}:hover + ${WarningBox} {
    visibility: visible;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.8);
    &:before {
      border-color: transparent transparent rgba(0, 0, 0, 0.8)
      rgba(0, 0, 0, 0.8);
    }
  }
`;
  
export default WarningNotification;
