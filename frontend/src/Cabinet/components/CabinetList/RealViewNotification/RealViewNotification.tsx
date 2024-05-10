import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const RealViewNotification: React.FC<{ colNum: number }> = (props) => {
  const [hasEnoughWidth, setHasEnoughWidth] = useState<boolean>(true);
  const tooltipCardRef = useRef<HTMLDivElement>(null);
  const toolTipMessage = `보시는 화면은 실제 사물함 위치와 다를 수 있습니다!
  실제 위치는 넓은 화면에서 확인해주세요.`;

  const checkEnoughWidth = () => {
    if (!props.colNum || !tooltipCardRef.current) return;

    const requireWidth = props.colNum * 90;
    setHasEnoughWidth(tooltipCardRef.current.offsetWidth >= requireWidth);
  };

  useEffect(() => {
    if (!tooltipCardRef.current) return;

    checkEnoughWidth();
    window.addEventListener("resize", checkEnoughWidth);
    return () => {
      window.removeEventListener("resize", checkEnoughWidth);
    };
  }, [tooltipCardRef.current, props.colNum]);

  return (
    <TooltipCard ref={tooltipCardRef} hasEnoughWidth={hasEnoughWidth}>
      <ToolTipIcon hasEnoughWidth={hasEnoughWidth} />
      <TooltipBox>{toolTipMessage}</TooltipBox>
    </TooltipCard>
  );
};

const ToolTipIcon = styled.div<{ hasEnoughWidth: boolean }>`
  background-image: url("/src/Cabinet/assets/images/cautionSign.svg");
  width: 24px;
  height: 24px;
  margin: 0px auto;
  opacity: 0.6;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
`;
const TooltipBox = styled.div`
  position: relative;
  margin: 10px auto;
  visibility: hidden;
  color: transparent;
  background-color: transparent;
  width: 330px;
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

const TooltipCard = styled.div<{ hasEnoughWidth: boolean }>`
  visibility: ${({ hasEnoughWidth }) =>
    hasEnoughWidth ? "hidden" : "visible"};
  position: relative;
  width: 100%;
  height: 24px;
  justify-content: center;
  & ${ToolTipIcon}:hover + ${TooltipBox} {
    visibility: visible;
    color: var(--white-text-with-bg-color);
    background-color: var(--tooltip-shadow-color);
    &:before {
      border-color: transparent transparent var(--tooltip-shadow-color)
        var(--tooltip-shadow-color);
    }
  }
`;

export default RealViewNotification;
