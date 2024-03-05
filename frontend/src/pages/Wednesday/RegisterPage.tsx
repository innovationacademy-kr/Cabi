import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { toggleItem } from "@/components/Common/MultiToggleSwitch";
import MultiToggleSwitchSeparated from "@/components/Common/MultiToggleSwitchSeparated";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/components/Modals/ResponseModal/ResponseModal";
import DropdownDateMenu from "@/components/Wednesday/Registers/DropdownDateMenu";
import DropdownTimeMenu from "@/components/Wednesday/Registers/DropdownTimeMenu";
import NotificationIcon from "@/assets/images/notificationSign_grey.svg";
import {
  PresentationCategoryType,
  PresentationPeriodType,
} from "@/types/enum/Presentation/presentation.type.enum";
import {
  axiosGetInvalidDates,
  axiosPostPresentationForm,
} from "@/api/axios/axios.custom";
import {
  calculateAvailableDaysInWeeks,
  filterInvalidDates,
} from "@/utils/Presentation/dateUtils";
import { WEDNESDAY } from "@/constants/Presentation/dayOfTheWeek";
import {
  AVAILABLE_WEEKS,
  FUTURE_MONTHS_TO_DISPLAY,
} from "@/constants/Presentation/policy";

const toggleList: toggleItem[] = [
  { name: "42", key: PresentationCategoryType.TASK },
  { name: "개발", key: PresentationCategoryType.DEVELOP },
  { name: "학술", key: PresentationCategoryType.STUDY },
  { name: "취미", key: PresentationCategoryType.HOBBY },
  { name: "취업", key: PresentationCategoryType.JOB },
  { name: "기타", key: PresentationCategoryType.ETC },
];

const NotificationDetail = `시작 시간은 수요일 오후 2시로 고정되며</br>시간은 각각 30분, 1시간, 1시간 30분,</br>2시간 중에서 선택하실 수 있습니다.
`;

interface IInputData {
  value: string;
  length: number;
}

const RegisterPage = () => {
  const [toggleType, setToggleType] = useState<PresentationCategoryType>(
    PresentationCategoryType.TASK
  );
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [showNotificationModal, setShowNotificationModal] =
    useState<boolean>(false);

  const [title, setTitle] = useState<string>("");

  const [summary, setSummary] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [focusedSection, setFocusedSection] = useState<string | null>(null);
  const [titleLength, setTitleLength] = useState<number>(0);
  const [summaryLength, setSummaryLength] = useState<number>(0);
  const [contentLength, setContentLength] = useState<number>(0);

  const [invalidDates, setInvalidDates] = useState<string[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [showNotificationBox, setShowNotificationBox] = useState<boolean>(true);

  const navigate = useNavigate();

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

  const [showTooltip, setShowTooltip] = useState(false);

  const handleDateChange = (selectedDate: string) => {
    setDate(selectedDate);
  };

  const handleTimeChange = (selectedTime: string) => {
    let convertedTime: string;
    switch (selectedTime) {
      case "30분":
        convertedTime = PresentationPeriodType.HALF;
        break;
      case "1시간":
        convertedTime = PresentationPeriodType.HOUR;
        break;
      case "1시간 30분":
        convertedTime = PresentationPeriodType.HOUR_HALF;
        break;
      case "2시간":
        convertedTime = PresentationPeriodType.TWO_HOUR;
        break;
      default:
        convertedTime = selectedTime;
    }
    setTime(convertedTime);
  };

  const handleFocus = (sectionName: string) => {
    setFocusedSection(sectionName);
  };

  const handleBlur = () => {
    setFocusedSection(null);
  };

  const handleNotificationIconClick = () => {
    setShowNotificationModal(true);
  };

  const removeNotificationIcon = () => {
    setShowNotificationBox(false);
  };

  const NotificationModalDetail = `시작 시간은 수요일 오후 2시로 고정되며 시간은 각각 30분, 1시간, 1시간 30분, 2시간 중에서 선택하실 수 있습니다.
  `;

  const handleTooltipToggle = (show: boolean) => {
    setShowTooltip(show);
  };

  const handleMouseEnter = () => {
    handleTooltipToggle(true);
  };

  const handleMouseLeave = () => {
    handleTooltipToggle(false);
  };

  const tryRegister = async () => {
    // 항목을 전부 입력하지 않았을 경우 toast message 띄워주도록 예외처리?
    if (
      date === "" ||
      time === "" ||
      title === "" ||
      summary === "" ||
      content === ""
    ) {
      alert("모든 항목을 입력해주세요");
      return;
    }
    try {
      const [month, day] = date.split("/");
      const data = new Date(
        Number(new Date().getFullYear()),
        Number(month) - 1,
        Number(day)
      );
      // NOTE: Date 객체의 시간은 UTC 기준이므로 한국 시간 (GMT + 9) 으로 변환, 이후 발표 시작 시간인 14시를 더해줌
      data.setHours(9 + 14);
      await axiosPostPresentationForm(
        title,
        summary,
        content,
        data,
        toggleType,
        `${time}`
      );

      setModalTitle("신청이 완료되었습니다");
      setTimeout(() => {
        navigate("/wed/home");
      }, 1500);
    } catch (error: any) {
      setModalTitle(error.response.data.message);
      setHasErrorOnResponse(true);
    } finally {
      setShowResponseModal(true);
    }
  };

  useEffect(() => {
    getInvalidDates();
  }, []);

  useEffect(() => {
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
    // NOTE: 발표 가능 날짜들을 string 배열로 변환
    setAvailableDates(
      availableDatesFiltered.map((date) => format(date, "M/d"))
    );
  }, [invalidDates]);

  return (
    <>
      <RegisterPageStyled>
        <MainTitleStyled>수요지식회 신청</MainTitleStyled>
        <BackgroundStyled>
          <SubSection>
            <SubNameFirstStyled>카테고리</SubNameFirstStyled>
            <MultiToggleSwitchSeparated
              initialState={toggleType}
              setState={setToggleType}
              toggleList={toggleList}
              fontSize={"0.94rem"}
            />
          </SubSection>
          <DateTimeContainer>
            <SubSection>
              <SubNameStyled>날짜</SubNameStyled>
              <DropdownStyled>
                <DropdownDateMenu
                  onClick={handleDateChange}
                  data={availableDates}
                />
              </DropdownStyled>
            </SubSection>
            <SubSection>
              <SubNameStyled>
                시간{" "}
                <NotificationIconStyled
                  src={NotificationIcon}
                  alt="Notification Icon"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
                {showTooltip && (
                  <TooltipBoxStyled
                    onMouseEnter={() => handleMouseEnter()}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    {NotificationModalDetail}
                  </TooltipBoxStyled>
                )}
              </SubNameStyled>
              <DropdownStyled>
                <DropdownTimeMenu onClick={handleTimeChange} />
              </DropdownStyled>
            </SubSection>
          </DateTimeContainer>
          <SubSection>
            <SubNameStyled>제목</SubNameStyled>
            <SummaryTextareaStyled
              placeholder="제목을 입력해주세요"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleLength(e.target.value.length);
              }}
              onFocus={() => handleFocus("title")}
              onBlur={handleBlur}
              isFocused={focusedSection === "title"}
              spellCheck={false}
              maxLength={25}
            />
            <CharacterCount>{titleLength} / 25</CharacterCount>
          </SubSection>
          <SubSection>
            <SubNameStyled>한 줄 요약</SubNameStyled>
            <SummaryTextareaStyled
              placeholder="한 줄 요약을 입력해주세요"
              onFocus={() => handleFocus("summary")}
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
                setSummaryLength(e.target.value.length);
              }}
              onBlur={handleBlur}
              isFocused={focusedSection === "summary"}
              spellCheck={false}
              maxLength={40}
            />
            <CharacterCount>{summaryLength} / 40</CharacterCount>
          </SubSection>
          <SubSection>
            <SubNameStyled>내용</SubNameStyled>
            <DetailTextareaStyled
              onFocus={() => handleFocus("content")}
              onBlur={handleBlur}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setContentLength(e.target.value.length);
              }}
              isFocused={focusedSection === "content"}
              placeholder="내용을 입력해주세요"
              spellCheck={false}
              maxLength={500}
            />
            <CharacterCount>{contentLength} / 500</CharacterCount>
          </SubSection>
          <RegisterButtonStyled onClick={tryRegister}>
            신청하기
          </RegisterButtonStyled>
        </BackgroundStyled>
      </RegisterPageStyled>
      {showNotificationBox && (
        <TooltipBoxStyled>{NotificationDetail}</TooltipBoxStyled>
      )}
      {showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal
            modalTitle={modalTitle}
            closeModal={() => {
              setShowResponseModal(false);
            }}
          />
        ) : (
          <SuccessResponseModal
            modalTitle={modalTitle}
            closeModal={() => {
              setShowResponseModal(false);
            }}
          />
        ))}
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

const SubNameStyled = styled.div`
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

const SummaryTextareaStyled = styled.input<{ isFocused: boolean }>`
  width: 100%;
  height: 100%;
  text-align: left;
  padding: 12px 12px 12px 12px;
  border-radius: 10px;
  border: none;
  resize: none;
  box-sizing: border-box;
  font-size: 0.875rem;
  background-color: var(--white);
  font-family: "Noto Sans KR", sans-serif;
  outline: none;
  border: 2px solid
    ${(props) => (props.isFocused ? "#91B5FA" : "var(--lightgray-color)")};
`;

const DetailTextareaStyled = styled.textarea<{ isFocused: boolean }>`
  width: 100%;
  height: 180px;
  padding: 12px 12px 12px 12px;
  border-radius: 10px;
  border: none;
  resize: none;
  box-sizing: border-box;
  font-size: 0.875rem;
  background-color: var(--white);
  font-family: "Noto Sans KR", sans-serif;
  outline: none;
  border: 2px solid
    ${(props) => (props.isFocused ? "#91B5FA" : "var(--lightgray-color)")};
`;

const SubSection = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

const DropdownStyled = styled.div`
  width: 100%;
  height: 46px;
  border-radius: 10px;
  background-color: var(--white);
  border: none;
  resize: none;
  outline: none;
  cursor: pointer;
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
  @media (max-width: 580px) {
    flex-direction: column;
    align-items: center;
    gap: 0;
  }
`;

const NotificationIconStyled = styled.img`
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

const CharacterCount = styled.div`
  margin-left: auto;
  margin-top: 5px;
  font-size: 0.75rem;
  color: #a9a9a9;
`;

const TooltipBoxStyled = styled.div`
  position: absolute;
  top: -80px;
  left: 84%;
  transform: translateX(-50%);
  font-weight: 400;
  color: white;
  background-color: rgba(0, 0, 0, 0.8);
  width: 270px;
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
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
  }

  ${SubNameStyled}:hover & {
    opacity: 1;
  }
`;

export default RegisterPage;
