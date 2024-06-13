import styled from "styled-components";
import {
  CardContentStyled,
  ContentInfoStyled,
} from "@/Cabinet/components/Card/CardStyles";
import ColorPicker from "@/Cabinet/components/Card/PointColorCard/ColorPicker";
import { pointColorData } from "@/Cabinet/components/Card/PointColorCard/colorInfo";

interface PointColorProps {
  showColorPicker: boolean;
  handleChange: (mainColor: { hex: string }, type: string) => void;
  mainColor: string;
  subColor: string;
  mineColor: string;
  handlePointColorButtonClick: (colorType: string) => void;
  selectedColorType: string;
}

const PointColor = ({
  showColorPicker,
  handleChange,
  mainColor,
  subColor,
  mineColor,
  handlePointColorButtonClick,
  selectedColorType,
}: PointColorProps) => {
  return (
    <>
      {pointColorData.map(({ title, type, getColor }) => (
        <CardContentStyled key={type}>
          <ContentInfoStyled
            isSelected={type === selectedColorType && showColorPicker}
            selectedColor={getColor({ mainColor, subColor, mineColor })}
            onClick={() => handlePointColorButtonClick(type)}
          >
            {title}
          </ContentInfoStyled>
          <ColorButtonStyled
            onClick={() => handlePointColorButtonClick(type)}
            color={getColor({ mainColor, subColor, mineColor })}
            isSelected={type === selectedColorType && showColorPicker}
            showColorPicker={showColorPicker}
          />
        </CardContentStyled>
      ))}
      {showColorPicker && (
        <ColorPicker
          color={mainColor}
          onChange={(color) => handleChange(color, selectedColorType)}
        />
      )}
    </>
  );
};

const ColorButtonStyled = styled.button<{
  color: string;
  isSelected: boolean;
  showColorPicker: boolean;
}>`
  width: 28px;
  height: 28px;
  background-color: ${(props) => props.color};
  border-radius: 8px;
  box-shadow: ${(props) =>
    props.isSelected ? `${props.color} 0px 0px 4px` : "none"};
`;

export default PointColor;
