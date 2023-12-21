import styled from "styled-components";
import Card from "@/components/Card/Card";
import {
  CardContentStyled,
  CardContentWrapper,
  ContentInfoStyled,
} from "@/components/Card/CardStyles";
import ColorPicker from "@/components/Card/ThemeColorCard/ColorPicker";
import { customColors } from "@/assets/data/customColors";

interface ThemeColorProps {
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

const ThemeColorCard = ({
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
}: ThemeColorProps) => {
  return (
    <>
      {showColorPicker && <BackgroundOverlayStyled />}
      <ThemeColorCardWrapper>
        <Card
          title={"테마 컬러"}
          gridArea={"theme"}
          width={"350px"}
          height={"230px"}
          buttons={
            showColorPicker
              ? [
                  {
                    label: "저장",
                    onClick: handleSave,
                    color: "var(--white)",
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
              <CardContentStyled>
                <ContentInfoStyled>메인 컬러</ContentInfoStyled>
                <ColorButtonStyled
                  onClick={() => handleColorButtonClick("main")}
                  color={mainColor}
                />
              </CardContentStyled>
              <CardContentStyled>
                <ContentInfoStyled>서브 컬러</ContentInfoStyled>
                <ColorButtonStyled
                  onClick={() => handleColorButtonClick("sub")}
                  color={subColor}
                />
              </CardContentStyled>
              <CardContentStyled>
                <ContentInfoStyled>내 사물함</ContentInfoStyled>
                <ColorButtonStyled
                  onClick={() => handleColorButtonClick("mine")}
                  color={mineColor}
                />
              </CardContentStyled>
              {showColorPicker && (
                <ColorPicker
                  color={mainColor}
                  onChange={(color) => handleChange(color, selectedColorType)}
                  customColors={customColors}
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
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
`;

const ThemeColorCardWrapper = styled.div`
  z-index: 1;
  align-self: start;
`;

const ColorButtonStyled = styled.button<{ color: string }>`
  width: 28px;
  height: 28px;
  background-color: ${(props) => props.color};
  border-radius: 8px;
`;

export default ThemeColorCard;
