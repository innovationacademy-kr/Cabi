import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import Button from "@/components/Common/Button";
import Dropdown, {
  IDropdown,
  IDropdownOptions,
} from "@/components/Common/Dropdown";
import ModalPortal from "@/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/components/Modals/ResponseModal/ResponseModal";
import { currentPresentationState } from "@/Presentation/recoil/atoms";
import {
  PresentationLocation,
  PresentationStatusType,
} from "@/Presentation/types/enum/presentation.type.enum";
import {
  axiosGetInvalidDates,
  axiosUpdatePresentationStatus,
} from "@/Presentation/api/axios/axios.custom";
import {
  calculateAvailableDaysInWeeks,
  filterInvalidDates,
} from "@/Presentation/utils/dateUtils";
import { WEDNESDAY } from "@/Presentation/constants/dayOfTheWeek";
import {
  AVAILABLE_WEEKS,
  FUTURE_MONTHS_TO_DISPLAY,
} from "@/Presentation/constants/policy";

interface EditStatusModalProps {
  closeModal: React.MouseEventHandler;
}

const statusOptions: IDropdownOptions[] = [
  { name: "발표 예정", value: PresentationStatusType.EXPECTED },
  { name: "발표 완료", value: PresentationStatusType.DONE },
  { name: "발표 취소", value: PresentationStatusType.CANCEL },
];

const floorOptions: IDropdownOptions[] = [
  { name: "지하 1층", value: PresentationLocation.BASEMENT },
  { name: "1층", value: PresentationLocation.FIRST },
  { name: "3층", value: PresentationLocation.THIRD },
];

const EditStatusModal = ({ closeModal }: EditStatusModalProps) => {
  const [currentPresentation, setCurrentPresentation] = useRecoilState(
    currentPresentationState
  );
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [presentationDate, setPresentationDate] = useState<string>(
    currentPresentation?.dateTime
      ? new Date(currentPresentation?.dateTime).toISOString()
      : ""
  );
  const [presentationStatus, setPresentationStatus] =
    useState<PresentationStatusType>(PresentationStatusType.EXPECTED);
  const [location, setLocation] = useState<PresentationLocation>(
    PresentationLocation.THIRD
  );
  const [invalidDates, setInvalidDates] = useState<string[]>([]);
  const [statusDropdownProps, setStatusDropdownProps] = useState<IDropdown>({
    options: statusOptions,
    defaultValue:
      statusOptions.find(
        (option) => option.value === currentPresentation?.presentationStatus
      )?.name ?? "발표 예정",
    defaultImageSrc: "",
    onChangeValue: (val: PresentationStatusType) => {
      setPresentationStatus(val);
    },
  });
  console.log("currentPresentation", currentPresentation);

  const [datesDropdownProps, setDatesDropdownProps] = useState<IDropdown>({
    options: [],
    defaultValue: currentPresentation?.dateTime
      ? format(currentPresentation?.dateTime.split("T")[0], "M월 d일")
      : "",
    defaultImageSrc: "",
    onChangeValue: (val: string) => {
      setPresentationDate(val);
    },
  });

  const [locationDropdownProps, setLocationDropdownProps] = useState<IDropdown>(
    {
      options: floorOptions,
      defaultValue:
        floorOptions.find(
          (option) => option.value === currentPresentation?.presentationLocation
        )?.name ?? "3층",
      defaultImageSrc: "",
      onChangeValue: (val: PresentationLocation) => {
        setLocation(val);
      },
    }
  );

  const tryEditPresentationStatus = async (e: React.MouseEvent) => {
    if (!currentPresentation || !currentPresentation.id) return;
    const data = new Date(presentationDate);
    // NOTE: Date 객체의 시간은 UTC 기준이므로 한국 시간 (GMT + 9) 으로 변환, 이후 발표 시작 시간인 14시를 더해줌
    data.setHours(9 + 14);

    try {
      await axiosUpdatePresentationStatus(
        currentPresentation.id,
        data.toISOString(),
        presentationStatus,
        location
      );

      setModalTitle("수정이 완료되었습니다");
    } catch (error: any) {
      setModalTitle(error.response.data.message);
      setHasErrorOnResponse(true);
    } finally {
      setShowResponseModal(true);
    }
  };

  const getInvalidDates = async () => {
    try {
      const response = await axiosGetInvalidDates();
      setInvalidDates(response.data.invalidDateList);
    } catch (error: any) {
      setModalTitle(error.response.data.message);
      setHasErrorOnResponse(true);
      setShowResponseModal(true);
    }
  };

  useEffect(() => {
    getInvalidDates();
  }, []);

  useEffect(() => {
    if (!currentPresentation) return;
    // NOTE: 발표 가능한 날짜들을 계산
    const availableDates: Date[] = calculateAvailableDaysInWeeks(
      new Date(),
      AVAILABLE_WEEKS,
      WEDNESDAY,
      FUTURE_MONTHS_TO_DISPLAY
    );
    // NOTE: 발표 가능한 날짜 중 유효하지 않은 날짜를 필터링
    const availableDatesFiltered: Date[] = filterInvalidDates(
      availableDates,
      invalidDates
    );
    // NOTE: 발표 가능 날짜들을 Dropdown options으로 변환
    const dropdownOptions: IDropdownOptions[] = availableDatesFiltered.map(
      (date) => ({
        name: format(date, "M월 d일"),
        value: date,
      })
    );
    setDatesDropdownProps({
      options: dropdownOptions,
      defaultValue: dropdownOptions[0].name,
      onChangeValue: (val: string) => {
        setPresentationDate(val);
      },
    });
  }, [invalidDates]);

  return (
    <>
      <ModalPortal>
        {!showResponseModal && (
          <>
            <BackgroundStyled onClick={closeModal} />
            <ModalContainerStyled type={"confirm"}>
              <H2Styled>일정 관리</H2Styled>
              <ContentSectionStyled>
                <ContentItemSectionStyled>
                  <ContentItemWrapperStyled isVisible={true}>
                    <ContentItemTitleStyled>발표 상태</ContentItemTitleStyled>
                    <Dropdown {...statusDropdownProps} />
                  </ContentItemWrapperStyled>
                  <ContentItemWrapperStyled isVisible={true}>
                    <ContentItemTitleStyled>날짜</ContentItemTitleStyled>
                    <Dropdown {...datesDropdownProps} />
                  </ContentItemWrapperStyled>
                  <ContentItemWrapperStyled isVisible={true}>
                    <ContentItemTitleStyled>장소</ContentItemTitleStyled>
                    <Dropdown {...locationDropdownProps} />
                  </ContentItemWrapperStyled>
                </ContentItemSectionStyled>
              </ContentSectionStyled>
              <ButtonWrapperStyled>
                <Button
                  onClick={tryEditPresentationStatus}
                  text="저장"
                  theme="fill"
                />
                <Button onClick={closeModal} text={"취소"} theme={"line"} />
              </ButtonWrapperStyled>
            </ModalContainerStyled>
          </>
        )}
      </ModalPortal>
      {showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal modalTitle={modalTitle} closeModal={closeModal} />
        ) : (
          <SuccessResponseModal
            modalTitle={modalTitle}
            closeModal={closeModal}
          />
        ))}
    </>
  );
};

const DropdownWrapperStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
`;

const BackgroundStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
`;
const ModalContainerStyled = styled.div<{ type: string }>`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 360px;
  background: white;
  z-index: 1000;
  border-radius: 10px;
  transform: translate(-50%, -50%);
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  padding: 40px;
`;

const H2Styled = styled.h2`
  font-weight: 600;
  font-size: 1.5rem;
  margin: 0 30px 25px 0px;
  white-space: break-spaces;
  text-align: start;
`;

const ContentSectionStyled = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const ContentItemSectionStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ContentItemWrapperStyled = styled.div<{
  isVisible: boolean;
}>`
  display: ${({ isVisible }) => (isVisible ? "flex" : "none")};
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 25px;
`;

const ContentItemTitleStyled = styled.h3`
  font-size: 1.125rem;
  margin-bottom: 8px;
`;

const ButtonWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default EditStatusModal;
