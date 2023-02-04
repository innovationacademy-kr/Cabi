import styled, { css } from "styled-components";

const Pagination = ({
  setCurPage,
  curPage,
  totalCount,
}: {
  setCurPage: React.Dispatch<React.SetStateAction<number>>;
  curPage: number;
  totalCount: number;
}) => {
  const onClickLeft = () => {
    if (curPage > 0) {
      setCurPage(curPage - 1);
    }
  };
  const onClickRight = () => {
    if (curPage + 1 < Math.ceil(totalCount / 10)) {
      setCurPage(curPage + 1);
    }
  };
  const onClickLeftDouble = () => {
    if (curPage > 0) {
      setCurPage(0);
    }
  };
  const onClickRightDouble = () => {
    if (curPage + 1 < Math.ceil(totalCount / 10)) {
      setCurPage(Math.ceil(totalCount / 10) - 1);
    }
  };
  return (
    <PaginationStyled>
      {totalCount > 20 && (
        <ButtonStyled dir="left" curPage={curPage} onClick={onClickLeftDouble}>
          {"<"}
          {"<"}
        </ButtonStyled>
      )}
      <ButtonStyled dir="left" curPage={curPage} onClick={onClickLeft}>
        {"<"}
      </ButtonStyled>
      <StatusStyled>
        <div>{`${curPage + 1} / ${Math.ceil(totalCount / 10)}`}</div>
        <div>{`총 ${totalCount}건`}</div>
      </StatusStyled>
      <ButtonStyled
        dir="right"
        curPage={curPage}
        totalCount={totalCount}
        onClick={onClickRight}
      >
        {">"}
      </ButtonStyled>
      {totalCount > 20 && (
        <ButtonStyled
          dir="right"
          curPage={curPage}
          totalCount={totalCount}
          onClick={onClickRightDouble}
        >
          {">"}
          {">"}
        </ButtonStyled>
      )}
    </PaginationStyled>
  );
};

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
  totalCount?: number;
}>`
  border: 1px solid black;
  border-radius: 5px;
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 0 3px;
  font-size: 1.3rem;
  font-weight: bold;
  ${({ curPage, dir, totalCount }) => {
    if (curPage === 0 && dir === "left") {
      return css`
        color: #d7d7d7;
        border: 1px solid #d7d7d7;
        cursor: default;
      `;
    } else if (
      totalCount &&
      curPage + 1 === Math.ceil(totalCount / 10) &&
      dir === "right"
    ) {
      return css`
        color: #d7d7d7;
        border: 1px solid #d7d7d7;
        cursor: default;
      `;
    } else {
      return css``;
    }
  }}
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
