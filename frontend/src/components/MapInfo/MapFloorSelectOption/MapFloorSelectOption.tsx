import styled from "styled-components";

const MapFloorSelectOption: React.FC<{
  selectFloor: Function;
  floorInfo: number[];
}> = ({ floorInfo, selectFloor }) => {
  return (
    <OptionWrapperStyled id="mapFloorOptionBox">
      {floorInfo.map((info, idx) => (
        <OptionStyled onClick={() => selectFloor(info)} key={idx}>
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

export default MapFloorSelectOption;
