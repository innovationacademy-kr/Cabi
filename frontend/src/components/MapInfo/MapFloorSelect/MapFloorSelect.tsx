import styled from "styled-components";

interface IMapFloorSelect {
  floor: number;
  setFloor: React.Dispatch<React.SetStateAction<number>>;
  floorInfo: number[];
}

const OptionsContainer: React.FC<{
  selectFloor: Function;
  floorInfo: number[];
}> = ({ floorInfo, selectFloor }) => {
  return (
    <OptionsContainerStyled id="mapFloorOptionBox">
      {floorInfo.map((info, idx) => (
        <OptionStyled onClick={() => selectFloor(info)} key={idx}>
          {info}층
        </OptionStyled>
      ))}
    </OptionsContainerStyled>
  );
};

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
      <CurrentFloorStyled onClick={onClickFloorOption}>
        {`${floor}층`}
      </CurrentFloorStyled>
      <OptionsContainer selectFloor={selectFloor} floorInfo={floorInfo} />
    </div>
  );
};

const OptionStyled = styled.div`
  width: 65px;
  height: 40px;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--white);
  color: black;
  cursor: pointer;
`;

const CurrentFloorStyled = styled.div`
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

const OptionsContainerStyled = styled.div`
  position: absolute;
  left: 0;
  top: 75px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 99;
  display: none;
  &.on {
    display: block;
  }
`;

export default MapFloorSelect;
