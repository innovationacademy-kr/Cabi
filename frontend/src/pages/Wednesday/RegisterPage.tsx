import { useState } from "react";
import styled from "styled-components";
import { toggleItem } from "@/components/Common/MultiToggleSwitch";
import MultiToggleSwitchSeparated from "@/components/Common/MultiToggleSwitchSeparated";
import DropdownDateMenu from "@/components/Wednesday/Registers/DropdownDateMenu";
import DropdownTimeMenu from "@/components/Wednesday/Registers/DropdownTimeMenu";

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

  const [focusedSection, setFocusedSection] = useState<string | null>(null);

  const handleFocus = (sectionName: string) => {
    setFocusedSection(sectionName);
  };

  const handleBlur = () => {
    setFocusedSection(null);
  };

  return (
    <RegisterPageStyled>
      <RegisterTitleStyled>수요지식회 신청</RegisterTitleStyled>
      <RegisterBackgroundStyled>
        <SubSection>
          <RegisterSubContentFirstStyled>
            카테고리
          </RegisterSubContentFirstStyled>
          <MultiToggleSwitchSeparated
            initialState={toggleType}
            setState={setToggleType}
            toggleList={toggleList}
            fontSize={"0.94rem"}
          />
        </SubSection>
        <DateTimeContainer>
          <SubSection>
            <RegisterSubContentStyled>날짜</RegisterSubContentStyled>
            <RegisterTimeInputStyled>
              <DropdownDateMenu />
            </RegisterTimeInputStyled>
          </SubSection>
          <SubSection>
            <RegisterSubContentStyled>시간</RegisterSubContentStyled>
            <RegisterTimeInputStyled>
              <DropdownTimeMenu />
            </RegisterTimeInputStyled>
          </SubSection>
        </DateTimeContainer>
        <SubSection>
          <RegisterSubContentStyled>제목</RegisterSubContentStyled>
          <RegisterSubTitleInputStyled
            placeholder="제목을 입력해주세요"
            onFocus={() => handleFocus("title")}
            onBlur={handleBlur}
            isFocused={focusedSection === "title"}
            spellCheck={false}
          />
        </SubSection>
        <SubSection>
          <RegisterSubContentStyled>한줄 요약</RegisterSubContentStyled>
          <RegisterSubTitleInputStyled
            placeholder="한줄 요약을 입력해주세요"
            onFocus={() => handleFocus("summary")}
            onBlur={handleBlur}
            isFocused={focusedSection === "summary"}
            spellCheck={false}
          />
        </SubSection>
        <SubSection>
          <RegisterSubContentStyled>내용</RegisterSubContentStyled>
          <RegisterDetailInputStyled
            onFocus={() => handleFocus("content")}
            onBlur={handleBlur}
            isFocused={focusedSection === "content"}
            placeholder="내용을 입력해주세요"
            spellCheck={false}
          />
        </SubSection>
        <RegisterButtonStyled>신청하기</RegisterButtonStyled>
      </RegisterBackgroundStyled>
    </RegisterPageStyled>
  );
};

const RegisterPageStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  overflow-y: auto;
  @media (max-width: 700px) {
    background-color: var(--lightgray-color);
  }
`;

const RegisterTitleStyled = styled.h1`
  margin-top: 70px;
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 3rem;
`;

const RegisterBackgroundStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 720px;
  max-height: 800px;
  border-radius: 10px;
  background-color: var(--lightgray-color);
  margin-top: 20px;
  margin-bottom: 30px;
  padding: 20px;
`;

const RegisterSubContentFirstStyled = styled.div`
  margin-left: 5px;
  font-weight: 700;
  font-size: 1.1rem;
  line-height: 2.25rem;
  width: fit-content;
  @media (max-width: 700px) {
    width: 100%;
    height: 1500px;
  }
`;

const RegisterSubContentStyled = styled.div`
  margin-left: 5px;
  margin-top: 24px;
  font-weight: 700;
  font-size: 1.1rem;
  line-height: 2.25rem;
  width: fit-content;
  @media (max-width: 700px) {
    display: flex;
    flex-wrap: wrap;
  }
`;

const RegisterSubTitleInputStyled = styled.textarea<{ isFocused: boolean }>`
  border-radius: 10px;
  border: none;
  resize: none;
  word-spacing: -4px;
  padding: 10px;
  font-size: 0.9rem;
  background-color: var(--white);
  width: 660px;
  max-width: 800px;
  height: 56px;
  outline: none;
  border: 2px solid
    ${(props) =>
      props.isFocused ? "var(--main-color)" : "var(--lightgray-color)"};
`;

const SubSection = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

const RegisterDetailInputStyled = styled.textarea<{ isFocused: boolean }>`
  width: 660px;
  max-width: 800px;
  height: 100px;
  padding: 10px;
  border-radius: 10px;
  font-size: 0.9rem;
  word-spacing: -4px;
  border: none;
  resize: none;
  outline: none;
  border: 2px solid
    ${(props) =>
      props.isFocused ? "var(--main-color)" : "var(--lightgray-color)"};
`;

const RegisterTimeInputStyled = styled.div`
  max-width: 350px;
  height: 46px;
  border-radius: 10px;
  background-color: var(--white);
  border: none;
  resize: none;
  outline: none;
  cursor: pointer;
`;

const RegisterButtonStyled = styled.button`
  width: 130px;
  height: 40px;
  font-size: 1rem;
  font-weight: 480;
  margin-top: 20px;
  background-color: var(--main-color);
`;

const DateTimeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export default RegisterPage;
