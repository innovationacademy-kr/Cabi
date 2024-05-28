import styled from "styled-components";
import AdminItemUsageLogContainer from "@/Cabinet/components/ItemLog/AdminItemUsageLog.container";
import useMenu from "@/Cabinet/hooks/useMenu";

const AdminItemUsageLogPage = () => {
  const { closeStore } = useMenu();
  return (
    <AdminItemLogStyled id="itemInfo">
      <TitleContainer>
        <TitleStyled>아이템 내역</TitleStyled>
        <GoBackButtonStyled onClick={closeStore}>뒤로가기</GoBackButtonStyled>
      </TitleContainer>
      <AdminItemUsageLogContainer />
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

const TitleStyled = styled.h1`
  margin-left: 20px;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
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
