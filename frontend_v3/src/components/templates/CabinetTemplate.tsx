import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import HomeButton from "../atoms/buttons/HomeButton";
import LocationButton from "../atoms/buttons/LocationButton";
import MenuButton from "../atoms/buttons/MenuButton";
import FloorButton from "../atoms/buttons/FloorButton";
import QuestionButton from "../atoms/buttons/QustionButton";
import GuideModal from "../atoms/modals/GuideModal";
import GuideBox from "../atoms/modals/GuideBox";
import Carousel from "../organisms/Carousel";
import {
  axiosCabinetInfo,
  axiosMyInfo,
} from "../../network/axios/axios.custom";
import { cabinetAll } from "../../redux/slices/cabinetSlice";
import { userAll } from "../../redux/slices/userSlice";

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
  padding: 0.5rem 0.7rem 0 0.7rem;
`;

const MainFloorSection = styled.div``;

const MainCarouselSection = styled.div`
  color: #333;
  height: 90%;
`;
const MainQuestionSection = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 5%;
  padding: 0 0.7rem;
`;

// TODO: hybae
// slide 개수를 건물, 층에 따라 계산하여 Carousel의 인자로 넘겨줘야 함.

const CabinetTemplate = (): JSX.Element => {
  // 기존 API
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const [currentLocation, setCurrentLocation] = useState<string>("새롬관");
  const [currentFloor, setCurrentFloor] = useState<number>(2);
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
    axiosCabinetInfo()
      .then((response) => {
        dispatch(cabinetAll(response.data));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  interface cabinetInfo {
    cabinet_id: number;
    cabinet_num: number;
    location: string;
    floor: number;
    section: string;
    activation: boolean;
  }

  const cabinets = useAppSelector((state) => state.cabinet.cabinet);
  const target: Array<cabinetInfo> = [];
  cabinets?.[0].forEach((e) => {
    e.forEach((e) => {
      e.forEach((cabinetInfo: cabinetInfo) => {
        if (
          cabinetInfo.location === currentLocation &&
          cabinetInfo.floor === currentFloor
        )
          target.push(cabinetInfo);
      });
    });
  });
  console.log(`Current location: ${currentLocation} floor: ${currentFloor}`);
  console.log(target);

  return (
    <MainSection>
      <MainNavSection>
        <HomeButton />
        <LocationButton
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
        />
        <MenuButton />
      </MainNavSection>
      <MainFloorSection>
        <FloorButton setFloor={setCurrentFloor} />
      </MainFloorSection>
      <MainCarouselSection>
        <Carousel slideCount={3} />
      </MainCarouselSection>
      <MainQuestionSection>
        <GuideModal box={<GuideBox />} button={<QuestionButton />} />
      </MainQuestionSection>
    </MainSection>
  );
};

export default CabinetTemplate;
