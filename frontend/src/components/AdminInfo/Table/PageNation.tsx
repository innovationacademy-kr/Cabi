import styled from "styled-components";

const Pagenation = ({
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
  border: 2px solid gray;
  border-radius: 100%;
  margin: 0 5px;
  cursor: pointer;
`;

const ActivaPageButtonStyled = styled(PageButtonStyled)`
  background: gray;
`;

const ButtonContainerStyled = styled.div`
  display: flex;
  align-items: center;
`;

const PaginationStyled = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  @media scr een and max-width(1200px) {
    margin-bottom: 5px;
  }
`;

export default Pagenation;
