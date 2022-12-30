import styled, { keyframes } from "styled-components";

const LoadingModal = () => {
  return (
    <LoadingModalBgStyled>
      <LoadingModalStyled></LoadingModalStyled>
    </LoadingModalBgStyled>
  );
};

const LoadingModalBgStyled = styled.div`
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const pulse = keyframes`
  50% {
    background: var(--main-color);
  }
`;

const LoadingModalStyled = styled.div`
  position: relative;
  width: 6px;
  height: 24px;
  background: var(--lightpurple-color);
  animation: ${pulse} 0.75s infinite;
  animation-delay: 0.25s;
  &:before,
  &:after {
    content: "";
    position: absolute;
    display: block;
    width: 6px;
    height: 16px;
    background: var(--lightpurple-color);
    top: 50%;
    transform: translateY(-50%);
    animation: ${pulse} 0.75s infinite;
  }
  &:before {
    left: -12px;
  }
  &:after {
    left: 12px;
    animation-delay: 0.5s;
  }
`;

export default LoadingModal;
