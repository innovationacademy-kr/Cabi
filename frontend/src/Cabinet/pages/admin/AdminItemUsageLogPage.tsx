import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AdminItemProvideContainer from "@/Cabinet/components/ItemLog/AdminItemProvideLog.container";
import AdminItemUsageLogContainer from "@/Cabinet/components/ItemLog/AdminItemUsageLog.container";
import useMenu from "@/Cabinet/hooks/useMenu";

const AdminItemUsageLogPage = ({
  toggleType = "PROVIDE",
}: {
  toggleType?: string;
}) => {
  const { closeUserStore } = useMenu();
  const [currentToggleType, setToggleType] = useState<string>(toggleType);
  const isSearchPage = window.location.pathname === "/admin/search";

  useEffect(() => {
    if (!isSearchPage && toggleType !== currentToggleType) {
      setToggleType("PROVIDE");
    }
  }, [isSearchPage, toggleType]);

  const switchToggleType = () => {
    setToggleType(currentToggleType === "PROVIDE" ? "LIST" : "PROVIDE");
  };

  return (
    <AdminItemLogStyled id="itemInfo">
      <TitleContainer>
        <TitleStyled isClick={isSearchPage} onClick={switchToggleType}>
          {isSearchPage && (
            <ImageStyled>
              <img
                src="/src/Cabinet/assets/images/LeftSectionButton.svg"
                alt=""
              />
            </ImageStyled>
          )}
          {currentToggleType === "PROVIDE" ? "아이템 지급 기록" : "아이템 내역"}
        </TitleStyled>
        <GoBackButtonStyled onClick={closeUserStore}>뒤로가기</GoBackButtonStyled>
      </TitleContainer>
      {currentToggleType === "PROVIDE" ? (
        <AdminItemProvideContainer />
      ) : (
        <AdminItemUsageLogContainer />
      )}
    </AdminItemLogStyled>
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

const AdminItemLogStyled = styled.div`
  position: absolute;
  top: 120px;
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

export default AdminItemUsageLogPage;
