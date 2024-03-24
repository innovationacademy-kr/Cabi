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
              background: "var(--color-background)",
              boxShadow: "var(--bg-shadow-200) 0px 1px 4px",
              // 테두리
            },
            input: {
              boxShadow: "var(--gray-tmp-2) 0px 0px 0px 1px inset",
            },
            hash: {
              background: "var(--gray-tmp-2)",
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
