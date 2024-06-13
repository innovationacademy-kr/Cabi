import { useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { targetUserInfoState } from "@/Cabinet/recoil/atoms";
import AdminItemUsageLogPage from "@/Cabinet/pages/admin/AdminItemUsageLogPage";
import ButtonContainer from "@/Cabinet/components/Common/Button";
import SelectInduction from "@/Cabinet/components/Common/SelectInduction";
import AdminLentLog from "@/Cabinet/components/LentLog/AdminLentLog";
import AdminItemProvisionModal from "@/Cabinet/components/Modals/StoreModal/AdminItemProvisionModal";
import { ReactComponent as LogoIcon } from "@/Cabinet/assets/images/logo.svg";
import useMenu from "@/Cabinet/hooks/useMenu";

interface ISelectedUserStoreInfo {
  name: string;
  userId: number | null;
}

const UserStoreInfoArea = (): JSX.Element => {
  const [targetUserInfo] = useRecoilState(targetUserInfoState);
  const { openUserStore, closeCabinet } = useMenu();
  const [showItemProvisionModal, setShowItemProvisionModal] =
    useState<boolean>(false);
  const userInfoData: ISelectedUserStoreInfo | undefined = targetUserInfo
    ? {
        name: targetUserInfo.name,
        userId: targetUserInfo.userId,
      }
    : undefined;

  const handleOpenItemProvisionModal = () => {
    setShowItemProvisionModal(true);
  };

  const handleCloseItemProvisionModal = () => {
    setShowItemProvisionModal(false);
  };

  return (
    <>
      {userInfoData ? (
        <UserStoreInfoAreaStyled>
          <LinkTextStyled onClick={openUserStore}>아이템 기록</LinkTextStyled>
          <TextStyled fontSize="1rem" fontColor="var(--normal-text-color)">
            {userInfoData.name}
          </TextStyled>
          <UserImgRectangleStyled>
            <UserInfoAreaLogoIconStyled selected={userInfoData}>
              <LogoIcon />
            </UserInfoAreaLogoIconStyled>
          </UserImgRectangleStyled>
          <UserStoreInfoBtnsWrapperStyled>
            <ButtonContainer
              onClick={handleOpenItemProvisionModal}
              text="아이템 지급"
              theme="line"
            />
            <ButtonContainer
              onClick={closeCabinet}
              text="닫기"
              theme="grayLine"
            />
          </UserStoreInfoBtnsWrapperStyled>
          {showItemProvisionModal && (
            <AdminItemProvisionModal onClose={handleCloseItemProvisionModal} />
          )}
        </UserStoreInfoAreaStyled>
      ) : (
        <SelectInduction
          msg="유저를
              선택해주세요"
        />
      )}
      {userInfoData && <AdminItemUsageLogPage />}
    </>
  );
};

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
