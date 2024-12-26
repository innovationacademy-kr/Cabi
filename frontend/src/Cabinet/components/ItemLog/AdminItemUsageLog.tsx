import styled, { css } from "styled-components";
import AdminItemLogTable from "@/Cabinet/components/ItemLog/ItemLogTable/AdminItemLogTable";
import { IItemLog } from "@/Cabinet/types/dto/admin.dto";

const AdminItemUsageLog = ({
  closeItem,
  logs,
  page,
  totalPage,
  onClickPrev,
  onClickNext,
}: IItemLog) => {
  return (
    <AdminItemUsageLogStyled>
      <AdminItemLogTable itemLog={logs} />
      <ButtonWrapperStyled>
        <PageButtonStyled
          page={page}
          totalPage={totalPage}
          type="prev"
          onClick={onClickPrev}
          className="logPageButton"
        >
          <ImgCenterStyled>
            <ImageStyled>
              <img
                src="/src/Cabinet/assets/images/LeftSectionButton.svg"
                alt=""
              />
            </ImageStyled>
          </ImgCenterStyled>
        </PageButtonStyled>
        <PageButtonStyled
          page={page}
          totalPage={totalPage}
          type="next"
          onClick={onClickNext}
          className="logPageButton"
        >
          <ImgCenterStyled>
            <ImageStyled>
              <img
                src="/src/Cabinet/assets/images/LeftSectionButton.svg"
                alt=""
              />
            </ImageStyled>
          </ImgCenterStyled>
        </PageButtonStyled>
      </ButtonWrapperStyled>
    </AdminItemUsageLogStyled>
  );
};

const AdminItemUsageLogStyled = styled.div`
  width: 100%;
  position: relative;
`;

const ButtonWrapperStyled = styled.div`
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
  &:hover > .logPageButton {
    opacity: 1;
  }
`;

const PageButtonStyled = styled.div<{
  page: number;
  totalPage: number;
  type: string;
}>`
  cursor: pointer;
  width: 40px;
  height: 100%;
  border-radius: 10px;
  position: absolute;
  opacity: 0.5;
  transition: opacity 0.5s;
  background: linear-gradient(
    to left,
    transparent,
    var(--page-btn-shadow-color)
  );
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

export default AdminItemUsageLog;
