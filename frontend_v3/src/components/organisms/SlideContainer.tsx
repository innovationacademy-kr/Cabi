import React, { LegacyRef } from "react";
import styled from "@emotion/styled";
import Slide from "./Slide";
import MockDatas from "../../mock/CabinetBoxButton.mock";
import { CabinetInfoByLocationFloorDto } from "../../types/dto/cabinet.dto";

const SlideContainerComponent = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  width: ${(props) => (props.results ? `${props.results * 270}px` : `270px`)};
  height: 100%;
  margin: 0;
`;

interface SlideContainerProps {
  slideRef: LegacyRef<HTMLDivElement> | undefined;
  slideCount: number | undefined;
  cabinets: CabinetInfoByLocationFloorDto[] | undefined;
}

const Loading = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const SlideContainer = (props: SlideContainerProps): JSX.Element => {
  const { slideRef, slideCount, cabinets } = props;

  const renderSlides = (): JSX.Element[] => {
    if (cabinets) {
      return cabinets.map((item: CabinetInfoByLocationFloorDto, i: number) => {
        return <Slide key={i} datas={item.cabinets} />;
      });
    }

    return [<Loading key={0}>Loading...</Loading>];
  };

  return (
    <SlideContainerComponent ref={slideRef} results={slideCount}>
      {renderSlides()}
    </SlideContainerComponent>
  );
};

export default SlideContainer;
