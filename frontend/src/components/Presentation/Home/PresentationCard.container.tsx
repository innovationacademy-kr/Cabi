import { useEffect, useState } from "react";
import styled from "styled-components";
import { IDate } from "@/components/Presentation/Details/DetailContent.container";
import PresentationCardDetail from "@/components/Presentation/Home/PresentationMainDesc";
import {
  IPresentationInfo,
  IPresentationScheduleDetailInfo,
} from "@/types/dto/presentation.dto";
import { PresentationCategoryType } from "@/types/enum/Presentation/presentation.type.enum";
import PresentationCard from "./PresentationCards";
import PresentationCardMobile from "./PresentationCardsMobile";

const PresentationCardContainer = ({
  isMobile,
  currentPresentations,
}: {
  isMobile: boolean;
  currentPresentations: IPresentationScheduleDetailInfo[] | null;
}) => {
  const [selectIndex, setSelectIndex] = useState(1);
  const [selectedPresentation, setSelectedPresentation] =
    useState<IPresentationInfo | null>(null);
  const [selectedDate, setSelectedDate] = useState<IDate | null>(null);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (currentPresentations) {
      setSelectedPresentation(currentPresentations[selectIndex]);
    }
  }, [currentPresentations, selectIndex]);

  useEffect(() => {
    if (selectedPresentation) {
      const tmpDate = makeIDateObj(new Date(selectedPresentation.dateTime));
      setSelectedDate(tmpDate);
    }
  }, [selectedPresentation]);

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

  useEffect(() => {
    if (selectIndex === 0) setSlide(slide + 300);
    if (selectIndex === 2) setSlide(slide - 300);
  }, []);

  const onClick = (index: number, type: string) => {
    if (type === "mobile") {
      if (selectIndex !== index) {
        setSelectIndex(index);
        setSlide(slide + (selectIndex - index) * 300);
      }
    } else {
      if (selectIndex) setSelectIndex(index);
      else setSelectIndex(index);
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
      SlideSectionTo("left");
    } else {
      SlideSectionTo("right");
    }
  };

  const SlideSectionTo = (direction: string) => {
    if (direction === "left" && selectIndex !== 0) {
      setSelectIndex(selectIndex - 1);
      setSlide(slide + 300);
    } else if (direction === "right" && selectIndex !== 2) {
      setSelectIndex(selectIndex + 1);
      setSlide(slide - 300);
    }
  };

  return (
    <ConTainerStyled>
      {isMobile ? (
        <PresentationCardMobile
          presentation={currentPresentations}
          selectIndex={selectIndex}
          makeIDateObj={makeIDateObj}
          searchCategory={searchCategory}
          slide={slide}
          onClick={onClick}
          swipeSection={swipeSection}
        />
      ) : (
        <PresentationCard
          selectIndex={selectIndex}
          presentation={currentPresentations}
          makeIDateObj={makeIDateObj}
          searchCategory={searchCategory}
          onClick={onClick}
        />
      )}
      <PresentationCardDetail
        selectedPresentation={selectedPresentation}
        selectedDate={selectedDate!}
      />
    </ConTainerStyled>
  );
};

export default PresentationCardContainer;

const ConTainerStyled = styled.div`
  padding-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`;
