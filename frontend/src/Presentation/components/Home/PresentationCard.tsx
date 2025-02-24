import styled from "styled-components";
import { ReactComponent as CalendarIcon } from "@/Cabinet/assets/images/calendar.svg";
import { presentationCategoryIconMap } from "@/Presentation/assets/data/maps";
import { IPresentationScheduleDetailInfo } from "@/Presentation/types/dto/presentation.dto";
import { makeIDateObj } from "@/Presentation/utils/dateUtils";

const PresentationCard = ({
  searchCategory,
  refinePresentations,
}: {
  searchCategory: (
    categoryName: keyof typeof presentationCategoryIconMap | null
  ) => React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  refinePresentations: IPresentationScheduleDetailInfo[] | undefined;
}) => {
  return (
    <Container>
      {refinePresentations?.map((p, index) => {
        let tmpDate = null;
        let CategoryIcon = null;
        if (p.id !== -1) {
          tmpDate = makeIDateObj(new Date(p.dateTime));
          CategoryIcon = searchCategory(p.category);
        } else {
          CategoryIcon = searchCategory(null);
        }
        return (
          <PresentationCardStyled key={index}>
            {p.id !== -1 ? (
              <>
                <DetailStyled>
                  <CategoryStyled>
                    <CategoryIconStyled>
                      {p.category && <CategoryIcon />}
                    </CategoryIconStyled>
                  </CategoryStyled>
                  <TitleStyled>{p.subject}</TitleStyled>
                  <SubTitleStyled>{p.summary}</SubTitleStyled>
                  <DetailFooterStyled>
                    <NameStyled>{p.userName}</NameStyled>
                    <CalendarStyled>
                      <IconStyled>
                        <CalendarIcon />
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
                  <CategoryIconStyled>
                    <CategoryIcon />
                  </CategoryIconStyled>
                </CategoryStyled>
                <TitleStyled>예정된 일정이 없습니다.</TitleStyled>
                <TitleStyled>당신의 이야기를 들려주세요</TitleStyled>
              </>
            )}
          </PresentationCardStyled>
        );
      })}
    </Container>
  );
};

export default PresentationCard;

const Container = styled.div`
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
  background-color: var(--sys-main-color);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CategoryIconStyled = styled.div`
  width: 300px;
  height: 220px;
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
  color: var(--presentation-card-sub-title-color);
`;

const DetailFooterStyled = styled.div`
  display: flex;
  align-items: center;
`;

const NameStyled = styled.div`
  white-space: nowrap;
  margin-right: 5px;
  color: var(--presentation-card-speaker-name-color);
  font-weight: 500;

  ::after {
    content: " ㅣ";
  }
`;

const CalendarStyled = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  font-size: 1rem;
  & > span {
    color: var(--presentation-card-speaker-name-color);
  }
`;

const IconStyled = styled.div`
  height: 15px;
  width: 15px;
  margin-right: 8px;

  & > svg > path {
    stroke: var(--presentation-card-speaker-name-color);
  }
`;
