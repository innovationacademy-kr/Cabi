import styled from "styled-components";
import MapFloorSelectOption from "@/Cabinet/components/MapInfo/MapFloorSelectOption/MapFloorSelectOption";
import { ReactComponent as SelectImg } from "@/Cabinet/assets/images/select.svg";

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
      <MapFloorSelectStyled className="cabiButton" onClick={onClickFloorOption}>
        <span>{`${floor}층`}</span>
        <SelectImg stroke="var(--white)" />
      </MapFloorSelectStyled>
      <MapFloorSelectOption selectFloor={selectFloor} floorInfo={floorInfo} />
    </div>
  );
};

const MapFloorSelectStyled = styled.div`
  background: var(--main-color);
  color: white;
  cursor: pointer;
  width: 65px;
  height: 40px;
  padding: 0 12px;
  line-height: 40px;
  border-radius: 10px;
  margin: 30px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 0.9;
    }
  }
`;

export default MapFloorSelect;
