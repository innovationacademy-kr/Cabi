import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import { IPresentationScheduleDetailInfo } from "@/types/dto/presentation.dto";
import { axiosGetPresentation } from "@/api/axios/axios.custom";
import PresentationCardContainer from "./PresentationCard.container";

const RecentPresentation = ({
  presentButtonHandler,
}: {
  presentButtonHandler: () => void;
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentPresentations, setCurrentPresentations] = useState<
    IPresentationScheduleDetailInfo[] | null
  >(null);
  // 뭐하는 변수일까
  // const [presentationLists, setPresentationLists] = useState(false);
  const navigator = useNavigate();

  const getCurrentPresentation = async () => {
    try {
      const response = await axiosGetPresentation();
      setCurrentPresentations(response.data.forms);
      if (response.data.forms) {
        // setPresentationLists(true); // 아마 받아오는 데이터가 없을떄 .. 이건 나중에 고려
      }
      // else setPresentationLists(false);
    } catch (error: any) {
      // TODO
    } finally {
      // TODO
    }
  };

  useEffect(() => {
    getCurrentPresentation();
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ConTainerStyled>
      <HeaderStyled>
        <TitleContainerStyled>
          <h1 className="title">수요지식회</h1>
          <RegistButtonStyled
            onClick={() => {
              navigator("/wed/register");
            }}
          >
            신청하기
          </RegistButtonStyled>
        </TitleContainerStyled>
        <span className="subtitle">수요일 오후 2시, 지식이 일상이 되다.</span>
      </HeaderStyled>

      <PresentationCardContainer
        isMobile={isMobile}
        currentPresentations={currentPresentations}
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
  overflow-x: hidden;
`;

const HeaderStyled = styled.div`
  display: flex;
  max-width: 1060px;
  width: 80%;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: flex-end;

  & > span {
    margin-top: 10px;
    margin-bottom: 40px;
    display: block;
    font-size: 2rem;
    font-weight: 600;
  }


  @media screen and (max-width: 425px) {
    .title {
    font-size: 1.5rem;
    }
    .subtitle {
    font-size: 1.25rem;
    }
    & > div {
      margin-bottom: 0px;
      padding-bottom: 0px;
      align-items: center; 
    }
  }
`;

const TitleContainerStyled = styled.div`
  & > h1 {
    font-size: 2.5rem;
    font-weight: 700;
  }

  padding-bottom: 10px;
  margin-bottom: 10px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-weight: 700;
  border-bottom: 2px solid #d9d9d9;
  width: 100%;

`;

const RegistButtonStyled = styled.button`
  background-color: #3f69fd;
  width: 150px;
  height: 50px;
  font-weight: 600;
  @media screen and (max-width:425px){
    /* width: 30%; */
    height: 30px;
    width: 100px;
    font-weight: lighter;
    font-size: 1rem;
  }
`;
