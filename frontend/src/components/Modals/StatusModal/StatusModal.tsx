import styled from "styled-components";
import Button from "@/components/Common/Button";
import React, { useRef, useState } from "react";
import CabinetType from "@/types/enum/cabinet.type.enum";
import ModalPortal from "../ModalPortal";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import Dropdown from "@/components/Common/Dropdown";
import { cabinetStatusLabelMap, cabinetTypeLabelMap } from "@/assets/data/maps";

export interface StatusModalInterface {
  cabinetType: CabinetType;
  cabinetStatus: CabinetStatus;
}

interface StatusModalContainerInterface {
  statusModalObj: StatusModalInterface;
  onClose: React.MouseEventHandler;
  onSave: any;
}

const TYPE_OPTIONS = [
  { name: "동아리 사물함", value: CabinetType.CLUB },
  { name: "개인 사물함", value: CabinetType.PRIVATE },
  { name: "공유 사물함", value: CabinetType.SHARE },
];

const STATUS_OPTIONS = [
  { name: "사용 가능", value: CabinetStatus.AVAILABLE },
  { name: "사용 불가", value: CabinetStatus.BROKEN },
];

const StatusModal = ({
  statusModalObj,
  onClose,
  onSave,
}: StatusModalContainerInterface) => {
  const { cabinetType, cabinetStatus } = statusModalObj;
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
        <ContentSectionStyled>
          <ContentItemSectionStyled>
            <ContentItemWrapperStyled isVisible={true}>
              <ContentItemTitleStyled>사물함 타입</ContentItemTitleStyled>
              {mode === "read" ? (
                <ContentItemContainerStyled mode={mode}>
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
        <input id="unselect-input" readOnly style={{ height: 0, width: 0 }} />
        <ButtonWrapperStyled mode={mode}>
          {mode === "write" && (
            <Button onClick={handleClickSave} text="저장" theme="fill" />
          )}
          <Button
            onClick={
              mode === "read"
                ? onClose
                : () => {
                    setMode("read");
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

const ContentItemWrapperStyled = styled.div<{ isVisible: boolean }>`
  display: ${({ isVisible }) => (isVisible ? "flex" : "none")};
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 25px;
`;

const ContentItemTitleStyled = styled.h3`
  font-size: 18px;
  margin-bottom: 8px;
`;

const ContentItemContainerStyled = styled.div<{ mode: string }>`
  position: relative;
  border: 1px solid var(--line-color);
  width: 100%;
  height: 60px;
  border-radius: 10px;
  text-align: start;
  text-indent: 20px;
  font-size: 18px;
  color: var(--main-color);
  & p {
    position: absolute;
    top: 32%;
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
  font-size: 14px;
  line-height: 17px;
  width: max-content;
  height: auto;
  border: none;
  outline: none;
  background: none;
  cursor: pointer;
  text-decoration: underline;
  color: var(--main-color);
  &: hover {
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

export default StatusModal;
