import styled from "styled-components";
import MapFloorSelect from "@/Cabinet/components/MapInfo/MapFloorSelect/MapFloorSelect";
import MapGrid from "@/Cabinet/components/MapInfo/MapGrid/MapGrid";
import { DISABLED_FLOOR } from "@/Cabinet/pages/AvailablePage";

const DEFAULT_FLOOR = 2;
const MapInfo = ({
  touchStart,
  touchEnd,
  floor,
  setFloor,
  floorInfo,
  closeMap,
}: {
  touchStart: React.TouchEventHandler;
  touchEnd: React.TouchEventHandler;
  floor: number | undefined;
  setFloor: React.Dispatch<React.SetStateAction<number>>;
  floorInfo: number[];
  closeMap: React.MouseEventHandler;
}) => {
  const currentFloor = floor ?? DEFAULT_FLOOR;
  const validFloor = DISABLED_FLOOR.includes(currentFloor.toString())
    ? DEFAULT_FLOOR
    : currentFloor;

  return (
    <MapInfoContainerStyled
      id="mapInfo"
      onTouchStart={touchStart}
      onTouchEnd={touchEnd}
    >
      <HeaderStyled>
        <H2Styled>지도</H2Styled>
        <img
          className="cabiButton"
          onClick={closeMap}
          src="/src/Cabinet/assets/images/exitButton.svg"
          alt=""
          style={{ width: "24px", cursor: "pointer" }}
        />
      </HeaderStyled>
      <MapFloorSelect floor={validFloor} setFloor={setFloor} floorInfo={floorInfo} />
      <MapGrid floor={validFloor} />
    </MapInfoContainerStyled>
  );
};

const H2Styled = styled.h2`
  font-size: 1.5rem;
`;

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  color: var(--normal-text-color);
  font-weight: bold;
`;

const MapInfoContainerStyled = styled.div`
  position: fixed;
  top: 120px;
  right: 0;
  min-width: 330px;
  width: 330px;
  height: calc(100% - 120px);
  padding: 40px;
  z-index: 9;
  transform: translateX(120%);
  transition: transform 0.3s ease-in-out;
  box-shadow: 0 0 40px 0 var(--left-nav-border-shadow-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--bg-color);
  border-left: 1px solid var(--line-color);
  &.on {
    transform: translateX(0%);
  }
  overflow-y: auto;
`;

export default MapInfo;
