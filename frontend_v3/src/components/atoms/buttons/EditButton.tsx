import { SetStateAction, Dispatch } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";
import styled from "@emotion/styled";
import {
  axiosUpdateCabinetMemo,
  axiosUpdateCabinetTitle,
} from "../../../network/axios/axios.custom";

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
  margin: 0.1rem;
  padding: 0;
  background-color: transparent;
  &,
  &:focus,
  &:hover {
    border: 0;
    outline: 0;
  },
`;

interface EditButtonProps {
  contentType: "title" | "memo";
  isToggle: boolean;
  setIsToggle: Dispatch<SetStateAction<boolean>>;
  inputValue: string;
  textValue: string;
  setTextValue: Dispatch<SetStateAction<string>>;
  setInputValue: React.Dispatch<React.SetStateAction<object>>;
  resetInputValue: () => void;
}

const EditButton = (props: EditButtonProps): JSX.Element => {
  const {
    isToggle,
    setIsToggle,
    inputValue,
    textValue,
    contentType,
    setTextValue,
    setInputValue,
    resetInputValue,
  } = props;

  const originalTextValue = textValue;

  const handleEditButtonClick = (): void => {
    setIsToggle(true);
  };

  const handleSaveButtonClick = (): void => {
    setIsToggle(false);
    if (inputValue === "") setTextValue("방 제목을 입력해주세요");
    else setTextValue(inputValue);
    if (contentType === "title") {
      const cabinet_title = inputValue;
      axiosUpdateCabinetTitle({ cabinet_title }).catch((error) => {
        console.error(error);
        alert("🚨 수정에 실패했습니다 🚨");
        setTextValue(originalTextValue);
      });
    } else {
      const cabinet_memo = inputValue;
      setTextValue(inputValue);
      axiosUpdateCabinetMemo({ cabinet_memo })
        .then(() => {
          if (inputValue === "") setTextValue("필요한 내용을 메모해주세요");
          else setTextValue(inputValue);
        })
        .catch((error) => {
          console.error(error);
          alert("🚨 수정에 실패했습니다 🚨");
          setTextValue(originalTextValue);
        });
    }
  };
  const handleCancelButtonClick = (): void => {
    setIsToggle(false);
    if (
      textValue === "필요한 내용을 메모해주세요" ||
      textValue === "방 제목을 입력해주세요"
    )
      resetInputValue();
    else setInputValue({ text: textValue });
  };

  return isToggle === false ? (
    <Button onClick={handleEditButtonClick}>
      <FontAwesomeIcon icon={faPenToSquare} />
    </Button>
  ) : (
    <>
      <Button onClick={handleCancelButtonClick}>
        <FontAwesomeIcon
          icon={faCircleXmark}
          style={{ height: "1.5rem", width: "1.5rem" }}
        />
      </Button>
      <Button onClick={handleSaveButtonClick}>
        <FontAwesomeIcon
          icon={faCircleCheck}
          style={{ height: "1.5rem", width: "1.5rem" }}
        />
      </Button>
    </>
  );
};

export default EditButton;
