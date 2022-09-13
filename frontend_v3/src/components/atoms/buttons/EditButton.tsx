import { SetStateAction, Dispatch } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faCircleCheck,
} from "@fortawesome/free-regular-svg-icons";
import styled from "@emotion/styled";

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
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
  isToggle: boolean;
  setIsToggle: Dispatch<SetStateAction<boolean>>;
  value: string;
}

const EditButton = (props: EditButtonProps): JSX.Element => {
  const { isToggle, setIsToggle, value } = props;
  const handleEditButtonClick = (): void => {
    setIsToggle(true);
  };
  const handleSaveButtonClick = (): void => {
    setIsToggle(false);
    // TODO: gyuwlee
    // value를 이용해 서버에 저장하는 로직 추가
    // 버튼을 눌렀을 때 서버에 저장하는 로직이 실행되고 나서, value를 새로 저장된 값으로 업데이트하도록 다시 API를 호출해야 할 것 같습니다.
  };

  return isToggle === false ? (
    <Button onClick={handleEditButtonClick}>
      <FontAwesomeIcon icon={faPenToSquare} />
    </Button>
  ) : (
    <Button onClick={handleSaveButtonClick}>
      <FontAwesomeIcon icon={faCircleCheck} />
    </Button>
  );
};

export default EditButton;
