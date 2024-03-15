import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import LoadingAnimation from "@/components/Common/LoadingAnimation";
import { toggleItem } from "@/components/Common/MultiToggleSwitch";
import MultiToggleSwitchSeparated from "@/components/Common/MultiToggleSwitchSeparated";
import { RegisterErrorModal } from "@/components/Modals/Presentation/RegisterErrorModal";
import RegisterModal from "@/components/Modals/Presentation/RegisterModal";
import DropdownDateMenu from "@/components/Presentation/Register/DropdownDateMenu";
import DropdownTimeMenu from "@/components/Presentation/Register/DropdownTimeMenu";
import InputField from "@/components/Presentation/Register/InputField";
import {
  PresentationCategoryTypeLabelMap,
  PresentationTimeMap,
} from "@/assets/data/Presentation/maps";
import CautionIcon from "@/assets/images/cautionSign.svg";
import { PresentationCategoryType } from "@/types/enum/Presentation/presentation.type.enum";
import useInvalidDates from "@/hooks/Presentation/useInvalidDates";
import { calculateAvailableDaysExceptPastDays } from "@/utils/Presentation/dateUtils";
import { WEDNESDAY } from "@/constants/Presentation/dayOfTheWeek";
import {
  AVAILABLE_WEEKS,
  FUTURE_MONTHS_TO_DISPLAY,
  MAX_CONTENT_LENGTH,
  MAX_SUMMARY_LENGTH,
  MAX_TITLE_LENGTH,
} from "@/constants/Presentation/policy";

interface IInputData {
  value: string;
  length: number;
}

const defaultInputData: IInputData = { value: "", length: 0 };

export type PresentationTimeKey =
  | ""
  | "30분"
  | "1시간"
  | "1시간 30분"
  | "2시간";

const toggleList: toggleItem[] = Object.entries(
  PresentationCategoryTypeLabelMap
).map(([key, name]) => ({ name, key }));

const NotificationTimeDetail = `발표 시작 시간은 수요일 오후 2시이며
추후에 변경될 수 있습니다.
`;
const NotificationDateDetail = `현재 달부터 두 달 후까지의 날짜 중에서
선택이 가능합니다. 각 월별로 신청 가능한
일정이 업데이트됩니다.
`;

const RegisterPage = () => {
  const [toggleType, setToggleType] = useState<PresentationCategoryType>(
    PresentationCategoryType.DEVELOP
  );
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<PresentationTimeKey>("");
  const [title, setTitle] = useState<IInputData>(defaultInputData);
  const [summary, setSummary] = useState<IInputData>(defaultInputData);
  const [content, setContent] = useState<IInputData>(defaultInputData);
  const [focusedSection, setFocusedSection] = useState<string | null>(null);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [showNotificationBox, setShowNotificationBox] = useState<boolean>(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [errorDetails, setErrorDetails] = useState("");

  const invalidDates: string[] = useInvalidDates().map((date) =>
    format(date, "M/d")
  );

  const handleInputChange = useCallback(
    (
        setInput: React.Dispatch<React.SetStateAction<IInputData>>,
        maxLength: number
      ) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const data = e.target.value.slice(0, maxLength);
        setInput({ value: data, length: data.length });
      },
    []
  );

  const handleFocus = (sectionName: string) => {
    setFocusedSection(sectionName);
  };

  const handleBlur = () => {
    setFocusedSection(null);
  };

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const tryRegister = () => {
    let missingFields = [];
    if (date === "") {
      missingFields.push("날짜");
    }
    if (time === "") {
      missingFields.push("시간");
    }
    if (title.value === "") {
      missingFields.push("제목");
    }
    if (summary.value === "") {
      missingFields.push("한 줄 요약");
    }
    if (content.value === "") {
      missingFields.push("내용");
    }

    if (missingFields.length > 0) {
      const errorMessage = `${missingFields.join(
        ", "
      )}을(를) 입력해주세요.`;
      setErrorDetails(errorMessage);
      setShowErrorModal(true);
      return;
    }

    setIsClicked(true);
    setShowResponseModal(true);
  };

  useEffect(() => {
    const availableDates: Date[] = calculateAvailableDaysExceptPastDays(
      new Date(),
      AVAILABLE_WEEKS,
      WEDNESDAY,
      FUTURE_MONTHS_TO_DISPLAY
    );
    const formattedAvailableDates = availableDates.map((date) =>
      format(date, "M/d")
    );
    setAvailableDates(formattedAvailableDates);
  }, []);

  return (
    <>
      <RegisterPageStyled>
        <MainTitleStyled>수요지식회 신청</MainTitleStyled>
        <BackgroundStyled>
          <SubSectionStyled>
            <SubNameFirstStyled>카테고리</SubNameFirstStyled>
            <MultiToggleSwitchSeparated
              initialState={toggleType}
              setState={setToggleType}
              toggleList={toggleList}
              fontSize={"1rem"}
            />
          </SubSectionStyled>
          <DateTimeContainer>
            <SubSectionStyled>
              <SubNameStyled>
                날짜
                <CautionIconStyled
                  src={CautionIcon}
                  alt="Notification Icon"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
                {showTooltip && (
                  <TooltipBoxDateStyled
                    onMouseEnter={() => handleMouseEnter()}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    {NotificationDateDetail}
                  </TooltipBoxDateStyled>
                )}
              </SubNameStyled>
              <DropdownStyled>
                <DropdownDateMenu
                  onClick={setDate}
                  data={availableDates}
                  invalidDates={invalidDates}
                />
              </DropdownStyled>
            </SubSectionStyled>
            <SubSectionStyled>
              <SubNameStyled>
                시간
                <CautionIconStyled
                  src={CautionIcon}
                  alt="Notification Icon"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
                {showTooltip && (
                  <TooltipBoxTimeStyled
                    onMouseEnter={() => handleMouseEnter()}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    {NotificationTimeDetail}
                  </TooltipBoxTimeStyled>
                )}
              </SubNameStyled>
              <DropdownStyled>
                <DropdownTimeMenu onClick={setTime} />
              </DropdownStyled>
            </SubSectionStyled>
          </DateTimeContainer>
          <SubSectionStyled>
            <InputField
              title="제목"
              value={title.value}
              onChange={handleInputChange(setTitle, MAX_TITLE_LENGTH)}
              onFocus={() => handleFocus("title")}
              onBlur={handleBlur}
              maxLength={MAX_TITLE_LENGTH}
              placeholder="제목을 입력해주세요"
              isFocused={focusedSection === "title"}
              isInputArea={true}
            />
          </SubSectionStyled>
          <SubSectionStyled>
            <InputField
              title="한 줄 요약"
              value={summary.value}
              onChange={handleInputChange(setSummary, MAX_SUMMARY_LENGTH)}
              onFocus={() => handleFocus("summary")}
              onBlur={handleBlur}
              maxLength={MAX_SUMMARY_LENGTH}
              placeholder="한 줄 요약을 입력해주세요"
              isFocused={focusedSection === "summary"}
              isInputArea={true}
            />
          </SubSectionStyled>
          <SubSectionStyled>
            <InputField
              title="내용"
              value={content.value}
              onChange={handleInputChange(setContent, MAX_CONTENT_LENGTH)}
              onFocus={() => handleFocus("content")}
              onBlur={handleBlur}
              maxLength={MAX_CONTENT_LENGTH}
              placeholder="내용을 입력해주세요"
              isFocused={focusedSection === "content"}
              isInputArea={false}
            />
          </SubSectionStyled>
          <RegisterButtonStyled onClick={tryRegister} disabled={isClicked}>
            {isClicked ? <LoadingAnimation /> : "신청하기"}
          </RegisterButtonStyled>
        </BackgroundStyled>
      </RegisterPageStyled>
      {showResponseModal && (
        <RegisterModal
          title={title.value}
          summary={summary.value}
          content={content.value}
          date={date}
          time={PresentationTimeMap[time]}
          toggleType={toggleType}
          closeModal={() => {
            setShowResponseModal(false);
            setIsClicked(false);
          }}
          setIsClicked={setIsClicked}
        />
      )}
      {showErrorModal && (
        <RegisterErrorModal
          title="입력 오류"
          detail={errorDetails}
          closeModal={() => setShowErrorModal(false)}
        />
      )}
    </>
  );
};

const RegisterPageStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  min-height: 100%;
  overflow-y: auto;
  @media (max-width: 700px) {
    background-color: var(--lightgray-color);
  }
`;

const MainTitleStyled = styled.h1`
  margin-top: 40px;
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 3rem;
  @media (max-width: 700px) {
    display: none;
  }
`;

const BackgroundStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 700px;
  border-radius: 10px;
  background-color: var(--lightgray-color);
  margin-top: 20px;
  padding: 20px;
  margin-bottom: 20px;
  @media (max-width: 700px) {
    margin-top: 0;
  }
`;

const SubNameFirstStyled = styled.div`
  margin-left: 5px;
  margin-bottom: 2px;
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 2.25rem;
  width: fit-content;
  @media (max-width: 700px) {
    width: 100%;
  }
`;

export const SubNameStyled = styled.div`
  margin-left: 5px;
  margin-bottom: 2px;
  margin-top: 24px;
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 2.25rem;
  width: fit-content;
  display: flex;
  align-items: center;
  position: relative;
  @media (max-width: 700px) {
    display: flex;
    flex-wrap: wrap;
  }
`;

const SubSectionStyled = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

const DropdownStyled = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background-color: var(--white);
  border: none;
  resize: none;
  outline: none;
  /* cursor: pointer; */
`;

const RegisterButtonStyled = styled.button`
  width: 180px;
  height: 48px;
  font-size: 1rem;
  font-weight: 480;
  margin-top: 30px;
  background-color: #3f69fd;
  @media (max-width: 700px) {
    width: 100%;
  }
`;

const DateTimeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  @media (max-width: 700px) {
    flex-direction: column;
    align-items: center;
    gap: 0;
  }
`;

const CautionIconStyled = styled.img`
  margin-top: 2px;
  margin-left: 5px;
  width: 16px;
  height: 16px;
  opacity: 0.6;
  :hover {
    cursor: pointer;
    opacity: 1;
  }
`;

const TooltipBoxDateStyled = styled.div`
  position: absolute;
  top: -50px;
  left: 340%;
  transform: translateX(-50%);
  font-weight: 400;
  color: white;
  background-color: rgba(0, 0, 0, 0.8);
  width: 240px;
  padding: 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  text-align: center;
  line-height: 1.25rem;
  letter-spacing: -0.02rem;
  white-space: pre-line;
  z-index: 100;
  opacity: 0;
  transition: opacity 0.5s ease;

  &::after {
    content: "";
    position: absolute;
    top: 82%;
    right: 100%;
    margin-top: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent rgba(0, 0, 0, 0.8) transparent transparent;
  }

  ${SubNameStyled}:hover & {
    opacity: 1;
  }
`;

const TooltipBoxTimeStyled = styled.div`
  position: absolute;
  top: -32px;
  left: 320%;
  transform: translateX(-50%);
  font-weight: 400;
  color: white;
  background-color: rgba(0, 0, 0, 0.8);
  width: 220px;
  padding: 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  text-align: center;
  line-height: 1.25rem;
  letter-spacing: -0.02rem;
  white-space: pre-line;
  z-index: 100;
  opacity: 0;
  transition: opacity 0.5s ease;

  &::after {
    content: "";
    position: absolute;
    top: 82%;
    right: 100%;
    margin-top: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent rgba(0, 0, 0, 0.8) transparent transparent;
  }

  ${SubNameStyled}:hover & {
    opacity: 1;
  }
`;

export default RegisterPage;
