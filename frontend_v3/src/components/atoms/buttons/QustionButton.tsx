import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import styled from "@emotion/styled";
import TestModal from "./QuestionTestModal";

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  background-color: transparent;
  border: 0;
  outline: 0;
  &:focus,
  &:hover {
    border: 0;
    outline: 0;
  }
`;

// XXX: 모달과 버튼 분리 여부
// 본 버튼의 이름이 QuestionButton이긴 하지만 기능상 하나의 모달을 열어주는 버튼에 가까운 것 같습니다.
// 그래서 이 버튼 컴포넌트는 모달을 열어주는 버튼의 역할만 하고, 모달은 따로 관리하는 것이 좋을 것 같습니다.
// 그렇게 되면, 모달의 open 상태를 버튼과 모달 중 어느 컴포넌트에서 관리해야 할까요..? 우선은 버튼에 두었습니다.
// 의견을 부탁드립니다.. @->---
const QuestionButton = (): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (): void => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <Button onClick={handleClick}>
      <FontAwesomeIcon icon={faCircleQuestion} />
      {/* TODO: gyuwlee */}
      {/* TestModal 제거 */}
      {isModalOpen && (
        <TestModal open={isModalOpen} handleClick={handleClick} />
      )}
    </Button>
  );
};

export default QuestionButton;
