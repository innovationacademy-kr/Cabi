import styled, { css } from "styled-components";
import LogTable from "@/components/LentLog/LogTable/LogTable";
import { LentLogDto } from "@/types/dto/lent.dto";
import { STATUS_400_BAD_REQUEST } from "@/constants/StatusCode";

interface ILentLog {
  closeAndResetLogPage: React.MouseEventHandler;
  logs: LentLogDto[] | typeof STATUS_400_BAD_REQUEST | undefined;
  page: number;
  totalPage: number;
  onClickPrev: React.MouseEventHandler;
  onClickNext: React.MouseEventHandler;
}

const AdminUserLentLog = ({
  closeAndResetLogPage,
  logs,
  page,
  totalPage,
  onClickPrev,
  onClickNext,
}: ILentLog) => {
  return (
    <AdminLentLogStyled id="lentInfo">
      <TitleContainer>
        <TitleStyled>대여 기록</TitleStyled>
        <GoBackButtonStyled onClick={closeAndResetLogPage}>
          뒤로가기
        </GoBackButtonStyled>
      </TitleContainer>
      <LogTable lentLog={logs} />
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
    if (type == "next" && (totalPage == -1 || page == totalPage - 1))
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

const GoBackButtonStyled = styled.div`
  position: absolute;
  top: 3%;
  color: var(--lightpurple-color);
  right: 6%;
  font-size: 0.875rem;
  text-decoration: underline;
  cursor: pointer;
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

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
`;

const TitleStyled = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
`;

const AdminLentLogStyled = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  min-width: 330px;
  height: 100%;
  padding: 40px 20px;
  z-index: 9;
  transform: translateX(120%);
  transition: transform 0.3s ease-in-out;
  box-shadow: 0 0 40px 0 var(--bg-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--white);
  &.on {
    transform: translateX(0);
  }
`;

export default AdminUserLentLog;
