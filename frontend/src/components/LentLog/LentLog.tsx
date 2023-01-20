import styled, { css } from "styled-components";
import LogTable from "@/components/LentLog/LogTable/LogTable";

interface ILogData {
  loc: string;
  lent_begin: string;
  lent_end: string;
}

interface ILentLog {
  closeLent: React.MouseEventHandler;
  logs: ILogData[];
  page: number;
  totalPage: number;
  onClickPrev: React.MouseEventHandler;
  onClickNext: React.MouseEventHandler;
}

const LentLog = ({
  closeLent,
  logs,
  page,
  totalPage,
  onClickPrev,
  onClickNext,
}: ILentLog) => {
  return (
    <LentLogStyled id="lentInfo">
      <TitleContainer>
        <TitleStyled>대여 기록</TitleStyled>
        <GoBackButtonStyled onClick={closeLent}>뒤로 가기</GoBackButtonStyled>
      </TitleContainer>
      <LogTable data={logs} />
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
    </LentLogStyled>
  );
};

const PageButtonStyled = styled.div<{
  page: number;
  totalPage: number | undefined;
  type: string;
}>`
  cursor: pointer;
  color: var(--main-color);
  position: absolute;
  display: ${({ page, totalPage, type }) => {
    if (type == "prev" && page == 1) return "none";
    if (type == "next" && page == totalPage) return "none";
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
  color: var(--lightpurple-color);
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
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const TitleStyled = styled.h1`
  font-size: 2rem;
`;

const LentLogStyled = styled.div`
  position: fixed;
  top: 80px;
  right: 0;
  min-width: 330px;
  width: 30px;
  height: calc(100% - 80px);
  padding: 40px;
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

export default LentLog;
