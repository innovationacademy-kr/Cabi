import styled from "styled-components";
import exitButton from "@/assets/images/exitButton.svg";
import MapGrid from "@/components/MapInfo/MapGrid/MapGrid";
import useDetailInfo from "@/hooks/useDetailInfo";
import MapFloorSelect from "@/components/MapInfo/MapFloorSelect/MapFloorSelect";

const MapInfo = ({
  touchStart,
  touchEnd,
  floor,
  setFloor,
  floorInfo,
}: {
  touchStart: React.TouchEventHandler;
  touchEnd: React.TouchEventHandler;
  floor: number;
  setFloor: React.Dispatch<React.SetStateAction<number>>;
  floorInfo: number[];
}) => {
  const { closeMap } = useDetailInfo();

  return (
    <MapInfoContainerStyled
      id="mapInfo"
      onTouchStart={touchStart}
      onTouchEnd={touchEnd}
    >
      <HeaderStyled>
        <H2Styled>지도</H2Styled>
        <img
          onClick={closeMap}
          src={exitButton}
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
  padding: 40px 20px 40px 40px;
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
