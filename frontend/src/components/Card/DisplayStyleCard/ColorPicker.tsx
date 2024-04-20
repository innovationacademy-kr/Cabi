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
        styles={{
          default: {
            card: {
              background: "var(--bg-color)",
              boxShadow: "var(--border-shadow-color-200) 0px 1px 4px",
            },
            input: {
              boxShadow: "var(--shared-gray-color-200) 0px 0px 0px 1px inset",
            },
            hash: {
              background: "var(--shared-gray-color-200)",
            },
          },
        }}
      />
    </TwitterPickerWrapper>
  );
};

const TwitterPickerWrapper = styled.div`
  margin: 0 auto;
  margin-top: 10px;
`;

export default ColorPicker;
