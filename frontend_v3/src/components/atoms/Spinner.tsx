import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";

const SpinnerWrapper = styled.div`
  display: flex;
`;

const rotation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Line = styled.div`
  position: absolute;
  right: calc(50% - 3.5rem);
  bottom: calc(50% - 3.5rem);
  width: 6rem;
  height: 6rem;
  border-top: 0.5rem solid #a3a4ce;
  border-left: 0.5rem solid #c0c0c0;
  border-right: 0.5rem solid #c0c0c0;
  border-bottom: 0.5rem solid #c0c0c0;
  border-radius: 50%;
  animation: ${rotation} 1s ease-in-out infinite;
`;

const BackgroundLine = styled.div`
  position: absolute;
  right: calc(50% - 3.5rem);
  bottom: calc(50% - 3.5rem);
  width: 6rem;
  height: 6rem;
  border: 0.5rem solid #c0c0c0;
  border-radius: 50%;
`;

const Spinner = (): JSX.Element => {
  return (
    <SpinnerWrapper>
      <h4>Loading</h4>
      <BackgroundLine />
      <Line />
    </SpinnerWrapper>
  );
};

export default Spinner;
