import React from "react";
import { TwitterPicker } from "react-color";
import styled from "styled-components";

const ThemeColor: React.FC<{
  showColorPicker: boolean;
  setShowColorPicker: React.Dispatch<React.SetStateAction<boolean>>;
  handleChange: (mainColor: { hex: string }) => void;
  handleReset: Function;
  handleSave: Function;
  handleCancel: Function;
  mainColor: string;
}> = ({
  showColorPicker,
  setShowColorPicker,
  handleChange,
  handleReset,
  handleSave,
  handleCancel,
  mainColor,
}) => {
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
    <ThemeColorStyled>
      <TableTopStyled>
        <TableTitleStyled>테마 컬러</TableTitleStyled>
        {showColorPicker ? (
          <>
            <BtnWrapStyled>
              <SaveBtnStyled onClick={() => handleSave()}>저장</SaveBtnStyled>
              <ResetBtnStyled onClick={() => handleCancel()}>
                취소
              </ResetBtnStyled>
            </BtnWrapStyled>
          </>
        ) : (
          <ResetBtnStyled onClick={() => handleReset()}>초기화</ResetBtnStyled>
        )}
      </TableTopStyled>
      <TableBodyStyled>
        <ColorSelectStyled>
          메인 컬러
          <MainColorButtonStyled
            onClick={() => setShowColorPicker(!showColorPicker)}
          />
        </ColorSelectStyled>
        {showColorPicker && (
          <TwitterPicker
            color={mainColor}
            onChangeComplete={handleChange}
            colors={customColors}
          />
        )}
      </TableBodyStyled>
    </ThemeColorStyled>
  );
};

const ThemeColorStyled = styled.div`
  width: 350px;
  height: 215px;
  background-color: var(--lightgray-color);
  border-radius: 10px;
  padding: 30px;
`;

const TableTitleStyled = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const TableTopStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const BtnWrapStyled = styled.div`
  display: flex;
`;

const ResetBtnStyled = styled.div`
  width: 54px;
  height: 23px;
  background-color: white;
  border-radius: 4px;
  color: var(--gray-color);
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SaveBtnStyled = styled.div`
  width: 54px;
  height: 23px;
  background-color: var(--main-color);
  border-radius: 4px;
  color: white;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
`;

const MainColorButtonStyled = styled.button`
  width: 28px;
  height: 28px;
  background-color: var(--main-color);
  border-radius: 8px;
`;

const ColorSelectStyled = styled.div`
  padding: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TableBodyStyled = styled.div`
  background-color: white;
  width: 290px;
  height: 120px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default ThemeColor;
