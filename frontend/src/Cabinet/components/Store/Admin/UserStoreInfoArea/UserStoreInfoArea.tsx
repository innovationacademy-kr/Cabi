import React, { useState } from "react";
import styled from "styled-components";
import ButtonContainer from "@/Cabinet/components/Common/Button";
import AdminUseItemModal from "@/Cabinet/components/Modals/StoreModal/AdminUseItemModal";
import { ISelectedUserStoreInfo } from "@/Cabinet/components/Store/Admin/UserStoreInfoArea/UserStoreInfoArea.container";
import { ReactComponent as LogoIcon } from "@/Cabinet/assets/images/logo.svg";

const UserStoreInfoArea: React.FC<{
  selectedUserInfo?: ISelectedUserStoreInfo;
  openUserStore: React.MouseEventHandler;
  closeCabinet: () => void;
}> = (props) => {
  const { selectedUserInfo, openUserStore, closeCabinet } = props;
  const [showItemProvisionModal, setShowItemProvisionModal] =
    useState<boolean>(false);

  const handleOpenItemProvisionModal = () => {
    setShowItemProvisionModal(true);
  };
  const handleCloseItemProvisionModal = () => {
    setShowItemProvisionModal(false);
  };

  if (selectedUserInfo === undefined)
    return (
      <NotSelectedStyled>
        <UserInfoAreaLogoIconStyled selected={selectedUserInfo}>
          <LogoIcon />
        </UserInfoAreaLogoIconStyled>
        <TextStyled fontSize="1.125rem" fontColor="var(--gray-line-btn-color)">
          유저를 선택해주세요
        </TextStyled>
      </NotSelectedStyled>
    );

  return (
    <UserStoreInfoAreaStyled>
      <LinkTextStyled onClick={openUserStore}>아이템 기록</LinkTextStyled>
      <TextStyled fontSize="1rem" fontColor="var(--normal-text-color)">
        {selectedUserInfo.name}
      </TextStyled>
      <UserImgRectangleStyled>
        <UserInfoAreaLogoIconStyled selected={selectedUserInfo}>
          <LogoIcon />
        </UserInfoAreaLogoIconStyled>
      </UserImgRectangleStyled>
      <UserStoreInfoBtnsWrapperStyled>
        <ButtonContainer
          onClick={handleOpenItemProvisionModal}
          text="아이템 지급"
          theme="line"
        />
        <ButtonContainer onClick={closeCabinet} text="닫기" theme="grayLine" />
      </UserStoreInfoBtnsWrapperStyled>
      {showItemProvisionModal && (
        <AdminUseItemModal onClose={handleCloseItemProvisionModal} />
      )}
    </UserStoreInfoAreaStyled>
  );
};

const NotSelectedStyled = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const UserStoreInfoAreaStyled = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const LinkTextStyled = styled.div`
  position: absolute;
  top: 3%;
  right: 6%;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 0.875rem;
  color: var(--sys-sub-color);
  text-decoration: underline;
  :hover {
    cursor: pointer;
  }
`;

const TextStyled = styled.p<{ fontSize: string; fontColor: string }>`
  font-size: ${(props) => props.fontSize};
  font-weight: 400;
  line-height: 28px;
  color: ${(props) => props.fontColor};
  text-align: center;
  white-space: pre-line;
  & strong {
    color: var(--sys-main-color);
  }
`;

const UserImgRectangleStyled = styled.div`
  width: 80px;
  height: 80px;
  line-height: 80px;
  border-radius: 10px;
  margin-top: 15px;
  margin-bottom: 3vh;
  background-color: var(--full-color);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UserStoreInfoBtnsWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  max-height: 210px;
  margin: 3vh 0;
  width: 100%;
`;

export const UserInfoAreaLogoIconStyled = styled.div<{
  selected: ISelectedUserStoreInfo | undefined;
}>`
  width: ${(props) => (props.selected ? "42px" : "35px")};
  height: ${(props) => (props.selected ? "42px" : "35px")};
  display: flex;
  margin-bottom: ${(props) => (props.selected ? "0" : "10px")};

  & > svg {
    width: ${(props) => (props.selected ? "42px" : "35px")};
    height: ${(props) => (props.selected ? "42px" : "35px")};
    .logo_svg__currentPath {
      fill: var(--sys-main-color);
    }
  }
`;

export default UserStoreInfoArea;
