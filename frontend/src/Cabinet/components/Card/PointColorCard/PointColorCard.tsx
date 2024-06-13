import styled from "styled-components";
import Card from "@/Cabinet/components/Card/Card";
import { CardContentWrapper } from "@/Cabinet/components/Card/CardStyles";
import PointColor from "@/Cabinet/components/Card/PointColorCard/PointColor";

interface PointColorProps {
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
}

const PointColorCard = ({
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
}: PointColorProps) => {
  return (
    <>
      {showColorPicker && <BackgroundOverlayStyled />}
      <PointColorCardWrapper>
        <Card
          title={"포인트 컬러"}
          gridArea={"pointColor"}
          width={"350px"}
          height={showColorPicker ? "330px" : "230px"}
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
      </PointColorCardWrapper>
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

const PointColorCardWrapper = styled.div`
  z-index: 1;
  align-self: start;
`;

export default PointColorCard;
