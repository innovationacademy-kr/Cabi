import React, { LegacyRef } from "react";
import styled from "@emotion/styled";
import Slide from "./Slide";

const SlideContainerComponent = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  width: 450px;
  height: 480px;
  margin: 10px auto;
`;

interface SlideContainerProps {
  slideRef: LegacyRef<HTMLDivElement> | undefined;
}

const SlideContainer = (props: SlideContainerProps): JSX.Element => {
  const { slideRef } = props;
  return (
    <SlideContainerComponent ref={slideRef}>
      <Slide color="red" />
      <Slide color="green" />
      <Slide color="blue" />
    </SlideContainerComponent>
  );
};

export default SlideContainer;
