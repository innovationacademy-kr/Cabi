import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import HomeButton from "../atoms/buttons/HomeButton";
import LocationButton from "../atoms/buttons/LocationButton";
import MenuButton from "../atoms/buttons/MenuButton";
import FloorButton from "../atoms/buttons/FloorButton";
import QuestionButton from "../atoms/buttons/QustionButton";
import GuideModal from "../atoms/modals/GuideModal";
import GuideBox from "../atoms/modals/GuideBox";
import Carousel from "../organisms/Carousel";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  CabinetLocationFloorDto,
  CabinetInfoByLocationFloorDto,
} from "../../types/dto/cabinet.dto";
import {
  axiosLocationFloor,
  axiosCabinetByLocationFloor,
} from "../../network/axios/axios.custom";

const MainSection = styled.section`
  height: 100%;
  width: 100%;
  background-color: #ffffffec;
  border-radius: 1rem;
  Button {
    color: #333;
  }
`;

const MainNavSection = styled.div`
  display: flex;
  justify-content: space-between;
  height: 5%;
  max-height: 2rem;
  padding: 0.5rem 0.7rem 0 0.7rem;
`;

const MainFloorSection = styled.div`
  height: 5%;
  max-height: 2rem;
`;

const MainCarouselSection = styled.div`
  color: #333;
  height: 100%;
  max-height: calc(100% - 6.7rem);
`;
const MainQuestionSection = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 5%;
  max-height: 2rem;
  padding: 0 0.7rem;
`;

const CabinetTemplate = (): JSX.Element => {
  // v3 API
  const [currentLocation, setCurrentLocation] = useState<string>("새롬관");
  const [currentFloor, setCurrentFloor] = useState<number>(2);
  const [locationFloor, setLocationFloor] =
    useState<CabinetLocationFloorDto[]>();
  const [sectionNames, setSectionNaems] = useState<string[]>([]);
  const [infoByLocationFloor, setInfoByLocationFloor] =
    useState<CabinetInfoByLocationFloorDto[]>();
  const [, , removeCookie] = useCookies(["access_token"]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosCabinetByLocationFloor(currentLocation, currentFloor)
      .then((response) => {
        setInfoByLocationFloor(response.data);
        setSectionNaems(
          response.data.map(
            (item: CabinetInfoByLocationFloorDto) => item.section
          )
        );
      })
      .then(() => {
        if (!locationFloor) {
          axiosLocationFloor()
            .then((response) => {
              setLocationFloor(response.data.space_data);
            })
            .catch((error) => {
              console.error(error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentLocation, currentFloor]);

  return (
    <MainSection>
      <MainNavSection className="MainNavSection">
        <HomeButton />
        <LocationButton
          locations={
            locationFloor
              ? locationFloor.map((e: CabinetLocationFloorDto) => e.location)
              : undefined
          }
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
        />
        <MenuButton />
      </MainNavSection>
      <MainFloorSection>
        <FloorButton
          currentFloor={currentFloor}
          setFloor={setCurrentFloor}
          floorsByLocation={
            locationFloor?.filter((e) => e.location === currentLocation)[0]
          }
        />
      </MainFloorSection>
      <MainCarouselSection>
        <Carousel
          slideCount={infoByLocationFloor?.length}
          cabinets={infoByLocationFloor}
          sections={sectionNames}
        />
      </MainCarouselSection>
      <MainQuestionSection>
        <GuideModal box={<GuideBox />} button={<QuestionButton />} />
      </MainQuestionSection>
    </MainSection>
  );
};

export default CabinetTemplate;
