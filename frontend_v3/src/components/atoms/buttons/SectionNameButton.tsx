import { faMapLocation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "@emotion/styled";

const Button = styled.button`
  background-color: transparent;
  padding: 0.3rem;
`;

interface SectionNameButtonProps {
  sections: string[];
  currentSlide: number;
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>;
}

const SectionNameButton = (props: SectionNameButtonProps): JSX.Element => {
  const { currentSlide, sections, setCurrentSlide } = props;
  const handleClick = (): void => {
    setCurrentSlide(0);
  };
  return (
    <>
      {currentSlide === 0 ? "Map" : sections[currentSlide - 1]}
      <Button onClick={handleClick}>
        <FontAwesomeIcon icon={faMapLocation} />
      </Button>
    </>
  );
};

export default SectionNameButton;
