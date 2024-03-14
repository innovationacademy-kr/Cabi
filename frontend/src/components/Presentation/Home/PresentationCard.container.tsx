import { useState } from "react";
import styled from "styled-components";
import { IDate } from "@/components/Presentation/Details/DetailContent.container";
import { IPresentationScheduleDetailInfo } from "@/types/dto/presentation.dto";
import { PresentationCategoryType } from "@/types/enum/Presentation/presentation.type.enum";
import PresentationCard from "./PresentationCard";
import PresentationCardMobile from "./PresentationCardMobile";

const PresentationCardContainer = ({
  isMobile,
  currentPresentations,
}: {
  isMobile: boolean;
  currentPresentations: IPresentationScheduleDetailInfo[] | null;
}) => {
  const [selectIndex, setSelectIndex] = useState(1);
  const [slide, setSlide] = useState(0);

  const makeIDateObj = (date: Date) => {
    let dateISO = date.toISOString();
    // 1. T 앞에서 끊고
    let dateBeforeT = dateISO.substring(0, 10);
    // 2. -로 분리
    let dateSplited = dateBeforeT.split("-");

    const iDateObj: IDate = {
      year: dateSplited[0],
      month: dateSplited[1],
      day: dateSplited[2],
    };

    return iDateObj;
  };

  const presentationCategoryIcon = [
    {
      name: "/src/assets/images/PresentationFortyTwo.svg",
      key: PresentationCategoryType.TASK,
    },
    {
      name: "/src/assets/images/PresentationDevelop.svg",
      key: PresentationCategoryType.DEVELOP,
    },
    {
      name: "/src/assets/images/PresentationAcademic.svg",
      key: PresentationCategoryType.STUDY,
    },
    {
      name: "/src/assets/images/PresentationHobby.svg",
      key: PresentationCategoryType.HOBBY,
    },
    {
      name: "/src/assets/images/PresentationJob.svg",
      key: PresentationCategoryType.JOB,
    },
    {
      name: "/src/assets/images/PresentationEtc.svg",
      key: PresentationCategoryType.ETC,
    },
    { name: "/src/assets/images/PresentationEmpty.svg", key: "" },
  ];

  const searchCategory = (categoryName: string): string | undefined => {
    const foundCategory = presentationCategoryIcon.find(
      (category) => category.key === categoryName
    );
    return foundCategory ? foundCategory.name : undefined;
  };

  const onClick = (index: number) => {
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

  const refinePresentations = currentPresentations?.concat(
    new Array(Math.max(3 - (currentPresentations?.length || 0), 0)).fill({
      id: -1,
      subject: "예정된 일정이 없습니다. 당신의 이야기를 들려주세요",
      category: "",
    })
  );

  return (
    <ConTainerStyled>
      {isMobile ? (
        <PresentationCardMobile
          refinePresentations={refinePresentations}
          makeIDateObj={makeIDateObj}
          searchCategory={searchCategory}
          selectIndex={selectIndex}
          slide={slide}
          onClick={onClick}
          swipeSection={swipeSection}
        />
      ) : (
        <PresentationCard
          refinePresentations={refinePresentations}
          makeIDateObj={makeIDateObj}
          searchCategory={searchCategory}
        />
      )}
    </ConTainerStyled>
  );
};

export default PresentationCardContainer;

const ConTainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
  width: 80%;
  height: 550px;
`;
