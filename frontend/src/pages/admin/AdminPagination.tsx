import { useState } from "react";
import styled from "styled-components";

const AdminPagination = ({
  page,
  changePage,
}: {
  page: number;
  changePage: React.MouseEventHandler;
}) => {
  return (
    <AdminPaginationStyled page={page}>
      <PointStyled
        onClick={changePage}
        active={page === 0 ? true : false}
      ></PointStyled>
      <PointStyled
        onClick={changePage}
        active={page === 1 ? true : false}
      ></PointStyled>
    </AdminPaginationStyled>
  );
};

const PointStyled = styled.div<{ active: boolean }>`
  width: 23px;
  height: 23px;
  border-radius: 100%;
  border: 3px solid var(--gray-color);
  cursor: pointer;
  transition: 0.5s;
  &:hover {
    background: var(--gray-color);
  }
  background: ${(props) => (props.active ? "var(--gray-color)" : "none")};
`;

const AdminPaginationStyled = styled.div<{ page: number }>`
  position: fixed;
  width: 100px;
  height: 50px;
  transition: 0.5s;
  transition-timing-function: ease-in-out;
  transition-delay: 0.05s;
  left: ${({ page }) => (page === 0 ? "calc(50% - 50px)" : "40%")};
  top: 92%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export default AdminPagination;
