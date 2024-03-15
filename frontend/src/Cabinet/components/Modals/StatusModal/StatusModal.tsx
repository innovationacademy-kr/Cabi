import React, { useState } from "react";
import styled from "styled-components";
import Button from "@/Cabinet/components/Common/Button";
import Dropdown from "@/Cabinet/components/Common/Dropdown";
import WarningNotification, {
  WarningNotificationProps,
} from "@/Cabinet/components/Common/WarningNotification";
import {
  cabinetIconSrcMap,
  cabinetStatusLabelMap,
  cabinetTypeLabelMap,
} from "@/Cabinet/assets/data/maps";
import CabinetStatus from "@/Cabinet/types/enum/cabinet.status.enum";
import CabinetType from "@/Cabinet/types/enum/cabinet.type.enum";
import ModalPortal from "../ModalPortal";

export interface StatusModalInterface {
  cabinetType: CabinetType;
  cabinetStatus: CabinetStatus;
  warningNotificationObj: WarningNotificationProps;
}

interface StatusModalContainerInterface {
  statusModalObj: StatusModalInterface;
  onClose: React.MouseEventHandler;
  onSave: any;
}

const TYPE_OPTIONS = [
  {
    name: "개인 사물함",
    value: CabinetType.PRIVATE,
    imageSrc: cabinetIconSrcMap[CabinetType.PRIVATE],
  },
  {
    name: "공유 사물함",
    value: CabinetType.SHARE,
    imageSrc: cabinetIconSrcMap[CabinetType.SHARE],
  },
  {
    name: "동아리 사물함",
    value: CabinetType.CLUB,
    imageSrc: cabinetIconSrcMap[CabinetType.CLUB],
  },
];

const STATUS_OPTIONS = [
  { name: "사용 가능", value: CabinetStatus.AVAILABLE },
  { name: "사용 불가", value: CabinetStatus.BROKEN },
  { name: "오픈 예정", value: CabinetStatus.PENDING },
  { name: "대기중", value: CabinetStatus.IN_SESSION },
];

const StatusModal = ({
  statusModalObj,
  onClose,
  onSave,
}: StatusModalContainerInterface) => {
  const { cabinetType, cabinetStatus, warningNotificationObj } = statusModalObj;
  const [mode, setMode] = useState<string>("read");
  const [newCabinetType, setNewCabinetType] =
    useState<CabinetType>(cabinetType);
  const [newCabinetStatus, setNewCabinetStatus] =
    useState<CabinetStatus>(cabinetStatus);
  const handleClickWriteMode = (e: any) => {
    setMode("write");
  };

  const handleDropdownChangeValue = (val: CabinetType | CabinetStatus) => {
    if (Object.values(CabinetType).includes(val as CabinetType)) {
      setNewCabinetType(val as CabinetType);
      return;
    }
    setNewCabinetStatus(val as CabinetStatus);
  };

  const TYPE_DROP_DOWN_PROPS = {
    options: TYPE_OPTIONS,
    defaultValue: cabinetTypeLabelMap[newCabinetType],
    defaultImageSrc: cabinetIconSrcMap[cabinetType],
    onChangeValue: handleDropdownChangeValue,
  };

  const STATUS_DROP_DOWN_PROPS = {
    options: STATUS_OPTIONS,
    defaultValue: cabinetStatusLabelMap[newCabinetStatus],
    onChangeValue: handleDropdownChangeValue,
  };

  const handleClickSave = () => {
    setMode("read");
    onSave(newCabinetType, newCabinetStatus);
  };

  return (
    <ModalPortal>
      <BackgroundStyled onClick={onClose} />
      <ModalContainerStyled type={"confirm"}>
        <WriteModeButtonStyled mode={mode} onClick={handleClickWriteMode}>
          수정하기
        </WriteModeButtonStyled>
        <H2Styled>상태 관리</H2Styled>
        {mode === "write" && (
          <WarningBoxStyled>
            <WarningNotification {...warningNotificationObj} />
          </WarningBoxStyled>
        )}

        <ContentSectionStyled>
          <ContentItemSectionStyled>
            <ContentItemWrapperStyled isVisible={true}>
              <ContentItemTitleStyled>사물함 타입</ContentItemTitleStyled>
              {mode === "read" ? (
                <ContentItemContainerStyled mode={mode}>
                  <div style={{ width: "18px", height: "18px" }}>
                    <img src={cabinetIconSrcMap[cabinetType]} />
                  </div>
                  <p>{cabinetTypeLabelMap[newCabinetType]}</p>
                </ContentItemContainerStyled>
              ) : (
                <Dropdown {...TYPE_DROP_DOWN_PROPS} />
              )}
            </ContentItemWrapperStyled>
            <ContentItemWrapperStyled isVisible={true}>
              <ContentItemTitleStyled>사물함 상태</ContentItemTitleStyled>
              {mode === "read" ? (
                <ContentItemContainerStyled mode={mode}>
                  <p>{cabinetStatusLabelMap[newCabinetStatus]}</p>
                </ContentItemContainerStyled>
              ) : (
                <Dropdown {...STATUS_DROP_DOWN_PROPS} />
              )}
            </ContentItemWrapperStyled>
          </ContentItemSectionStyled>
        </ContentSectionStyled>
        <ButtonWrapperStyled mode={mode}>
          {mode === "write" && (
            <Button
              onClick={handleClickSave}
              text="저장"
              theme="fill"
              disabled={warningNotificationObj.isVisible}
            />
          )}
          <Button
            onClick={
              mode === "read"
                ? onClose
                : () => {
                    setMode("read");
                    setNewCabinetStatus(cabinetStatus);
                    setNewCabinetType(cabinetType);
                  }
            }
            text={mode === "read" ? "닫기" : "취소"}
            theme={mode === "read" ? "lightGrayLine" : "line"}
          />
        </ButtonWrapperStyled>
      </ModalContainerStyled>
    </ModalPortal>
  );
};

const ModalContainerStyled = styled.div<{ type: string }>`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 360px;
  background: white;
  z-index: 1000;
  border-radius: 10px;
  transform: translate(-50%, -50%);
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  padding: 40px;
`;

export const DetailStyled = styled.p`
  margin: 0 30px 30px 30px;
  line-height: 1.2em;
  white-space: break-spaces;
`;

const H2Styled = styled.h2`
  font-weight: 600;
  font-size: 1.5rem;
  margin: 0 30px 25px 0px;
  white-space: break-spaces;
  text-align: start;
`;

const ContentSectionStyled = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const ContentItemSectionStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ContentItemWrapperStyled = styled.div<{
  isVisible: boolean;
}>`
  display: ${({ isVisible }) => (isVisible ? "flex" : "none")};
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 25px;
`;

const ContentItemTitleStyled = styled.h3`
  font-size: 1.125rem;
  margin-bottom: 8px;
`;

const ContentItemContainerStyled = styled.div<{ mode: string }>`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid var(--line-color);
  width: 100%;
  height: 60px;
  border-radius: 10px;
  text-align: start;
  padding-left: 20px;
  font-size: 1.125rem;
  color: var(--main-color);
  & > p {
    padding-left: 10px;
  }
`;

const BackgroundStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
`;

const WriteModeButtonStyled = styled.button<{ mode: string }>`
  display: ${({ mode }) => (mode === "read" ? "block" : "none")};
  position: absolute;
  right: 40px;
  padding: 0;
  font-style: normal;
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 17px;
  width: max-content;
  height: auto;
  border: none;
  outline: none;
  background: none;
  cursor: pointer;
  text-decoration: underline;
  color: var(--main-color);
  &:hover {
    opacity: 0.8;
  }
`;

const ButtonWrapperStyled = styled.div<{ mode: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${({ mode }) => (mode === "read" ? "75px" : "0")};
  @media (max-height: 745px) {
    margin-top: ${({ mode }) => (mode === "read" ? "68px" : "0")};
  }
`;

const WarningBoxStyled = styled.div`
  position: absolute;
  left: 40px;
  top: 40px;
`;
export default StatusModal;
