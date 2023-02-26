import styled from "styled-components";
import LeftSectionButton from "@/assets/images/LeftSectionButton.svg";

const Pagination2 = ({
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
  console.log(curPage, totalCount, rowCount);

  return totalCount > rowCount ? (
    <PaginationStyled2>
      <ButtonContainerStyled>
        {new Array(Math.ceil(totalCount / rowCount))
          .fill(0)
          .map((_, idx) =>
            idx === curPage ? (
              <ActivaPageButtonStyled />
            ) : (
              <PageButtonStyled onClick={() => onClick(idx)} />
            )
          )}
      </ButtonContainerStyled>
    </PaginationStyled2>
  ) : (
    <PaginationStyled2></PaginationStyled2>
  );
};

const ArrowStyled = styled.img`
  width: 24px;
  height: 24px;
`;

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

const PaginationStyled2 = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  @media scr een and max-width(1200px) {
    margin-bottom: 5px;
  }
`;

export default Pagination2;
