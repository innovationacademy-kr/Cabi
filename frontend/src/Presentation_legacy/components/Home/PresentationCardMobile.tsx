import { useRef } from "react";
import styled from "styled-components";
import { ReactComponent as CalendarIcon } from "@/Cabinet/assets/images/calendar.svg";
import { IDate } from "@/Presentation_legacy/components/Details/DetailContent.container";
import { presentationCategoryIconMap } from "@/Presentation_legacy/assets/data/maps";
import { IPresentationScheduleDetailInfo } from "@/Presentation_legacy/types/dto/presentation.dto";
import { makeIDateObj } from "@/Presentation_legacy/utils/dateUtils";

const PresentationCardMobile = ({
  refinePresentations,
  searchCategory,
  selectIndex,
  slide,
  onCardClick,
  swipeSection,
}: {
  refinePresentations: IPresentationScheduleDetailInfo[] | undefined;
  searchCategory: (
    categoryName: keyof typeof presentationCategoryIconMap | null
  ) => React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  selectIndex: number;
  slide: number;
  onCardClick: (index: number) => void;
  swipeSection: (
    touchEndPosX: number,
    touchEndPosY: number,
    touchStartPosX: number,
    touchStartPosY: number
  ) => void;
}) => {
  const touchStartPosX = useRef(0);
  const touchStartPosY = useRef(0);
  const components = [];

  for (let i = 0; i < 3; i++) {
    components.push(
      <Paginations
        key={i}
        onClick={() => onCardClick(i)}
        current={i == selectIndex}
      ></Paginations>
    );
  }

  return (
    <>
      <Container select={slide}>
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
            <PresentationCardStyled
              key={index}
              onClick={() => onCardClick(index)}
              className={index == slide ? "check" : "not-check"}
              onTouchStart={(e: React.TouchEvent) => {
                touchStartPosX.current = e.changedTouches[0].screenX;
                touchStartPosY.current = e.changedTouches[0].screenY;
              }}
              onTouchEnd={(e: React.TouchEvent) => {
                swipeSection(
                  e.changedTouches[0].screenX,
                  e.changedTouches[0].screenY,
                  touchStartPosX.current,
                  touchStartPosY.current
                );
              }}
            >
              {p.id !== -1 ? (
                <>
                  <CategoryStyled>
                    <CategoryIconStyled>
                      {p.category && <CategoryIcon />}
                    </CategoryIconStyled>
                  </CategoryStyled>
                  <DetailStyled>
                    <TitleStyled>{p.subject}</TitleStyled>
                    <SubTitleStyled>{p.summary}</SubTitleStyled>
                    <DetailFooterStyled>
                      <NameStyled>{p.userName} </NameStyled>
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
      <PaginationStyled>{components}</PaginationStyled>
    </>
  );
};

export default PresentationCardMobile;

const Container = styled.div<{ select: number }>`
  overflow-x: hidden;
  display: flex;
  align-items: flex-start;
  width: 100%;
  min-width: 1000px;
  min-height: 500px;
  margin-bottom: 20px;
  transform: translateX(${(props) => props.select}px);
  transition: all 500ms ease-in-out;
`;

const PresentationCardStyled = styled.div`
  width: 300px;
  margin-right: 50px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
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

const DetailStyled = styled.div`
  width: 300px;
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
    content: "ㅣ";
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

  & > svg > path {
    stroke: var(--presentation-card-speaker-name-color);
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

const PaginationStyled = styled.div`
  display: flex;
  padding-bottom: 30px;
`;

const Paginations = styled.div<{ current: boolean }>`
  width: 30px;
  height: 10px;
  background-color: ${(props) =>
    props.current
      ? "var(--presentation-blue-pagination-btn-color)"
      : "var(--gray-line-btn-color)"};
  border-radius: 12px;
  margin: 0 5px;
`;
