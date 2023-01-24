import styled from "styled-components";
import { useSetRecoilState } from "recoil";
import {
  currentSectionNameState,
  isCurrentSectionRenderState,
} from "@/recoil/atoms";
import { mapPostionData } from "@/assets/data/mapPositionData";
import MapItem from "@/components/MapInfo/MapItem/MapItem";

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
  padding: 3px;
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
