import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import { IDate } from "@/components/Presentation/Details/DetailContent.container";
import PresentationCardsMobile from "@/components/Presentation/Home/PresentationCardsMobile";
import WedMainDesc from "@/components/Presentation/Home/PresentationMainDesc";
import {
  IPresentationInfo,
  IPresentationScheduleDetailInfo,
} from "@/types/dto/presentation.dto";
import { PresentationCategoryType } from "@/types/enum/Presentation/presentation.type.enum";
import { axiosGetPresentation } from "@/api/axios/axios.custom";
import PresentationCards from "./PresentationCards";
import RecentPresentation from "./RecentPresentation";

const RecentPresentationContainer = ({
  presentButtonHandler,
}: {
  presentButtonHandler: () => void;
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [select, setSelect] = useState(1);
  const [selectedPresentation, setSelectedPresentation] =
    useState<IPresentationInfo | null>(null);
  const [currentPresentations, setCurrentPresentations] = useState<
    IPresentationScheduleDetailInfo[] | null
  >(null);
  const [presentationLists, setPresentationLists] = useState(false);
  const [selectedDate, setSelectedDate] = useState<IDate | null>(null);

  const getCurrentPresentation = async () => {
    try {
      const response = await axiosGetPresentation();
      setCurrentPresentations(response.data.forms);
      if (response.data.forms) {
        setPresentationLists(true);
      } else setPresentationLists(false);
    } catch (error: any) {
      // TODO
    } finally {
      // TODO
    }
  };

  useEffect(() => {
    getCurrentPresentation();
    const handleResize = () => {
      setIsMobile(window.innerWidth < 700);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (currentPresentations) {
      setSelectedPresentation(currentPresentations[select]);
    }
  }, [currentPresentations, select]);

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

  return <RecentPresentation></RecentPresentation>;
};

export default RecentPresentationContainer;

const ConTainerStyled = styled.div`
  padding-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
`;
