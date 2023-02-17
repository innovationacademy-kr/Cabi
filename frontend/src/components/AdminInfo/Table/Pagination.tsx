import styled, { css } from "styled-components";
import LeftSectionButton from "@/assets/images/LeftSectionButton.svg";

const Pagination = ({
  setCurPage,
  curPage,
  totalCount,
  rowCount,
}: {
  setCurPage: React.Dispatch<React.SetStateAction<number>>;
  curPage: number;
  totalCount: number;
  rowCount: number;
}) => {
  const onClickLeft = () => {
    if (curPage > 0) {
      setCurPage(curPage - 1);
    }
  };
  const onClickRight = () => {
    if (curPage + 1 < Math.ceil(totalCount / 5)) {
      setCurPage(curPage + 1);
    }
  };
  return (
    <PaginationStyled>
      <ButtonStyled
        dir="left"
        curPage={curPage}
        onClick={onClickLeft}
        rowCount={rowCount}
      >
        <ArrowStyled src={LeftSectionButton} />
      </ButtonStyled>
      <StatusStyled>
        <div>{`${totalCount > 0 ? curPage + 1 : 0} / ${Math.ceil(
          totalCount / 5
        )}`}</div>
        <div>{`총 ${totalCount}건`}</div>
      </StatusStyled>
      <ButtonStyled
        dir="right"
        curPage={curPage}
        totalCount={totalCount}
        onClick={onClickRight}
        rowCount={rowCount}
      >
        <ArrowStyled
          src={LeftSectionButton}
          style={{ transform: "rotateY(180deg)" }}
        />
      </ButtonStyled>
    </PaginationStyled>
  );
};

const ArrowStyled = styled.img`
  width: 24px;
  height: 24px;
`;

const StatusStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: bold;
  text-align: center;
  width: 80px;
`;

const ButtonStyled = styled.div<{
  dir: string;
  curPage: number;
  rowCount: number;
  totalCount?: number;
}>`
  width: 35px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 0 3px;
  font-size: 1.3rem;
  font-weight: bold;
`;

const PaginationStyled = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
`;

export default Pagination;
