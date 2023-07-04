import { useState } from "react";
import styled from "styled-components";
import AdminCabinetLentLogContainer from "@/components/LentLog/AdminCabinetLentLog.container";
import AdminUserLentLogContainer from "@/components/LentLog/AdminUserLentLog.container";
import useMenu from "@/hooks/useMenu";

const AdminUserLentLog = ({ lentType }: { lentType: string }) => {
  const { closeLent } = useMenu();
  const [togglelentType, setToggleLentType] = useState<string>(lentType);

  const switchLentType = () => {
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
        <TitleStyled onClick={switchLentType}>
          <ImageStyled>
            <img src="/src/assets/images/LeftSectionButton.svg" alt="" />
          </ImageStyled>
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
  color: var(--lightpurple-color);
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
  margin-bottom: 30px;
`;

const TitleStyled = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
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
