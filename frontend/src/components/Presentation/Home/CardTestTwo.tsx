import { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { IDate } from "@/components/Presentation/Details/DetailContent.container";
import {
  IAnimation,
  IPresentationInfo,
  IPresentationScheduleDetailInfo,
} from "@/types/dto/presentation.dto";
import PresentationCardDetailTest from "./PresentationCardDetailTest";
import PresentationCardDetail from "./PresentationMainDesc";

const CardTestTwo = ({
  presentation,
  selectIndex,
  makeIDateObj,
  searchCategory,
  onClick,
  selectedPresentation,
  selectedDate,
}: {
  presentation: IPresentationScheduleDetailInfo[] | null;
  selectIndex: number;
  makeIDateObj: (date: Date) => IDate;
  searchCategory: (categoryName: string) => string | undefined;
  onClick: (index: number, type: string) => void;
  selectedPresentation: IPresentationInfo | null;
  selectedDate: IDate | null;
}) => {
  // datatime 다음주 날짜 가져오고 싶다..
  const [test, setTest] = useState<IPresentationScheduleDetailInfo>();
  const currentPresentations = presentation?.concat(
    new Array(Math.max(3 - (presentation.length || 0), 0)).fill({
      id: -1,
      subject: "예정된 일정이 없습니다. 당신의 이야기를 들려주세요",
      category: "",
    })
  );

  const components = [];

  console.log("selectIndex", selectIndex);

  useEffect(() => {
    setTest(currentPresentations?.[selectIndex]);
  }, [selectIndex]);

  useEffect(() => console.log("test", test), [test]);

  for (let i = 0; i < 3; i++) {
    components.push(
      <Paginations
        key={i}
        // onClick={() => onClick(i, "mobile")}
        current={i == selectIndex}
      ></Paginations>
    );
  }

  return (
    <ContainerStyled>
      <TestContainer>
        <PresentationCardFrontStyled>
          <TestBtn onClick={() => onClick(selectIndex, "Test2_left")}>
            버튼 left
          </TestBtn>
          <ContentStyled>
            <CategoryStyled>
              {currentPresentations?.[selectIndex].category && (
                <img
                  src={searchCategory(
                    currentPresentations?.[selectIndex].category
                  )}
                />
              )}
            </CategoryStyled>
            <NameStyled>
              {currentPresentations?.[selectIndex].userName}
            </NameStyled>
            <TitleStyled>
              {currentPresentations?.[selectIndex].subject}
            </TitleStyled>
            <SubTitleStyled>
              {currentPresentations?.[selectIndex].summary}
            </SubTitleStyled>

            <CalendarStyled>
              <IconStyled>
                <img src="/src/assets/images/calendar.svg" alt="" />
              </IconStyled>
              <span>{/* {tmpDate?.month}/{tmpDate?.day} */}</span>
            </CalendarStyled>
          </ContentStyled>
        </PresentationCardFrontStyled>

        <PresentationCardBackStyled>
          {/* {selectedPresentation?.detail} */}
          {currentPresentations?.[selectIndex].subject}
          {/* <TitleStyled>설명</TitleStyled>
          <TitleStyled>당신의 이야기를 들려주세요</TitleStyled> */}
          <TestBtn onClick={() => onClick(selectIndex, "Test2_right")}>
            버튼 right
          </TestBtn>
        </PresentationCardBackStyled>
      </TestContainer>
      <PaginationStyled>{components}</PaginationStyled>
    </ContainerStyled>
  );
};

export default CardTestTwo;

const ContentStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const TestBtn = styled.div`
  width: 40px;
  height: 40px;
  background-color: pink;

  position: absolute;
  top: 180px;
  left: -40px;
`;

const ContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TestContainer = styled.div`
  min-width: 1000px;
  //   max-width: 1200px;
  display: flex;
  justify-content: space-between;
`;

const PresentationCardFrontStyled = styled.div`
  background: linear-gradient(#fff, #6296ff);
  width: 400px;
  height: 400px;
  //   display: flex;
  //   flex-direction: column;
  //   align-items: center;
  //   justify-content: flex-start;
  border-radius: 30px;
  padding: 40px 30px 0 30px;
  margin-left: 20px;
  box-shadow: 10px 10px 25px 0 rgba(0, 0, 0, 0.2);
  transition: 0.5s ease-in-out;

  position: relative;
`;

const PresentationCardBackStyled = styled.div`
  background: linear-gradient(#6296ff, #d3e1ff);
  width: 400px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  border-radius: 30px;
  padding: 40px 30px 0 30px;
  margin-left: 20px;
  box-shadow: 10px 10px 25px 0 rgba(0, 0, 0, 0.2);
  transition: 0.5s ease-in-out;

  position: relative;
`;

const CategoryStyled = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 1000px;
  margin-bottom: 20px;
`;

const NameStyled = styled.div`
  color: #9d9d9d;
  height: 30px;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
`;

const TitleStyled = styled.div`
  width: 240px;
  height: 60px;

  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;

  font-size: 1.5rem;
  font-weight: 700;
  word-break: break-all;
  margin-bottom: 30px;

  // white-space: pre-line;
`;

const SubTitleStyled = styled.div`
  width: 240px;
  height: 45px;

  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
  word-break: break-all;
  margin-bottom: 20px;
`;

const CalendarStyled = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
  font-size: 1rem;

  & > {
    color: gray;
  }
`;

const IconStyled = styled.div`
  height: 15px;
  margin-right: 8px;
`;

const PaginationStyled = styled.div`
  display: flex;
`;

const Paginations = styled.div<{ current: boolean }>`
  width: 30px;
  height: 10px;
  background-color: ${(props) => (props.current ? "#5378fd" : "gray")};
  border-radius: 12px;
  margin: 0 5px;
`;
