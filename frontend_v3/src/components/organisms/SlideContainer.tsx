import React, { LegacyRef } from "react";
import styled from "@emotion/styled";
import Slide from "./Slide";
import { CabinetInfoByLocationFloorDto } from "../../types/dto/cabinet.dto";
import SectionMap from "./SectionMap";

const SlideContainerComponent = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  width: ${(props) => (props.results ? `${props.results * 270}px` : `270px`)};
  @media (max-width: 281px) {
    width: ${(props) => (props.results ? `${props.results * 195}px` : `195px`)};
  }
  height: 100%;
  margin: 0;
`;

interface SlideContainerProps {
  slideRef: LegacyRef<HTMLDivElement> | undefined;
  slideCount: number | undefined;
  cabinets: CabinetInfoByLocationFloorDto[] | undefined;
  sections: string[];
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>;
}

const Loading = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const SlideContainer = (props: SlideContainerProps): JSX.Element => {
  const { slideRef, slideCount, cabinets, sections, setCurrentSlide } = props;

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
      <SectionMap sections={sections} setCurrentSlide={setCurrentSlide} />
      {renderSlides()}
    </SlideContainerComponent>
  );
};

export default SlideContainer;
