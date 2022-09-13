import styled from "@emotion/styled";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Button = styled.button`
  width: 1.5rem;
  height: 3rem;
  padding: 0;
  background-color: transparent;
  color: #c0c0c0;
`;

interface SlideButtonProps {
  direction: string;
}

//TODO: hybae
//handler 내 로직 추가 필요
const SlideButton = (props: SlideButtonProps): JSX.Element => {
  const { direction } = props;

  const leftClickHandler = () => {
    console.log(`move to left`);
  };

  const rightClickHandler = () => {
    console.log(`move to right`);
  };

  return direction === "left" ? (
    <Button onClick={leftClickHandler}>
      <FontAwesomeIcon icon={faAngleLeft} />
    </Button>
  ) : (
    <Button onClick={rightClickHandler}>
      <FontAwesomeIcon icon={faAngleRight} />
    </Button>
  );
};

export default SlideButton;
