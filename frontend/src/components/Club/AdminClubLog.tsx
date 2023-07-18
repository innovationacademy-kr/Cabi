import styled, { css } from "styled-components";
import ClubLogTable from "@/components/Club/ClubLogTable";
import { IClubLog } from "@/types/dto/lent.dto";

const AdminClubLog = ({
  logs,
  page,
  totalPage,
  onClickPrev,
  onClickNext,
}: IClubLog) => {
  return (
    <AdminLentLogStyled>
      <ClubLogTable ClubList={logs} />
      <ButtonContainerStyled>
        <PageButtonStyled
          page={page}
          totalPage={totalPage}
          type="prev"
          onClick={onClickPrev}
        >
          이전
        </PageButtonStyled>
        <PageButtonStyled
          page={page}
          totalPage={totalPage}
          type="next"
          onClick={onClickNext}
        >
          다음
        </PageButtonStyled>
      </ButtonContainerStyled>
    </AdminLentLogStyled>
  );
};

const PageButtonStyled = styled.div<{
  page: number;
  totalPage: number;
  type: string;
}>`
  cursor: pointer;
  color: var(--main-color);
  position: absolute;
  display: ${({ page, totalPage, type }) => {
    if (type == "prev" && page == 0) return "none";
    if (type == "next" && (totalPage == 0 || page == totalPage - 1))
      return "none";
    return "block";
  }};
  ${({ type }) =>
    type === "prev"
      ? css`
          left: 0;
        `
      : css`
          right: 0;
        `}
`;

const ButtonContainerStyled = styled.div`
  position: relative;
  width: 80%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  margin-top: 25px;
`;

const AdminLentLogStyled = styled.div`
  //width: 100%;
`;

export default AdminClubLog;
