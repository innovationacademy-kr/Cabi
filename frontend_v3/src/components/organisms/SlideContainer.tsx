import React, { LegacyRef } from "react";
import styled from "@emotion/styled";
import Slide from "./Slide";
import MockDatas from "../../mock/CabinetBoxButton.mock";

const SlideContainerComponent = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  width: ${(props) => (props.results ? `${props.results * 270}px` : `270px`)};
  height: 480px;
  margin: 10px auto;
`;

interface SlideContainerProps {
  slideRef: LegacyRef<HTMLDivElement> | undefined;
  slideCount: number;
}

const SlideContainer = (props: SlideContainerProps): JSX.Element => {
  const { slideRef, slideCount } = props;
  return (
    <SlideContainerComponent ref={slideRef} results={slideCount}>
      <Slide datas={MockDatas} />
      <Slide datas={MockDatas} />
      <Slide datas={MockDatas} />
    </SlideContainerComponent>
  );
};

export default SlideContainer;
