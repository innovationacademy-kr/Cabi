import styled, { css } from "styled-components";
import ClubLogTable from "@/components/Club/ClubLogTable";
import LeftSectionButton from "@/assets/images/LeftSectionButton.svg";
import { IClubLog } from "@/types/dto/lent.dto";

const AdminClubLog = ({
  logs,
  page,
  totalPage,
  onClickPrev,
  onClickNext,
  changePageOnClickIndexButton,
}: IClubLog) => {
  const paginationIndexBar = (
    currentPage: number,
    totalPages: number
  ): JSX.Element[] => {
    const indexButtons: JSX.Element[] = [];
    for (let i = 0; i < totalPages; i++) {
      indexButtons.push(
        <IndexRectangleStyled
          key={i}
          filledColor={currentPage === i ? "#9747FF" : "#D9D9D9"}
          onClick={() => changePageOnClickIndexButton(i)}
          className="cabiButton"
        />
      );
    }
    return indexButtons;
  };

  return (
    <>
      <SectionPaginationStyled>
        <SectionBarStyled>
          <MoveSectionButtonStyled
            src={LeftSectionButton}
            onClick={onClickPrev}
            className="cabiButton"
          />
          <SectionIndexStyled>
            {paginationIndexBar(page, totalPage)}
          </SectionIndexStyled>
          <MoveSectionButtonStyled
            src={LeftSectionButton}
            arrowReversed={true}
            onClick={onClickNext}
            className="cabiButton"
          />
        </SectionBarStyled>
      </SectionPaginationStyled>
      <AdminClubLogStyled>
        <ClubLogTable ClubList={logs} />
      </AdminClubLogStyled>
    </>
  );
};

const AdminClubLogStyled = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  border-radius: 10px;
  overflow: hidden;
  margin: 0 auto;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
`;

const SectionPaginationStyled = styled.div`
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

const MoveSectionButtonStyled = styled.img<{ arrowReversed?: boolean }>`
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
      background-color: var(--lightpurple-color);
    }
  }
`;

export default AdminClubLog;
