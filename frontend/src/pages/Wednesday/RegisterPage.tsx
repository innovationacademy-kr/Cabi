import { useState } from "react";
import styled from "styled-components";
import { toggleItem } from "@/components/Common/MultiToggleSwitch";
import MultiToggleSwitchSeparated from "@/components/Common/MultiToggleSwitchSeparated";

enum PresentationCategory {
  FORTYTWO = "FORTYTWO",
  DEVELOP = "DEVELOP",
  ACADEMIC = "ACADEMIC",
  HOBBY = "HOBBY",
  EMPLOYMENT = "EMPLOYMENT",
  ETC = "ETC",
}

const toggleList: toggleItem[] = [
  { name: "42", key: PresentationCategory.FORTYTWO },
  { name: "개발", key: PresentationCategory.DEVELOP },
  { name: "학술", key: PresentationCategory.ACADEMIC },
  { name: "취미", key: PresentationCategory.HOBBY },
  { name: "취업", key: PresentationCategory.EMPLOYMENT },
  { name: "기타", key: PresentationCategory.ETC },
];

const RegisterPage = () => {
  const [toggleType, setToggleType] = useState<PresentationCategory>(
    PresentationCategory.FORTYTWO
  );

  return (
    <RegisterPageStyled>
      <RegisterTitleStyled>수요지식회 신청</RegisterTitleStyled>
      <RegisterBackgroundStyled>
        <SubtitleSection>
          <RegisterSubTitleStyled>카테고리</RegisterSubTitleStyled>
          <MultiToggleSwitchSeparated
            initialState={toggleType}
            setState={setToggleType}
            toggleList={toggleList}
            fontSize={"1rem"}
          />
        </SubtitleSection>
        <SubtitleSection>
          <RegisterSubTitleStyled>제목</RegisterSubTitleStyled>
          <RegisterSubTitleInputStyled />
        </SubtitleSection>
        <SubtitleSection>
          <RegisterSubTitleStyled>한줄 요약</RegisterSubTitleStyled>
          <RegisterSubTitleInputStyled />
        </SubtitleSection>
        <SubtitleSection>
          <RegisterSubTitleStyled>내용</RegisterSubTitleStyled>
          <RegisterDetailInputStyled />
        </SubtitleSection>
      </RegisterBackgroundStyled>
    </RegisterPageStyled>
  );
};

const RegisterPageStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

const RegisterTitleStyled = styled.h1`
  margin-top: 20px;
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 3rem;
`;

const RegisterBackgroundStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 840px;
  height: 1000px;
  border-radius: 10px;
  background-color: var(--lightgray-color);
  margin-top: 20px;
`;

const RegisterSubTitleStyled = styled.div`
  margin-top: 20px;
  font-size: 1.2rem;
  line-height: 2.25rem;
`;

const RegisterSubTitleInputStyled = styled.textarea`
  border-radius: 10px;
  border: none;
  resize: none;
  background-color: var(--white);
  width: 800px;
  height: 50px;
  outline: none;
`;

const SubtitleSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const RegisterDetailInputStyled = styled.textarea`
  width: 800px;
  height: 100px;
  border-radius: 10px;
  border: none;
  resize: none;
  outline: none;
`;
export default RegisterPage;
