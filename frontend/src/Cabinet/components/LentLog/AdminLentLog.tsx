import { useEffect, useState } from "react";
import styled from "styled-components";
import AdminCabinetLentLogContainer from "@/Cabinet/components/LentLog/AdminCabinetLentLog.container";
import AdminUserLentLogContainer from "@/Cabinet/components/LentLog/AdminUserLentLog.container";
import useMenu from "@/Cabinet/hooks/useMenu";

const AdminLentLog = ({ lentType }: { lentType: string }) => {
  const { closeLent } = useMenu();
  const [togglelentType, setToggleLentType] = useState<string>(lentType);
  const isSearchPage = window.location.pathname === "/admin/search";

  useEffect(() => {
    if (!isSearchPage && lentType === "CABINET") setToggleLentType("CABINET");
  }, [isSearchPage]);

  const switchLentType = () => {
    if (!isSearchPage) return;
    if (togglelentType === "USER") {
      setToggleLentType("CABINET");
    } else {
      setToggleLentType("USER");
    }
  };

  const getLentTypeText = (str: string) => {
    if (str === "USER") {
      return "유저";
    } else {
      return "사물함";
    }
  };

  return (
    <AdminLentLogStyled id="lentInfo">
      <TitleContainer>
        <TitleStyled isClick={isSearchPage} onClick={switchLentType}>
          {isSearchPage && (
            <ImageStyled>
              <img
                src="/src/Cabinet/assets/images/LeftSectionButton.svg"
                alt=""
              />
            </ImageStyled>
          )}
          {getLentTypeText(togglelentType)} 대여 기록
        </TitleStyled>
        <GoBackButtonStyled onClick={closeLent}>뒤로가기</GoBackButtonStyled>
      </TitleContainer>
      {togglelentType === "CABINET" ? (
        <AdminCabinetLentLogContainer />
      ) : (
        <AdminUserLentLogContainer />
      )}
    </AdminLentLogStyled>
  );
};

const GoBackButtonStyled = styled.div`
  position: absolute;
  top: 3%;
  color: var(--sys-sub-color);
  right: 6%;
  font-size: 0.875rem;
  text-decoration: underline;
  cursor: pointer;
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 15px;
  margin-bottom: 25px;
`;

const TitleStyled = styled.h1<{ isClick: boolean }>`
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  cursor: ${(props) => (props.isClick ? "pointer" : "default")};
  &:hover {
    color: ${(props) => (props.isClick ? "var(--sys-main-color)" : "")};
  }
`;

const ImageStyled = styled.div`
  width: 24px;
  transform: rotate(-90deg);
  margin-right: 4px;
`;

const AdminLentLogStyled = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  min-width: 330px;
  min-height: 100%;
  padding: 40px 20px 10px 20px;
  z-index: 9;
  transform: translateX(120%);
  transition: transform 0.3s ease-in-out;
  box-shadow: 0 0 40px 0 var(--page-btn-shadow-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--bg-color);
  &.on {
    transform: translateX(0);
  }
`;

export default AdminLentLog;
