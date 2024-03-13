import styled, { css, keyframes } from "styled-components";
import { IDate } from "@/components/Presentation/Details/DetailContent.container";
import {
  IPresentationInfo,
  IPresentationScheduleDetailInfo,
} from "@/types/dto/presentation.dto";

const PresentationCard = ({
  presentation,
  makeIDateObj,
  searchCategory,
}: {
  presentation: IPresentationScheduleDetailInfo[] | null;
  makeIDateObj: (date: Date) => IDate;
  searchCategory: (categoryName: string) => string | undefined;
}) => {
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
          <PresentationCardStyled key={index}>
            {p.id !== -1 ? (
              <>
                <DetailStyled>
                  <CategoryStyled>
                    {p.category && <img src={searchCategory(p.category)} />}
                  </CategoryStyled>
                  <TitleStyled>{p.subject}</TitleStyled>
                  <SubTitleStyled>{p.summary}</SubTitleStyled>
                  <DetailFooterStyled>
                    <NameStyled>{p.userName} |</NameStyled>
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
                <TitleStyled>예정된 일정이 없습니다.</TitleStyled>
                <TitleStyled>당신의 이야기를 들려주세요</TitleStyled>
              </>
            )}
          </PresentationCardStyled>
        );
      })}
    </ContainerStyled>
  );
};

export default PresentationCard;

const ContainerStyled = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
`;

const PresentationCardStyled = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-right: 50px;
`;

const DetailStyled = styled.div`
  width: 300px;
`;

const CategoryStyled = styled.div`
  width: 300px;
  height: 300px;
  margin-bottom: 16px;
  border-radius: 30px;
  background-color: #3f69fd;
`;

const TitleStyled = styled.div`
  width: 300px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 700;
  word-break: break-all;
  line-height: 1.5;
  margin-bottom: 12px;
`;

const SubTitleStyled = styled.div`
  width: 300px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 1.1rem;
  word-break: break-all;
  line-height: 1.5;
  margin-bottom: 12px;
  color: #797979;
`;

const DetailFooterStyled = styled.div`
  display: flex;
  align-items: center;
`;

const NameStyled = styled.div`
  white-space: nowrap;
  margin-right: 5px;
  color: #9d9d9d;
  font-weight: 500;
`;

const CalendarStyled = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  font-size: 1rem;
  & > span {
    color: #797979;
  }
`;

const IconStyled = styled.div`
  height: 15px;
  margin-right: 8px;
`;
