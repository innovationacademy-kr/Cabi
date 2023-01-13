import styled from "styled-components";
import LeftSectionButton from "@/assets/images/LeftSectionButton.svg";

const SectionPagination: React.FC<{
  currentSectionName: string;
  currentPositionName: string;
  sectionList: Array<string>;
  changeSectionOnClickIdxButton: (idx: number) => void;
  moveToLeftSection: React.MouseEventHandler;
  moveToRightSection: React.MouseEventHandler;
}> = (props) => {
  const {
    currentSectionName,
    currentPositionName,
    sectionList,
    changeSectionOnClickIdxButton,
    moveToLeftSection,
    moveToRightSection,
  } = props;
  const paginationIdxBar = sectionList.map((sectionName, idx) => (
    <IndexRectangleStyled
      key={sectionName}
      bgColor={sectionName === currentSectionName ? "#9747FF" : "#D9D9D9"}
      onClick={() => changeSectionOnClickIdxButton(idx)}
    />
  ));

  return (
    <SectionPaginationStyled>
      <SectionBarStyled>
        <MoveSectionButtonStyled
          src={LeftSectionButton}
          onClick={moveToLeftSection}
        />
        <SectionNameTextStyled>{currentPositionName}</SectionNameTextStyled>
        <MoveSectionButtonStyled
          src={LeftSectionButton}
          needRotate
          onClick={moveToRightSection}
        />
      </SectionBarStyled>
      <SectionIndexStyled>{paginationIdxBar}</SectionIndexStyled>
    </SectionPaginationStyled>
  );
};

export default SectionPagination;

const SectionPaginationStyled = styled.div`
  min-width: 360px;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.95);
  z-index: 1;
`;

const SectionBarStyled = styled.div`
  margin: 10px 5%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const MoveSectionButtonStyled = styled.img<{ needRotate?: boolean }>`
  width: 24px;
  height: 24px;
  margin: 0px 15px;
  opacity: 70%;
  cursor: pointer;
  transform: rotate(${(props) => (props.needRotate ? "180deg" : "0")});
  transition: all 0.2s;
  &:hover {
    opacity: 100%;
    transform: rotate(${(props) => (props.needRotate ? "180deg" : "0")})
      scale(1.3);
  }
`;

const SectionNameTextStyled = styled.div`
  min-width: 220px;
  font-size: 1rem;
  text-align: center;
  color: var(--gray-color);
`;

const SectionIndexStyled = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const IndexRectangleStyled = styled.div<{ bgColor: string }>`
  width: 15px;
  height: 8px;
  border-radius: 2px;
  margin: 0px 3px;
  background: ${(props) => props.bgColor};
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    transform: scale(1.3);
    background-color: var(--lightpurple-color);
  }
`;
