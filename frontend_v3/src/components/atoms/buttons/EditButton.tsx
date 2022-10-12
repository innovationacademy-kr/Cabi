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
  }
`;

interface EditButtonProps {
  contentType: "title" | "memo";
  isToggle: boolean;
  setIsToggle: Dispatch<SetStateAction<boolean>>;
  inputValue: string;
  textValue: string;
  setTextValue: Dispatch<SetStateAction<string>>;
  setInputValue: Dispatch<SetStateAction<string>>;
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
  } = props;
  const handleEditButtonClick = (): void => {
    setIsToggle(true);
  };
  const handleSaveButtonClick = (): void => {
    setIsToggle(false);
    if (contentType === "title") {
      const cabinet_title = inputValue;
      axiosUpdateCabinetTitle({ cabinet_title })
        .then(() => {
          if (inputValue === "") setTextValue("방 제목을 입력해주세요");
          else setTextValue(inputValue);
        })
        .catch((error) => {
          console.error(error);
          alert("🚨 수정에 실패했습니다 🚨");
          setInputValue(textValue);
        });
    } else {
      const cabinet_memo = inputValue;
      axiosUpdateCabinetMemo({ cabinet_memo })
        .then(() => {
          if (inputValue === "") setTextValue("필요한 내용을 메모해주세요");
          else setTextValue(inputValue);
        })
        .catch((error) => {
          console.error(error);
          alert("🚨 수정에 실패했습니다 🚨");
          setInputValue(textValue);
        });
    }
  };
  const handleCancelButtonClick = (): void => {
    setIsToggle(false);
    if (textValue === "필요한 내용을 메모해주세요") setInputValue("");
    else setInputValue(textValue);
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
