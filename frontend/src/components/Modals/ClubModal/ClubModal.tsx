import React, { useRef, useState } from "react";
import styled from "styled-components";
import Button from "@/components/Common/Button";
import {
  SuccessResponseModal,
  FailResponseModal,
} from "@/components/Modals/ResponseModal/ResponseModal";
import ModalPortal from "@/components/Modals/ModalPortal";
import checkIcon from "@/assets/images/checkIcon.svg";
import { additionalModalType, modalPropsMap } from "@/assets/data/maps";
import CabinetType from "@/types/enum/cabinet.type.enum";
import { axiosCreateClubUser, axiosDeleteClubUser } from "@/api/axios/axios.custom";
import { atom, useRecoilState } from "recoil";
import { ClubUserDto } from "@/types/dto/lent.dto";

export interface ClubModalInterface {
  clubName: string | null;
}

interface ClubModalContainerInterface {
  clubModalObj: ClubModalInterface;
  type: string;
  onClose: React.MouseEventHandler;
}

// export const selectedClubNameState = atom<ClubUserDto>({
//   key: "selectedClubInfo",
//   default: undefined,
// });

const MAX_INPUT_LENGTH = 16;

const ClubModal = ({
  clubModalObj,
  type,
  onClose,
}: ClubModalContainerInterface) => {
  const { clubName } = clubModalObj || {};

  // const [selectedClubName, setSelectedClubName] = useRecoilState<ClubUserDto>(selectedClubNameState);

  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [mode, setMode] = useState<string>((type == "EDIT" ? "read" : "write"));
  const newClubName = useRef<HTMLInputElement>(null);

  const handleClickWriteMode = (e: any) => {
    setMode("write");
    if (newClubName.current) {
      newClubName.current.select();
    }
  };

  const handleClickSave = async (e: React.MouseEvent) => {
    document.getElementById("unselect-input")?.focus();
    if (newClubName.current!.value) {
      const clubName = newClubName.current!.value;  
      if (type === "CREATE")
        await createClubRequest(clubName);
      // else if (type === "EDIT")
        // await editClubRequest(clubName);
      else if (type === "DELETE")
        await deleteClubRequest(1024);
      onClose(e);
    }
  };

  const modalData = modalPropsMap[additionalModalType[`MODAL_ADMIN_CLUB_${type}` as keyof typeof additionalModalType]];
  const { title, confirmMessage } = modalData;

  const createClubRequest = async (clubName: string | null) => {
    // if (clubName === selectedClubName.clubName) clubName == null;
    try {
      await axiosCreateClubUser(clubName);
      setModalTitle("추가되었습니다");
    } catch (error: any) {
      setModalTitle(error.response.data.message);
      setHasErrorOnResponse(true);
    } finally {
      setShowResponseModal(true);
    }
  };

  // const editClubRequest = async (clubName: string | null) => {
  //   try {
  //     setModalTitle("수정되었습니다");
  //   } catch (error: any) {
  //     setModalTitle(error.response.data.message);
  //     setHasErrorOnResponse(true);
  //   } finally {
  //     setShowResponseModal(true);
  //   }
  // };

  const deleteClubRequest = async (clubId: number | null) => {
    try {
      await axiosDeleteClubUser(clubId);
      setModalTitle("삭제되었습니다");
    } catch (error: any) {
      setModalTitle(error.response.data.message);
      setHasErrorOnResponse(true);
    } finally {
      setShowResponseModal(true);
    }
  };

  return (
    <ModalPortal>
      <BackgroundStyled onClick={onClose} />
      {!showResponseModal && <ModalContainerStyled type={"confirm"}>
        <H2Styled>{title}</H2Styled>
        {type == "EDIT" && <WriteModeButtonStyled mode={mode} onClick={handleClickWriteMode}>
          수정하기
        </WriteModeButtonStyled>}
        <ContentSectionStyled>
          <ContentItemSectionStyled>
            <ContentItemWrapperStyled isVisible={true}>
              <ContentItemTitleStyled>동아리 이름</ContentItemTitleStyled>
              <ContentItemInputStyled
                onKeyUp={(e: any) => {
                  if (e.key === "Enter") {
                    handleClickSave(e);
                  }
                }}
                placeholder={clubName ? clubName : ""}
                mode={mode}
                defaultValue={clubName ? clubName : ""}
                readOnly={mode === "read" ? true : false}
                ref={newClubName}
                maxLength={MAX_INPUT_LENGTH}
              />
            </ContentItemWrapperStyled>
          </ContentItemSectionStyled>
        </ContentSectionStyled>
        <input id="unselect-input" readOnly style={{ height: 0, width: 0 }} />
        <ButtonWrapperStyled mode={mode}>
          {mode === "write" && (
            <Button onClick={handleClickSave} text={confirmMessage} theme="fill" />
          )}
          <Button
            onClick={
              mode === "read"
                ? onClose
                : () => {
                    setMode("read");
                    if (clubName) newClubName.current!.value = clubName;
                  }
            }
            text={mode === "read" ? "닫기" : "취소"}
            theme={mode === "read" ? "lightGrayLine" : "line"}
          />
        </ButtonWrapperStyled>
      </ModalContainerStyled>}
      {showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal
            modalTitle={modalTitle}
            closeModal={onClose}
          />
        ) : (
          <SuccessResponseModal
            modalTitle={modalTitle}
            closeModal={onClose}
          />
        ))}
    </ModalPortal>
  );
};

const ModalContainerStyled = styled.div<{ type: string }>`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 460px;
  background: white;
  z-index: 1000;
  border-radius: 10px;
  transform: translate(-50%, -50%);
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  text-align: enter;
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

const ContentItemInputStyled = styled.input<{ mode: string }>`
  border: 1px solid var(--line-color);
  width: 100%;
  height: 60px;
  border-radius: 10px;
  text-align: start;
  text-indent: 20px;
  font-size: 18px;
  cursor: ${({ mode }) => (mode === "read" ? "default" : "input")};
  color: ${({ mode }) => (mode === "read" ? "var(--main-color)" : "black")};

  &::placeholder {
    color: ${({ mode }) =>
      mode === "read" ? "var(--main-color)" : "var(--line-color)"};
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

export default ClubModal;
