import styled from "styled-components";
import MapFloorSelect from "@/components/MapInfo/MapFloorSelect/MapFloorSelect";
import MapGrid from "@/components/MapInfo/MapGrid/MapGrid";

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
  floor: number;
  setFloor: React.Dispatch<React.SetStateAction<number>>;
  floorInfo: number[];
  closeMap: React.MouseEventHandler;
}) => {
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
          src="/src/assets/images/exitButton.svg"
          alt=""
          style={{ width: "24px", cursor: "pointer" }}
        />
      </HeaderStyled>
      <MapFloorSelect floor={floor} setFloor={setFloor} floorInfo={floorInfo} />
      <MapGrid floor={floor} />
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
  color: black;
  font-weight: bold;
`;

const MapInfoContainerStyled = styled.div`
  position: fixed;
  top: 80px;
  right: 0;
  min-width: 330px;
  width: 330px;
  height: calc(100% - 80px);
  padding: 40px;
  z-index: 9;
  transform: translateX(120%);
  transition: transform 0.3s ease-in-out;
  box-shadow: 0 0 40px 0 var(--bg-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--white);
`;

export default MapInfo;
