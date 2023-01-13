import styled from "styled-components";
import MapFloorSelectOption from "@/components/MapInfo/MapFloorSelectOption/MapFloorSelectOption";

interface IMapFloorSelect {
  floor: number;
  setFloor: React.Dispatch<React.SetStateAction<number>>;
  floorInfo: number[];
}

const MapFloorSelect = ({ floor, setFloor, floorInfo }: IMapFloorSelect) => {
  const onClickFloorOption = () => {
    document.getElementById("mapFloorOptionBox")?.classList.toggle("on");
  };

  const selectFloor = (info: string) => {
    const floorInfo = parseInt(info);
    onClickFloorOption();
    setFloor(floorInfo);
  };

  return (
    <div style={{ position: "relative" }}>
      <MapFloorSelectStyled onClick={onClickFloorOption}>
        {`${floor}층`}
      </MapFloorSelectStyled>
      <MapFloorSelectOption selectFloor={selectFloor} floorInfo={floorInfo} />
    </div>
  );
};

const MapFloorSelectStyled = styled.div`
  background: url("src/assets/images/select.svg") var(--main-color) no-repeat
    80% 55%;
  color: white;
  cursor: pointer;
  width: 65px;
  height: 40px;
  line-height: 40px;
  text-indent: 12px;
  border-radius: 10px;
  margin: 30px 0;
  &:hover {
    opacity: 0.9;
  }
`;

export default MapFloorSelect;
