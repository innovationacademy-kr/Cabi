import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import PresentationCard from "@/Presentation/components/Home/PresentationCard";
import PresentationCardMobile from "@/Presentation/components/Home/PresentationCardMobile";
import { presentationCategoryIconMap } from "@/Presentation/assets/data/maps";
import { IPresentationScheduleDetailInfo } from "@/Presentation/types/dto/presentation.dto";
import { PresentationCategoryType } from "@/Presentation/types/enum/presentation.type.enum";
import useIsMobile from "@/Presentation/hooks/useIsMobile";

const PresentationCardContainer = ({
  currentPresentations,
}: {
  currentPresentations: IPresentationScheduleDetailInfo[] | null;
}) => {
  const isMobile = useIsMobile(1150);
  const [selectIndex, setSelectIndex] = useState(1);
  const [slide, setSlide] = useState(0);

  const searchCategory = (
    categoryName?: keyof typeof presentationCategoryIconMap
  ): string => {
    return categoryName != undefined
      ? presentationCategoryIconMap[categoryName]
      : "/src/Cabinet/assets/images/PresentationEmpty.svg";
  };

  const onCardClick = (index: number) => {
    if (selectIndex !== index) {
      setSelectIndex(index);
      setSlide(slide + (selectIndex - index) * 345);
    }
  };

  const swipeSection = (
    touchEndPosX: number,
    touchEndPosY: number,
    touchStartPosX: number,
    touchStartPosY: number
  ) => {
    const touchOffsetX = Math.round(touchEndPosX - touchStartPosX);
    const touchOffsetY = Math.round(touchEndPosY - touchStartPosY);

    if (
      Math.abs(touchOffsetX) < 50 ||
      Math.abs(touchOffsetX) < Math.abs(touchOffsetY)
    ) {
      return;
    }

    if (touchOffsetX > 0) {
      slideSectionTo("left");
    } else {
      slideSectionTo("right");
    }
  };

  const slideSectionTo = (direction: string) => {
    if (direction === "left" && selectIndex !== 0) {
      setSelectIndex(selectIndex - 1);
      setSlide(slide + 345);
    } else if (direction === "right" && selectIndex !== 2) {
      setSelectIndex(selectIndex + 1);
      setSlide(slide - 345);
    }
  };

  const refinePresentations = useMemo(() => {
    return currentPresentations?.concat(
      new Array(Math.max(3 - (currentPresentations?.length || 0), 0)).fill({
        id: -1,
        subject: "예정된 일정이 없습니다. 당신의 이야기를 들려주세요",
        category: "",
      })
    );
  }, [currentPresentations]);

  return (
    <ConTainer>
      {isMobile ? (
        <PresentationCardMobile
          refinePresentations={refinePresentations}
          searchCategory={searchCategory}
          selectIndex={selectIndex}
          slide={slide}
          onCardClick={onCardClick}
          swipeSection={swipeSection}
        />
      ) : (
        <PresentationCard
          refinePresentations={refinePresentations}
          searchCategory={searchCategory}
        />
      )}
    </ConTainer>
  );
};

export default PresentationCardContainer;

const ConTainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
  width: 80%;
  height: 550px;
`;
