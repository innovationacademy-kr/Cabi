import styled, { css, keyframes } from "styled-components";
import { IDate } from "@/components/Presentation/Details/DetailContent.container";
import {
  IAnimation,
  IPresentationInfo,
  IPresentationScheduleDetailInfo,
} from "@/types/dto/presentation.dto";
import PresentationCardDetailTest from "./PresentationCardDetailTest";
import PresentationCardDetail from "./PresentationMainDesc";

const PresentationCardTest = ({
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
  const currentPresentations = presentation?.concat(
    new Array(Math.max(3 - (presentation.length || 0), 0)).fill({
      id: -1,
      subject: "예정된 일정이 없습니다. 당신의 이야기를 들려주세요",
      category: "",
    })
  );

  return (
    <ContainerStyled>
      {currentPresentations?.map((p, index) => {
        const tmpDate = p.id !== -1 ? makeIDateObj(new Date(p.dateTime)) : null;
        return (
          <PresentationCardStyled
            key={index}
            onClick={() => onClick(index, "web")}
            className={index == selectIndex ? "check" : "not-check"}
          >
            {p.id !== -1 ? (
              <>
                <CategoryStyled>
                  {p.category && <img src={searchCategory(p.category)} />}
                </CategoryStyled>
                <DetailStyled>
                  <TitleStyled>{p.subject}</TitleStyled>
                  <SubTitleStyled>{p.summary}</SubTitleStyled>
                  <DetailFooterStyled>
                    <NameStyled>{p.userName}</NameStyled>
                    <CalendarStyled>
                      <IconStyled>
                        <img src="/src/assets/images/calendar.svg" alt="" />
                      </IconStyled>
                      <span>
                        {tmpDate?.month}/{tmpDate?.day}
                      </span>
                    </CalendarStyled>
                  </DetailFooterStyled>
                </DetailStyled>
              </>
            ) : (
              <>
                <CategoryStyled>
                  <img src={searchCategory("")} />
                </CategoryStyled>
                <TitleStyled>여러분의 발표를 기다립니다.</TitleStyled>
                <TitleStyled>
                  예정된 일정이 없습니다. 당신의 이야기를 들려주세요
                </TitleStyled>
              </>
            )}
          </PresentationCardStyled>
        );
      })}
    </ContainerStyled>
  );
};

export default PresentationCardTest;

const ContainerStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1060px;
  width: 1060px;
  justify-content: space-between;
`;

const PresentationCardStyled = styled.div`
  width: 320px;
  height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  justify-content: flex-start;
`;

const CategoryStyled = styled.div`
  width: 320px;
  height: 320px;
  margin-bottom: 16px;
  border-radius: 30px;
  background-color: #3f69fd;
`;

const DetailStyled = styled.div``;

const DetailFooterStyled = styled.div`
  width: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TitleStyled = styled.div`
  width: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 700;
  word-break: break-all;
  line-height: 1.5;
  margin-bottom: 12px;
`;

const SubTitleStyled = styled.div`
  width: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
  line-height: 1.5;
  word-break: break-all;
  margin-bottom: 12px;
  color: #797979;
`;

const NameStyled = styled.div`
  color: #9d9d9d;
  font-weight: 600;
`;

const CalendarStyled = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
  font-size: 1rem;

  & > span {
    color: #797979;
  }
`;

const IconStyled = styled.div`
  height: 15px;
  margin-right: 8px;
`;
