import styled from "styled-components";

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
  const onClick = (idx: number) => setCurPage(idx);

  return (
    <PaginationStyled>
      <ButtonContainerStyled>
        {new Array(Math.ceil(totalCount / rowCount))
          .fill(0)
          .map((_, idx) =>
            idx === curPage ? (
              <ActivaPageButtonStyled key={idx} />
            ) : (
              <PageButtonStyled key={idx} onClick={() => onClick(idx)} />
            )
          )}
      </ButtonContainerStyled>
    </PaginationStyled>
  );
};

const PageButtonStyled = styled.div`
  width: 10px;
  height: 10px;
  border: 2px solid var(--line-color);
  border-radius: 100%;
  margin: 0 5px;
  cursor: pointer;
`;

const ActivaPageButtonStyled = styled(PageButtonStyled)`
  background: var(--gray-color);
  border: 2px solid var(--gray-color);
`;

const ButtonContainerStyled = styled.div`
  display: flex;
  align-items: center;
`;

const PaginationStyled = styled.div`
  width: 100%;
  height: 40px;
  padding-bottom: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 1200px) {
    margin-bottom: 5px;
  }
`;

export default Pagination;
