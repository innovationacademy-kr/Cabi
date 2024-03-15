import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import PresentationCardContainer from "@/Presentation/components/Home/PresentationCard.container";
import { IPresentationScheduleDetailInfo } from "@/Presentation/types/dto/presentation.dto";
import { axiosGetPresentation } from "@/Presentation/api/axios/axios.custom";

const RecentPresentation = ({
  presentButtonHandler,
}: {
  presentButtonHandler: () => void;
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentPresentations, setCurrentPresentations] = useState<
    IPresentationScheduleDetailInfo[] | null
  >(null);
  const navigator = useNavigate();

  const getCurrentPresentation = async () => {
    try {
      const response = await axiosGetPresentation();
      setCurrentPresentations([
        ...response.data.past,
        ...response.data.upcoming,
      ]);
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
      setIsMobile(window.innerWidth < 1150);
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
              navigator("/presentation/register");
            }}
          >
            발표신청
          </RegistButtonStyled>
        </TitleContainerStyled>
        <span className="subtitle">수요일 오후 2시 지식이 일상이 되다.</span>
      </HeaderStyled>

      <PresentationCardContainer
        isMobile={isMobile}
        currentPresentations={currentPresentations}
      />
      <MobileRegistButtonStyled
        onClick={() => {
          navigator("/presentation/register");
        }}
      >
        발표신청
      </MobileRegistButtonStyled>
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
  max-width: 1000px;
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
    word-break: keep-all;
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
  @media screen and (max-width: 425px) {
    display: none;
  }
`;
const MobileRegistButtonStyled = styled.button`
  background-color: #3f69fd;
  width: 80%;
  height: 50px;
  font-weight: 60;
  margin-bottom: 30px;
  margin-top: 30px;
  @media screen and (min-width: 425px) {
    display: none;
  }
`;
