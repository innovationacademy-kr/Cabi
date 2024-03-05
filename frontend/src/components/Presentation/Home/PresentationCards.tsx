import { useEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import { IDate } from "@/components/Presentation/Details/DetailContent.container";
import {
  IAnimation,
  IPresentationCategoryIcon,
  IPresentationScheduleDetailInfo,
} from "@/types/dto/presentation.dto";
import { PresentationCategoryType } from "@/types/enum/Presentation/presentation.type.enum";

const WedCards = ({
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
  isNull: boolean;
  searchCategory: (categoryName: string) => string | undefined;
}) => {
  const onClick = (index: number) => {
    if (select) setSelect(index);
    else setSelect(index);
    (presentation || []).concat(
      Array.from({ length: 3 - (presentation || []).length })
    );
  };

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
          <WedCardStyled
            key={index}
            onClick={() => onClick(index)}
            className={index == select ? "check" : "not-check"}
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
    </ContainerStyled>
  );
};

export default WedCards;

const restore = ({
  min_width,
  min_height,
  max_width,
  max_height,
}: IAnimation) => keyframes`{
  0% {
    width: ${max_width}px;
	  height: ${max_height}px;
	}
	100% {
    width:${min_width}px;
	  height: ${min_height}px;
	}
}`;

const transform = ({
  min_width,
  min_height,
  max_width,
  max_height,
}: IAnimation) => keyframes`{
  0% {
    width: ${min_width}px;
	  height: ${min_height}px;
	}
	100% {
    width: ${max_width}px;
	  height: ${max_height}px;
	}
}`;

const font_restore = ({
  min_size,
  max_size,
}: {
  min_size: number;
  max_size: number;
}) => keyframes`{
  0% {
    font-size: ${max_size}rem;
	}
	100% {
    font-size:${min_size}rem;
	}
}`;

const font_transform = ({
  min_size,
  max_size,
}: {
  min_size: number;
  max_size: number;
}) => keyframes`{
  0% {
    font-size: ${min_size}rem;	  
	}
	100% {
    font-size: ${max_size}rem;
	}
}`;

const ContainerStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 380px;
  width: 90%;
  min-height: 380px;
  max-width: 1300px;
  min-width: 1000px;
  justify-content: space-around;
`;

const WedCardStyled = styled.div`
  width: 280px;
  height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  border-radius: 30px;
  margin-left: 20px;
  box-shadow: 10px 10px 25px 0 rgba(0, 0, 0, 0.2);

  &.check {
    animation: ${transform({
        min_width: 280,
        min_height: 280,
        max_width: 370,
        max_height: 370,
      })}
      0.5s ease-in-out;
    width: 370px;
    height: 370px;
    padding: 30px 30px;
    background-color: #dce7fd;
  }

  &.not-check {
    animation: ${restore({
        min_width: 280,
        min_height: 280,
        max_width: 370,
        max_height: 370,
      })}
      0.5s ease-in-out;
    padding: 30px 30px;
    :hover {
      transition: all 0.3s ease-in-out;
      transform: translateY(-6px);
    }
  }
`;

const CategoryStyled = styled.div`
  width: 90px;
  height: 90px;

  border-radius: 1000px;

  margin-bottom: 10px;

  ${WedCardStyled}.check & {
    animation: ${transform({
        min_width: 100,
        min_height: 90,
        max_width: 150,
        max_height: 140,
      })}
      0.5s ease-in-out;
    width: 150px;
    height: 140px;
  }

  ${WedCardStyled}.not-check & {
    animation: ${restore({
        min_width: 100,
        min_height: 90,
        max_width: 150,
        max_height: 140,
      })}
      0.5s ease-in-out;
    width: 100px;
    height: 90px;
  }
`;

const CalendarStyled = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
  font-size: 1rem;
  margin-top: 10px;

  & > {
    color: gray;
  }
  ${WedCardStyled}.not-check & {
    font-size: 0.7rem;
    margin-top: 2px;
  }
`;

const NameStyled = styled.div`
  color: #9d9d9d;
  font-size: 1.2rem;
  margin-bottom: 12px;

  ${WedCardStyled}.check & {
    font-size: 1.5rem;
  }
`;

const TitleStyled = styled.div`
  text-align: center;
  font-size: 1.1rem;
  font-weight: 700;
  word-break: break-all;
  white-space: pre-line;
  height: 38px;
  ${WedCardStyled}.check & {
    animation: ${font_transform({
        min_size: 1.1,
        max_size: 1.6,
      })}
      0.5s ease-in-out;
    font-size: 1.6rem;
  }
  ${WedCardStyled}.not-check & {
    animation: ${font_restore({
        min_size: 1.1,
        max_size: 1.6,
      })}
      0.5s ease-in-out;
    height: 35px;
  }
`;

const SubTitleStyled = styled.div`
  text-align: center;
  font-size: 1rem;
  margin-top: 30px;
  word-break: break-all;
  height: 32px;

  ${WedCardStyled}.check & {
    animation: ${font_transform({
        min_size: 0.8,
        max_size: 1,
      })}
      0.5s ease-in-out;
    height: 38px;
  }
  ${WedCardStyled}.not-check & {
    animation: ${font_restore({
        min_size: 0.8,
        max_size: 1,
      })}
      0.5s ease-in-out;
    margin-top: 20px;
    font-size: 0.8rem;
  }
`;

const IconStyled = styled.div`
  height: 15px;
  margin-right: 8px;
`;
