import { TwitterPicker } from "react-color";
import styled from "styled-components";
import { GetCustomColorsValues } from "@/Cabinet/components/Card/DisplayStyleCard/colorInfo";

interface ColorPickerProps {
  color: string;
  onChange: (color: { hex: string }) => void;
}

const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  return (
    <TwitterPickerWrapper>
      <TwitterPicker
        color={color}
        triangle={"hide"}
        onChangeComplete={onChange}
        colors={GetCustomColorsValues()}
        styles={{
          default: {
            card: {
              background: "var(--color-picker-bg-color)",
              boxShadow: "var(--color-picker-border-shadow-color) 0px 1px 4px",
            },
            input: {
              boxShadow:
                "var(--color-picker-hash-bg-color) 0px 0px 0px 1px inset",
              color: "var(--color-picker-input-color)",
            },
            hash: {
              background: "var(--color-picker-hash-bg-color)",
              color: "var(--color-picker-hash-color)",
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
