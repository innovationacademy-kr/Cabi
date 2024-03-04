import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import { IDate } from "@/components/Wednesday/Details/DetailContent.container";
import WedCards from "@/components/Wednesday/Home/WedCards";
import WedCardsMobile from "@/components/Wednesday/Home/WedCardsMobile";
import WedMainDesc from "@/components/Wednesday/Home/WedMainDesc";
import {
  IPresentationInfo,
  IPresentationScheduleDetailInfo,
} from "@/types/dto/wednesday.dto";
import {
  PresentationCategoryType,
  PresentationPeriodType,
} from "@/types/enum/Presentation/presentation.type.enum";
import { axiosGetPresentation } from "@/api/axios/axios.custom";

// export interface IPresentation {
//   image: string; // 나중에 뺴기
//   subject: string | null;
//   summary: string | null;
//   detail: string | null;
//   dateTime: string;
//   category: PresentationCategoryType | null;
//   userName: string | null;
//   id: number;
//   presentationStatus?: string | null;
//   presentationTime: PresentationPeriodType | null;
//   presentationLocation?: string | null;
// }

const RecentPresentation = ({
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
  const navigator = useNavigate();

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

  return (
    <ConTainerStyled>
      <WedHeaderStyled>
        <WedTitleStyled>
          <p>42 수요지식회</p>
          <span>수요지식회 메인페이지입니다. 설명문구 필요합니다.</span>
        </WedTitleStyled>
        <RegistButtonStyled
          onClick={() => {
            navigator("/wed/register");
          }}
        >
          발표하기
        </RegistButtonStyled>
      </WedHeaderStyled>

      {isMobile ? (
        <WedCardsMobile
          presentation={currentPresentations}
          select={select}
          setSelect={setSelect}
          makeIDateObj={makeIDateObj}
        />
      ) : (
        <WedCards
          select={select}
          setSelect={setSelect}
          presentation={currentPresentations}
          makeIDateObj={makeIDateObj}
          isNull={presentationLists}
        />
      )}
      <WedMainDesc
        selectedPresentation={selectedPresentation}
        selectedDate={selectedDate!}
      />
    </ConTainerStyled>
  );
};

export default RecentPresentation;

const ConTainerStyled = styled.div`
  padding-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
`;

const WedHeaderStyled = styled.div`
  display: flex;
  width: 80%;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: flex-end;
  margin-bottom: 40px;
  max-width: 1100px;
`;

const WedTitleStyled = styled.div`
  & > p {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 20px;
  }

  margin-right: 20px;
`;

const RegistButtonStyled = styled.button`
  background-color: #3f69fd;
  margin-top: 20px;
`;
