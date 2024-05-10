import styled from "styled-components";

const MapFloorSelectOption: React.FC<{
  selectFloor: Function;
  floorInfo: number[];
}> = ({ floorInfo, selectFloor }) => {
  return (
    <OptionWrapperStyled id="mapFloorOptionBox">
      {floorInfo.map((info, idx) => (
        <OptionStyled
          className="cabiButton"
          onClick={() => selectFloor(info)}
          key={idx}
        >
          {info}층
        </OptionStyled>
      ))}
    </OptionWrapperStyled>
  );
};

const OptionWrapperStyled = styled.div`
  position: absolute;
  left: 0;
  top: 75px;
  background: var(--bg-color);
  border-radius: 10px;
  box-shadow: 0 0 10px 0 var(--table-border-shadow-color-200);
  overflow: hidden;
  z-index: 99;
  display: none;
  &.on {
    display: block;
  }
`;

const OptionStyled = styled.div`
  width: 65px;
  height: 40px;
  border-bottom: 1px solid var(--map-floor-color);
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg-color);
  color: var(--normal-text-color);
  cursor: pointer;
`;

export default MapFloorSelectOption;
