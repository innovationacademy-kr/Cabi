import AdminChart from "@/components/AdminChart/AdminChart";
import AdminPreview from "@/components/AdminPreview/AdminPreview";
import { useState } from "react";
import styled from "styled-components";
import AdminPagination from "./AdminPagination";

const AdminHome = () => {
  const [page, setPage] = useState(0);
  const [scrollDirection, setscrollDirection] = useState(0);
  const [throttle, setThrottle] = useState(false);
  const changePage = () => setPage(page === 0 ? 1 : 0);
  const onScroll = (e: React.WheelEvent) => {
    if (throttle || window.innerWidth <= 768) return;
    setscrollDirection(e?.deltaY);
    setThrottle(true);
    setTimeout(async () => {
      if (scrollDirection > 0) {
        setPage(1);
      } else {
        setPage(0);
      }
      setThrottle(false);
    }, 300);
  };

  const [toggle, setToggle] = useState(false);

  const checkData = () => {
    setToggle(true);
  };
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <AdminHomeStyled page={page} onWheel={onScroll}>
        <AdminScrollStyled>
          <AdminChart />
          <AdminPreview checkData={checkData} />
        </AdminScrollStyled>
      </AdminHomeStyled>
      <AdminDetailBackgroundStyled
        toggle={toggle}
        onClick={() => {
          setToggle(false);
        }}
      />
      <AdminDetailStyled toggle={toggle} />
      <AdminPagination page={page} changePage={changePage} />
    </div>
  );
};

const AdminDetailBackgroundStyled = styled.div<{ toggle: boolean }>`
  @media screen and (max-width: 1200px) {
    display: ${({ toggle }) => (toggle ? "block" : "none")};
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    cursor: pointer;
  }
`;

const AdminDetailStyled = styled.div<{ toggle: boolean }>`
  @media screen and (max-width: 1200px) {
    display: ${({ toggle }) => (toggle ? "block" : "none")};
    width: 330px;
    height: 100%;
    position: fixed;
    right: 0;
    top: 0;
    background: var(--white);
    z-index: 2;
  }
`;

const AdminScrollStyled = styled.div`
  width: 200%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 768px) {
    width: 100%;
    height: 400%;
    display: block;
  }
`;

const AdminHomeStyled = styled.div<{ page: number }>`
  position: relative;
  width: 200%;
  height: 100%;
  display: flex;
  transition: 0.5s;
  transition-timing-function: ease-in-out;
  overflow-y: scroll;
  overflow-x: hidden;

  transform: ${({ page }) =>
    page === 0 ? "translateX(0%)" : "translateX(-50%)"};
  @media screen and (max-width: 768px) {
    width: 100%;
    height: 100%;
    background: var(--white);
  }
`;

export default AdminHome;
