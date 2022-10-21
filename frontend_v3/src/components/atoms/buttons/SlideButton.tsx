import styled from "@emotion/styled";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Button = styled.button`
  width: 1.5rem;
  height: 3rem;
  padding: 0;
  margin: 0.5rem;
  background-color: transparent;
  color: #c0c0c0;
`;

interface SlideButtonProps {
  direction: string;
  lastSlide: number;
  currentSlide: number;
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>;
}

// TODO: hybae
// handler 내 로직 추가 필요
const SlideButton = (props: SlideButtonProps): JSX.Element => {
  const { direction, lastSlide, currentSlide, setCurrentSlide } = props;

  const clickHandler = (): void => {
    if (direction === "left") {
      if (currentSlide === 0) setCurrentSlide(lastSlide);
      else setCurrentSlide(currentSlide - 1);
    } else if (currentSlide === lastSlide) setCurrentSlide(0);
    else setCurrentSlide(currentSlide + 1);
  };

  return direction === "left" ? (
    <Button onClick={clickHandler}>
      <FontAwesomeIcon icon={faAngleLeft} />
    </Button>
  ) : (
    <Button onClick={clickHandler}>
      <FontAwesomeIcon icon={faAngleRight} />
    </Button>
  );
};

export default SlideButton;
