import styled from "styled-components";
import Card from "@/Cabinet/components/Card/Card";
import { CardContentWrapper } from "@/Cabinet/components/Card/CardStyles";
import ColorTheme from "@/Cabinet/components/Card/DisplayStyleCard/ColorTheme/ColorTheme";
import PointColor from "@/Cabinet/components/Card/DisplayStyleCard/PointColor/PointColor";
import { ColorThemeToggleType } from "@/Cabinet/types/enum/colorTheme.type.enum";

interface DisplayStyleProps {
  showColorPicker: boolean;
  handlePointColorChange: (mainColor: { hex: string }, type: string) => void;
  handleReset: () => void;
  handleSave: () => void;
  handleCancel: () => void;
  mainColor: string;
  subColor: string;
  mineColor: string;
  handlePointColorButtonClick: (colorType: string) => void;
  selectedColorType: string;
  colorThemeToggle: ColorThemeToggleType;
  handleColorThemeButtonClick: (colorThemeToggleType: string) => void;
}

const DisplayStyleCard = ({
  showColorPicker,
  handlePointColorChange,
  handleReset,
  handleSave,
  handleCancel,
  mainColor,
  subColor,
  mineColor,
  handlePointColorButtonClick,
  selectedColorType,
  colorThemeToggle,
  handleColorThemeButtonClick,
}: DisplayStyleProps) => {
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
                    fontColor: "var(--white-text-with-bg-color)",
                    backgroundColor: "var(--sys-main-color)",
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
              <ColorTheme
                colorThemeToggle={colorThemeToggle}
                handleColorThemeButtonClick={handleColorThemeButtonClick}
              />
            </CardContentWrapper>
            <CardContentWrapper>
              <PointColor
                showColorPicker={showColorPicker}
                handleChange={handlePointColorChange}
                mainColor={mainColor}
                subColor={subColor}
                mineColor={mineColor}
                handlePointColorButtonClick={handlePointColorButtonClick}
                selectedColorType={selectedColorType}
              />
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
  background: var(--modal-bg-shadow-color);
`;

const ThemeColorCardWrapper = styled.div`
  z-index: 1;
  align-self: start;
`;

export default DisplayStyleCard;
