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
          <RegisterSubContentStyled>카테고리</RegisterSubContentStyled>
          <MultiToggleSwitchSeparated
            initialState={toggleType}
            setState={setToggleType}
            toggleList={toggleList}
            fontSize={"1rem"}
          />
        </SubtitleSection>
        <SubtitleSection>
          <RegisterSubContentStyled>제목</RegisterSubContentStyled>
          <RegisterSubTitleInputStyled placeholder="제목을 입력해주세요" />
        </SubtitleSection>
        <SubtitleSection>
          <DateTimeSection>
            <RegisterSubContentStyled>날짜</RegisterSubContentStyled>
          </DateTimeSection>
        </SubtitleSection>
        <SubtitleSection>
          <RegisterSubContentStyled>한줄 요약</RegisterSubContentStyled>
          <RegisterSubTitleInputStyled placeholder="한줄 요약을 입력해주세요" />
        </SubtitleSection>

        <SubtitleSection>
          <RegisterSubContentStyled>내용</RegisterSubContentStyled>
          <RegisterDetailInputStyled placeholder="내용을 입력해주세요" />
        </SubtitleSection>
        <RegisterButtonStyled>신청하기</RegisterButtonStyled>
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
  width: 880px;
  height: 1000px;
  border-radius: 10px;
  background-color: var(--lightgray-color);
  margin-top: 20px;
`;

const RegisterSubContentStyled = styled.div`
  margin-left: 5cqminpx;
  margin-top: 20px;
  font-weight: 700;
  font-size: 1.1rem;
  line-height: 2.25rem;
`;

const RegisterSubTitleInputStyled = styled.textarea`
  border-radius: 10px;
  border: none;
  resize: none;
  word-spacing: -4px;
  padding: 10px;
  font-size: 1rem;
  background-color: var(--white);
  width: 800px;
  height: 50px;
  outline: none;
`;

const SubtitleSection = styled.div`
  display: flex;
  width: 820px;
  flex-direction: column;
  justify-content: space-between;
`;

const RegisterDetailInputStyled = styled.textarea`
  width: 800px;
  height: 100px;
  padding: 10px;
  border-radius: 10px;
  font-size: 1rem;
  border: none;
  resize: none;
  outline: none;
`;

const RegisterButtonStyled = styled.button`
  width: 200px;
  height: 55px;
  font-weight: 500;
  margin-top: 20px;
  background-color: var(--main-color);
`;

const DateTimeSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 800px;
  font-size: 1rem;
`;

export default RegisterPage;
