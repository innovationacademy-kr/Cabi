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
    <AdminClubLogStyled>
      <ClubLogTable ClubList={logs} />
      
    </AdminClubLogStyled>
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

const ButtonContainerStyled = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  overflow: hidden;
`;

const PageButtonStyled = styled.div<{
  page: number;
  totalPage: number;
  type: string;
}>`
  cursor: pointer;
  width: 50px;
  height: 100%;
  border-radius: 10px;
  background: linear-gradient(to left, transparent, rgba(0, 0, 0, 0.7));
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
          transform: rotate(-180deg);
        `}
`;

const ImgCenterStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const ImageStyled = styled.div`
  width: 40px;
  margin-right: 4px;
  filter: brightness(0%);
  border-radius: 50%;
`;

export default AdminClubLog;
