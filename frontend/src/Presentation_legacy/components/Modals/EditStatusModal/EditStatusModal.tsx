import {
  addDays,
  differenceInDays,
  endOfMonth,
  format,
  startOfMonth,
} from "date-fns";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import Button from "@/Cabinet/components/Common/Button";
import Dropdown, {
  IDropdownOptions,
  IDropdownProps,
} from "@/Cabinet/components/Common/Dropdown";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/Cabinet/components/Modals/ResponseModal/ResponseModal";
import {
  currentPresentationState,
  isCurrentModalState,
} from "@/Presentation_legacy/recoil/atoms";
import { IPresentationScheduleDetailInfo } from "@/Presentation_legacy/types/dto/presentation.dto";
import {
  PresentationLocation,
  PresentationStatusType,
} from "@/Presentation_legacy/types/enum/presentation.type.enum";
import {
  axiosGetInvalidDates,
  axiosUpdatePresentationStatus,
} from "@/Presentation_legacy/api/axios/axios.custom";
import { filterInvalidDates } from "@/Presentation_legacy/utils/dateUtils";

interface EditStatusModalProps {
  list: IPresentationScheduleDetailInfo[] | null;
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

const EditStatusModal = ({ list, closeModal }: EditStatusModalProps) => {
  const [currentPresentation, setCurrentPresentation] = useRecoilState(
    currentPresentationState
  );
  const setIsCurrentModalRender = useSetRecoilState(isCurrentModalState);
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
    PresentationLocation.BASEMENT
  );
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isDatesDropdownOpen, setIsDatesDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [invalidDates, setInvalidDates] = useState<string[]>([]);
  const [datesDropdownOptions, setDatesDropdownOptions] = useState<
    IDropdownOptions[]
  >([]);
  const statusDropdownProps = {
    options: statusOptions.map((option) => ({
      ...option,
      isDisabled: !currentPresentation?.userName ? true : false,
    })),
    defaultValue:
      statusOptions.find(
        (option) => option.value === currentPresentation?.presentationStatus
      )?.name ?? "발표 예정",
    defaultImageSrc: "",
    onChangeValue: (val: PresentationStatusType) => {
      setPresentationStatus(val);
    },
    isOpen: isStatusDropdownOpen,
    setIsOpen: setIsStatusDropdownOpen,
    closeOtherDropdown: () => {
      setIsDatesDropdownOpen(false);
      setIsLocationDropdownOpen(false);
    },
  };

  const datesDropdownProps = {
    options: datesDropdownOptions,
    defaultValue: currentPresentation?.dateTime
      ? format(currentPresentation?.dateTime, "M월 d일")
      : "",
    defaultImageSrc: "",
    onChangeValue: (val: string) => {
      setPresentationDate(val);
    },
    isOpen: isDatesDropdownOpen,
    setIsOpen: setIsDatesDropdownOpen,
    closeOtherDropdown: () => {
      setIsStatusDropdownOpen(false);
      setIsLocationDropdownOpen(false);
    },
  };

  const locationDropdownProps = {
    options: floorOptions,
    defaultValue:
      floorOptions.find(
        (option) => option.value === currentPresentation?.presentationLocation
      )?.name ?? "3층",
    defaultImageSrc: "",
    onChangeValue: (val: PresentationLocation) => {
      setLocation(val);
    },
    isOpen: isLocationDropdownOpen,
    setIsOpen: setIsLocationDropdownOpen,
    closeOtherDropdown: () => {
      setIsStatusDropdownOpen(false);
      setIsDatesDropdownOpen(false);
    },
  };

  const tryEditPresentationStatus = async (e: React.MouseEvent) => {
    if (!currentPresentation || !currentPresentation.id) return;
    const date = new Date(presentationDate);
    // NOTE: Date 객체의 시간은 UTC 기준이므로 한국 시간 (GMT + 9) 으로 변환, 이후 발표 시작 시간인 14시를 더해줌
    date.setHours(9 + 14);

    try {
      await axiosUpdatePresentationStatus(
        currentPresentation.id,
        date.toISOString(),
        presentationStatus,
        location
      );
      setModalTitle("수정이 완료되었습니다");
      setIsCurrentModalRender(true);
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
      // invalidDates: 현재 기준 이전 날짜들 및 발표 신청된 날짜들
      setInvalidDates(
        response.data.invalidDateList.filter(
          (date: string) => date !== currentPresentation?.dateTime
        )
      );
    } catch (error: any) {
      setModalTitle(error.response.data.message);
      setHasErrorOnResponse(true);
      setShowResponseModal(true);
    }
  };

  const getMonthlyDates = (): Date[] => {
    const result: Date[] = [];
    const now = new Date(list?.[0]?.dateTime || Date.now());
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    const numberOfDays = differenceInDays(end, start) + 1;
    for (let i = 0; i < numberOfDays; i++) {
      const currentDate = addDays(start, i);
      result.push(currentDate);
    }
    return result;
  };

  useEffect(() => {
    getInvalidDates();
    if (!currentPresentation?.userName) {
      setPresentationStatus(PresentationStatusType.EXPECTED);
    }
  }, []);

  useEffect(() => {
    if (!currentPresentation) return;
    // NOTE: 발표 가능한 날짜들을 계산
    const availableDates: Date[] = getMonthlyDates();
    // NOTE: 발표 가능한 날짜 중 유효하지 않은 날짜를 필터링
    const availableDatesFiltered: Date[] = filterInvalidDates(
      availableDates,
      invalidDates
    );
    // NOTE: 발표 가능 날짜들을 Dropdown options으로 변환
    setDatesDropdownOptions(
      availableDatesFiltered.map((date) => ({
        name: format(date, "M월 d일"),
        value: date,
      }))
    );
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
                    <ContentItemTitleWrapperStyled>
                      <ContentItemTitleStyled>발표 상태</ContentItemTitleStyled>
                      {presentationStatus === PresentationStatusType.CANCEL && (
                        <ContentItemCancleAlertStyled>
                          발표를 취소하면 되돌릴 수 없습니다
                        </ContentItemCancleAlertStyled>
                      )}
                    </ContentItemTitleWrapperStyled>
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
  background: var(--hover-box-shadow-color);
  z-index: 1000;
`;
const ModalContainerStyled = styled.div<{ type: string }>`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 360px;
  background: var(--bg-color);
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

const ContentItemTitleWrapperStyled = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ContentItemTitleStyled = styled.h3`
  display: inline;
  font-size: 1.125rem;
  margin-bottom: 8px;
`;

const ContentItemCancleAlertStyled = styled.span`
  font-size: 12px;
  color: var(--expired-color);
  padding-right: 10px;
`;

const ButtonWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default EditStatusModal;
