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
      setIsMobile(window.innerWidth < 700);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ConTainerStyled>
      <HeaderStyled>
        <TitleContainerStyled>
          <p>수요지식회</p>
          <RegistButtonStyled
            onClick={() => {
              navigator("/wed/register");
            }}
          >
            발표하기
          </RegistButtonStyled>
        </TitleContainerStyled>
        <span>매주 수요일 오후 2시, 지식이 일상이 되다.</span>
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
`;

const HeaderStyled = styled.div`
  display: flex;
  width: 1060px;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: flex-end;
  margin-bottom: 40px;
  max-width: 1100px;

  & > span {
    display: block;
    font-size: 2rem;
    font-weight: 600;
  }
`;

const TitleContainerStyled = styled.div`
  & > p {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 20px;
  }

  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  border-bottom: 2px solid #d9d9d9;
  margin-bottom: 70px;
  width: 100%;
`;

const RegistButtonStyled = styled.button`
  background-color: #3f69fd;
  margin-bottom: 20px;
`;
