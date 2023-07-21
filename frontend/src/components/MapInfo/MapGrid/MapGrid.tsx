import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import {
  currentSectionNameState,
  isCurrentSectionRenderState,
} from "@/recoil/atoms";
import MapItem from "@/components/MapInfo/MapItem/MapItem";
import { mapPostionData } from "@/assets/data/mapPositionData";

const MapGrid = ({ floor }: { floor: number }) => {
  const setSection = useSetRecoilState(currentSectionNameState);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  const selectSection = (section: string) => {
    setIsCurrentSectionRender(true);
    setSection(section);
  };
  return (
    <MapGridStyled>
      {floor &&
        mapPostionData[floor].map((value: any, idx: any) => (
          <MapItem
            key={idx}
            floor={floor}
            info={value}
            selectSection={selectSection}
          />
        ))}
    </MapGridStyled>
  );
};

const MapGridStyled = styled.div`
  width: 100%;
  text-align: center;
  max-height: 580px;
  height: 100%;
  background: #e7e7e7;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(8, 1fr);
  gap: 0px;
  border-radius: 10px;
`;

export default MapGrid;
