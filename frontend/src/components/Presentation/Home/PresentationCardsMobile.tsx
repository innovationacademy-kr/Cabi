import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { IDate } from "@/components/Presentation/Details/DetailContent.container";
import { IPresentationScheduleDetailInfo } from "@/types/dto/presentation.dto";

const PresentationCardsMobile = ({
  presentation,
  select,
  setSelect,
  makeIDateObj,
  searchCategory,
}: {
  presentation: IPresentationScheduleDetailInfo[] | null;
  select: number;
  setSelect: (value: number) => void;
  makeIDateObj: (date: Date) => IDate;
  searchCategory: (categoryName: string) => string | undefined;
}) => {
  const [move, setMove] = useState(0);
  const touchStartPosX = useRef(0);
  const touchStartPosY = useRef(0);
  const components = [];

  useEffect(() => {
    setSelect(1);
  }, []);
  const currentPresentations = presentation?.concat(
    new Array(Math.max(3 - (presentation.length || 0), 0)).fill({
      id: -1,
      subject: "예정된 일정이 없습니다. 당신의 이야기를 들려주세요",
      category: "",
    })
  );

  const onPageClick = (i: number) => {
    if (i !== select) {
      setSelect(i);
      setMove(move + (select - i) * 300);
    }
  };

  for (let i = 0; i < 3; i++) {
    components.push(
      <Paginations
        key={i}
        onClick={() => onPageClick(i)}
        current={i == select}
      ></Paginations>
    );
  }

  const onClick = (index: number) => {
    if (select != index) {
      if (index < select) {
        setSelect(select - 1);
        setMove(move + 300);
      } else {
        setSelect(select + 1);
        setMove(move - 300);
      }
    }
  };

  const swipeSection = (touchEndPosX: number, touchEndPosY: number) => {
    const touchOffsetX = Math.round(touchEndPosX - touchStartPosX.current);
    const touchOffsetY = Math.round(touchEndPosY - touchStartPosY.current);
    if (
      Math.abs(touchOffsetX) < 50 ||
      Math.abs(touchOffsetX) < Math.abs(touchOffsetY)
    ) {
      return;
    }

    if (touchOffsetX > 0) {
      moveSectionTo("left");
    } else {
      moveSectionTo("right");
    }
  };

  const moveSectionTo = (direction: string) => {
    if (direction === "left" && select !== 0) {
      setSelect(select - 1);
      setMove(move + 300);
    } else if (direction === "right" && select !== 2) {
      setSelect(select + 1);
      setMove(move - 300);
    }
  };

  return (
    <ContainerStyled>
      <CardWrapperStyled select={move}>
        {currentPresentations?.map((p, index) => {
          const tmpDate =
            p.id !== -1 ? makeIDateObj(new Date(p.dateTime)) : null;

          return (
            <WedCardStyled
              key={index}
              onClick={() => onClick(index)}
              className={index == move ? "check" : "not-check"}
              onTouchStart={(e: React.TouchEvent) => {
                touchStartPosX.current = e.changedTouches[0].screenX;
                touchStartPosY.current = e.changedTouches[0].screenY;
              }}
              onTouchEnd={(e: React.TouchEvent) => {
                swipeSection(
                  e.changedTouches[0].screenX,
                  e.changedTouches[0].screenY
                );
              }}
            >
              {p.id !== -1 ? (
                <>
                  <CategoryStyled>
                    {p.category && <img src={searchCategory(p.category)} />}
                  </CategoryStyled>
                  <NameStyled>{p.userName}</NameStyled>
                  <TitleStyled>{p.subject}</TitleStyled>
                  <SubTitleStyled>{p.summary}</SubTitleStyled>
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
              {p.id !== -1 && (
                <CalendarStyled>
                  <IconStyled>
                    <img src="/src/assets/images/calendar.svg" alt="" />
                  </IconStyled>
                  <span>
                    {tmpDate?.month}/{tmpDate?.day}
                  </span>
                </CalendarStyled>
              )}
            </WedCardStyled>
          );
        })}
      </CardWrapperStyled>

      <PaginationStyled>{components}</PaginationStyled>
    </ContainerStyled>
  );
};

export default PresentationCardsMobile;

const ContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
  width: 100%;
  height: 380px;
  min-height: 380px;
`;

const CardWrapperStyled = styled.div<{ select: number }>`
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 380px;
  min-height: 370px;
  max-width: 1300px;
  min-width: 1000px;
  overflow-x: hidden;
  transform: translateX(${(props) => props.select}px);
  transition: all 500ms ease-in-out;
`;

const WedCardStyled = styled.div`
  width: 280px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #fff;
  border-radius: 30px;
  margin: 0 10px;
  box-shadow: 10px 10px 25px 0 rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
  padding: 0 30px;
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

const CalendarStyled = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
  padding-right: 10px;

  & > {
    color: gray;
  }
`;

const IconStyled = styled.div`
  height: 15px;
  margin-right: 8px;
`;

const CategoryStyled = styled.div`
  // background-color: gray;
  width: 100px;
  height: 90px;
  border-radius: 300px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const NameStyled = styled.div`
  color: #9d9d9d;
  font-size: 1.2rem;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const TitleStyled = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  word-break: break-all;
`;

const SubTitleStyled = styled.div`
  font-size: 0.8rem;
  margin-top: 30px;
  word-break: break-all;
`;
