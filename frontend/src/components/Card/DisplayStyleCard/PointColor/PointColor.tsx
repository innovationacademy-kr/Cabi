import styled from "styled-components";
import Card from "@/components/Card/Card";
import {
  CardContentStyled,
  CardContentWrapper,
  ContentInfoStyled,
} from "@/components/Card/CardStyles";
import DarkMode from "@/components/Card/DisplayStyleCard/DarkMode/DarkMode";
import ColorPicker from "@/components/Card/DisplayStyleCard/PointColor/ColorPicker";
import { pointColorData } from "@/components/Card/DisplayStyleCard/colorInfo";

interface PointColorProps {
  showColorPicker: boolean;
  handleChange: (mainColor: { hex: string }, type: string) => void;
  handleReset: () => void;
  handleSave: () => void;
  handleCancel: () => void;
  mainColor: string;
  subColor: string;
  mineColor: string;
  handleColorButtonClick: (colorType: string) => void;
  selectedColorType: string;
}

const PointColor = ({
  showColorPicker,
  handleChange,
  handleReset,
  handleSave,
  handleCancel,
  mainColor,
  subColor,
  mineColor,
  handleColorButtonClick,
  selectedColorType,
}: PointColorProps) => {
  return (
    <>
      {showColorPicker && <BackgroundOverlayStyled />}
      <ThemeColorCardWrapper>
        <Card
          title={"화면 스타일"}
          gridArea={"theme"}
          width={"350px"}
          height={showColorPicker ? "448px" : "348px"}
          buttons={
            showColorPicker
              ? [
                  {
                    label: "저장",
                    onClick: handleSave,
                    fontColor: "var(--text-with-bg-color)",
                    backgroundColor: "var(--main-color)",
                    isClickable: true,
                  },
                  {
                    label: "취소",
                    onClick: handleCancel,
                    isClickable: true,
                  },
                ]
              : [
                  {
                    label: "초기화",
                    onClick: handleReset,
                    isClickable: true,
                  },
                ]
          }
        >
          <>
            <CardContentWrapper>
              <DarkMode />
            </CardContentWrapper>
            <CardContentWrapper>
              {pointColorData.map(({ title, type, getColor }) => (
                <CardContentStyled key={type}>
                  <ContentInfoStyled
                    isSelected={type === selectedColorType && showColorPicker}
                    selectedColor={getColor({ mainColor, subColor, mineColor })}
                    onClick={() => handleColorButtonClick(type)}
                  >
                    {title}
                  </ContentInfoStyled>
                  <ColorButtonStyled
                    onClick={() => handleColorButtonClick(type)}
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
            </CardContentWrapper>
          </>
        </Card>
      </ThemeColorCardWrapper>
    </>
  );
};

const BackgroundOverlayStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-shadow-color-100);
  z-index: 1;
`;

const ThemeColorCardWrapper = styled.div`
  z-index: 1;
  align-self: start;
`;

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
