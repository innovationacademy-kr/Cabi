import styled from "styled-components";
import Card from "@/components/Card/Card";
import { CardContentWrapper } from "@/components/Card/CardStyles";
import DarkMode from "@/components/Card/DisplayStyleCard/DarkMode/DarkMode";
import PointColor from "./PointColor/PointColor";

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

const DisplayStyleCard = ({
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
              <PointColor
                showColorPicker={showColorPicker}
                handleChange={handleChange}
                mainColor={mainColor}
                subColor={subColor}
                mineColor={mineColor}
                handleColorButtonClick={handleColorButtonClick}
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
  background: var(--bg-shadow-color-100);
`;

const ThemeColorCardWrapper = styled.div`
  z-index: 1;
  align-self: start;
`;

export default DisplayStyleCard;
