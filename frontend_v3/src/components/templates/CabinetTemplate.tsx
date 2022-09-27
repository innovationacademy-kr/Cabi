import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import HomeButton from "../atoms/buttons/HomeButton";
import LocationButton from "../atoms/buttons/LocationButton";
import MenuButton from "../atoms/buttons/MenuButton";
import FloorButton from "../atoms/buttons/FloorButton";
import QuestionButton from "../atoms/buttons/QustionButton";
import GuideModal from "../atoms/modals/GuideModal";
import GuideBox from "../atoms/modals/GuideBox";
import Carousel from "../organisms/Carousel";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { userAll } from "../../redux/slices/userSlice";
import {
  CabinetLocationFloorDto,
  CabinetInfoByLocationFloorDto,
} from "../../types/dto/cabinet.dto";
import {
  axiosLocationFloor,
  axiosCabinetByLocationFloor,
  axiosMyInfo,
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
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const [currentLocation, setCurrentLocation] = useState<string>("새롬관");
  const [currentFloor, setCurrentFloor] = useState<number>(2);
  const [locationFloor, setLocationFloor] =
    useState<CabinetLocationFloorDto[]>();
  const [infoByLocationFloor, setInfoByLocationFloor] =
    useState<CabinetInfoByLocationFloorDto[]>();
  useEffect(() => {
    if (user.user_id === 0) {
      axiosMyInfo()
        .then((response) => {
          dispatch(userAll(response.data));
        })
        .catch((error) => {
          console.error(error);
        });
    }
    axiosLocationFloor()
      .then((response) => {
        setLocationFloor(response.data.space_data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axiosCabinetByLocationFloor(currentLocation, currentFloor)
      .then((response) => {
        setInfoByLocationFloor(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentLocation, currentFloor]);

  return (
    <MainSection>
      <MainNavSection>
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
        />
      </MainCarouselSection>
      <MainQuestionSection>
        <GuideModal box={<GuideBox />} button={<QuestionButton />} />
      </MainQuestionSection>
    </MainSection>
  );
};

export default CabinetTemplate;
