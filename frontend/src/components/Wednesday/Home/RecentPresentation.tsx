import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import { axiosGetPresentation } from "@/api/axios/axios.custom";
import WedCard from "./WedCard";
import WedCardMobile from "./WedCardMobile";
import WedMainDesc from "./WedMainDesc";

// const presentation: IPresentation[] = [
//   {
//     id: 1,
//     image: "img1",
//     subject: "h1",
//     summary: "한줄요약 1",
//     detail: "상세설명 1",
//     dateTime: "cal1",
//     category: "DEVELOP",
//     presentationTime: "HALF",
//     userName: "jusohn",
//   },
//   {
//     id: 2,
//     image: "img2",
//     subject: "h2",
//     summary: "한줄요약 2",
//     detail:
//       "상세설명 2asdfasdfawflahwgjkahwlg;adfioawhlsg;khaw awoifhaejkrwls qawfgoiahjwga awrg;iah war;goihaw awrf;oiahwfog awgrp o;iahg agaoiwrgh     awrg;oihaw;ogrhoa a;gorihae;org alrghewlagwlrguhwe ;oawiejfhioio qoiw;ehfroiu qw pq34209u93uw h paoiwherfsjkdfbv q qpoihfej qp340qu034i q 2490qu2309[rqhio4",
//     dateTime: "cal2",
//     category: "DEVELOP",
//     presentationTime: "HOUR",
//     userName: "miyu",
//   },
//   {
//     id: 3,
//     image: "img3",
//     subject: "h3",
//     summary: "한줄요약 3",
//     detail: "상세설명 3",
//     dateTime: "cal3",
//     category: "DEVELOP",
//     presentationTime: "TWO_HOUR",
//     userName: "jeekim",
//   },
// ];

export interface IPresentation {
  image: string; // 나중에 뺴기
  subject: string | null;
  summary: string | null;
  detail: string | null;
  dateTime: string;
  category: string;
  userName: string | null;
  id: number;
  presentationStatus?: string | null;
  presentationTime: string | null;
  presentationLocation?: string | null;
}

export interface IAnimation {
  min_width: number;
  min_height: number;
  max_width: number;
  max_height: number;
}

const RecentPresentation = ({
  presentButtonHandler,
}: {
  presentButtonHandler: () => void;
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [select, setSelect] = useState(1);
  const [test, setTest] = useState<IPresentation | null>(null);
  const [currentPresentations, setCurrentPresentations] = useState<
    IPresentation[] | null
  >(null);
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
    if (currentPresentations) setTest(currentPresentations[select]);
  }, [select]);

  const getCurrentPresentation = async () => {
    try {
      const response = await axiosGetPresentation();
      setCurrentPresentations(response.data.forms);
    } catch (error: any) {
      // TODO
    } finally {
      // TODO
    }
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
        <WedCardMobile
          presentation={currentPresentations}
          select={select}
          setSelect={setSelect}
        />
      ) : (
        <WedCard
          select={select}
          setSelect={setSelect}
          presentation={currentPresentations}
        />
      )}
      <WedMainDesc test={test} />
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
