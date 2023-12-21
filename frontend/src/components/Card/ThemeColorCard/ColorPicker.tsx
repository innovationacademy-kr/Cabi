import { TwitterPicker } from "react-color";
import styled from "styled-components";

interface ColorPickerProps {
  color: string;
  onChange: (color: { hex: string }) => void;
  customColors: string[];
}

const ColorPicker = ({ color, onChange, customColors }: ColorPickerProps) => {
  return (
    <TwitterPickerWrapper>
      <TwitterPicker
        color={color}
        triangle={"hide"}
        onChangeComplete={onChange}
        colors={customColors}
        // width="100%"
      />
    </TwitterPickerWrapper>
  );
};

const TwitterPickerWrapper = styled.div`
  margin: 0 auto;
  margin-top: 10px;
`;

export default ColorPicker;
