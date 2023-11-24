import React from "react";
import { TwitterPicker } from "react-color";
import styled from "styled-components";
import Card from "@/components/Card/Card";
import {
  CardContentStyled,
  CardContentWrapper,
  ContentInfoStyled,
} from "@/components/Card/CardStyles";

interface ThemeColorProps {
  showColorPicker: boolean;
  setShowColorPicker: React.Dispatch<React.SetStateAction<boolean>>;
  handleChange: (mainColor: { hex: string }) => void;
  handleReset: () => void;
  handleSave: () => void;
  handleCancel: () => void;
  mainColor: string;
}

const ThemeColorCard = ({
  showColorPicker,
  setShowColorPicker,
  handleChange,
  handleReset,
  handleSave,
  handleCancel,
  mainColor,
}: ThemeColorProps) => {
  const customColors = [
    "#FF4589",
    "#FF8B5B",
    "#FFC74C",
    "#00cec9",
    "#00C2AB",
    "#74b9ff",
    "#0984e3",
    "#0D4C92",
    "#a29bfe",
    "#9747FF",
  ];
  return (
    <>
      {showColorPicker && <BackgroundOverlayStyled />}
      <ThemeColorCardWrapper>
        <Card
          title={"테마 컬러"}
          gridArea={"theme"}
          width={"350px"}
          height={"215px"}
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
          <CardContentWrapper>
            <CardContentStyled>
              <ContentInfoStyled>메인 컬러</ContentInfoStyled>
              <MainColorButtonStyled
                onClick={() => setShowColorPicker(!showColorPicker)}
              />
            </CardContentStyled>
            {showColorPicker && (
              <TwitterPicker
                color={mainColor}
                onChangeComplete={handleChange}
                colors={customColors}
              />
            )}
          </CardContentWrapper>
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
  z-index: 0;
`;

const ThemeColorCardWrapper = styled.div`
  z-index: 1;
`;

const MainColorButtonStyled = styled.button`
  width: 28px;
  height: 28px;
  background-color: var(--main-color);
  margin: 0 10px 5px 0;
  border-radius: 8px;
`;

export default ThemeColorCard;
