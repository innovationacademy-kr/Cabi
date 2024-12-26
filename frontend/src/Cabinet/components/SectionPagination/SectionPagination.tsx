import styled from "styled-components";
import LeftSectionButton from "@/Cabinet/assets/images/LeftSectionButton.svg";
import { ICurrentSectionInfo } from "@/Cabinet/types/dto/cabinet.dto";

const SectionPagination: React.FC<{
  currentSectionName: string;
  currentPositionName: string;
  sectionList: Array<ICurrentSectionInfo>;
  changeSectionOnClickIndexButton: (index: number) => void;
  moveToLeftSection: React.MouseEventHandler;
  moveToRightSection: React.MouseEventHandler;
}> = (props) => {
  const {
    currentSectionName,
    currentPositionName,
    sectionList,
    changeSectionOnClickIndexButton,
    moveToLeftSection,
    moveToRightSection,
  } = props;

  const paginationIndexBar = sectionList.map((section, index) => (
    <IndexRectangleStyled
      key={section.sectionName}
      filledColor={
        section.sectionName === currentSectionName
          ? "var(--sys-main-color)"
          : "var(--service-man-title-border-btm-color)"
      }
      onClick={() => changeSectionOnClickIndexButton(index)}
      className="cabiButton"
    />
  ));

  return (
    <SectionPaginationStyled>
      <SectionBarStyled>
        <MoveSectionButtonStyled
          src={LeftSectionButton}
          onClick={moveToLeftSection}
          className="cabiButton"
        />
        <SectionNameTextStyled>{currentPositionName}</SectionNameTextStyled>
        <MoveSectionButtonStyled
          src={LeftSectionButton}
          arrowReversed={true}
          onClick={moveToRightSection}
          className="cabiButton"
        />
      </SectionBarStyled>
      <SectionIndexStyled>{paginationIndexBar}</SectionIndexStyled>
    </SectionPaginationStyled>
  );
};

const SectionPaginationStyled = styled.div`
  min-width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  position: sticky;
  top: 0;
  background: var(--bg-color);
  z-index: 1;
`;

const SectionBarStyled = styled.div`
  margin: 10px 5%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const MoveSectionButtonStyled = styled.img<{ arrowReversed?: boolean }>`
  width: 24px;
  height: 24px;
  margin: 0px 15px;
  opacity: 70%;
  cursor: pointer;
  transform: rotate(${(props) => (props.arrowReversed ? "180deg" : "0")});
  transition: all 0.2s;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 100%;
      transform: rotate(${(props) => (props.arrowReversed ? "180deg" : "0")})
        scale(1.3);
    }
  }
`;

const SectionNameTextStyled = styled.div`
  min-width: 220px;
  font-size: 1rem;
  text-align: center;
  color: var(--gray-line-btn-color);
`;

const SectionIndexStyled = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const IndexRectangleStyled = styled.div<{ filledColor: string }>`
  width: 15px;
  height: 8px;
  border-radius: 2px;
  margin: 0px 3px;
  background: ${(props) => props.filledColor};
  cursor: pointer;
  transition: all 0.2s;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: scale(1.3);
      background-color: var(--sys-sub-color);
    }
  }
`;

export default SectionPagination;
