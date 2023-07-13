import React, { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { selectedClubInfoState } from "@/recoil/atoms";
import styled from "styled-components";
import Button from "@/components/Common/Button";
import {
  SuccessResponseModal,
  FailResponseModal,
} from "@/components/Modals/ResponseModal/ResponseModal";
import ModalPortal from "@/components/Modals/ModalPortal";
import { additionalModalType, modalPropsMap } from "@/assets/data/maps";
import { axiosCreateClubUser, axiosDeleteClubUser } from "@/api/axios/axios.custom";

interface ClubModalContainerInterface {
  type: string;
  onClose: React.MouseEventHandler;
  onReload: () => void;
}

const MAX_INPUT_LENGTH = 16;

const ClubModal = ({
  type,
  onClose,
  onReload,
}: ClubModalContainerInterface) => {
  const [selectedClubInfo, setSelectedClubInfo] = useRecoilState(selectedClubInfoState);
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const newClubName = useRef<HTMLInputElement>(null);

  const modalData = modalPropsMap[
    additionalModalType[
      `MODAL_ADMIN_CLUB_${type}` as keyof typeof additionalModalType
    ]
  ];
  
  const handleClickSave = async () => {
    if (type === "CREATE") {
      document.getElementById("unselect-input")?.focus();
      if (newClubName.current!.value) {
        const clubName = newClubName.current!.value;  
        await createClubRequest(clubName);
      }
    }
    else if (type === "DELETE" && selectedClubInfo !== null) 
      await deleteClubRequest(selectedClubInfo.userId);
  };

  const createClubRequest = async (clubName: string | null) => {
    try {
      await axiosCreateClubUser(clubName);
      setModalTitle("추가되었습니다");
      onReload();
    } catch (error: any) {
      // setModalTitle("이미 같은 이름의 동아리가 존재합니다");
      setModalTitle(error.response.data.message);
      setHasErrorOnResponse(true);
    } finally {
      setShowResponseModal(true);
    }
  };

  const deleteClubRequest = async (clubId: number | null) => {
    try {
      await axiosDeleteClubUser(clubId);
      setModalTitle("삭제되었습니다");
      onReload();
    } catch (error: any) {
      setModalTitle(error.response.data.message);
      setHasErrorOnResponse(true);
    } finally {
      setShowResponseModal(true);
      setSelectedClubInfo(null);
    }
  };

  return (
    <ModalPortal>
      <BackgroundStyled onClick={onClose} />
      {!showResponseModal && <ModalContainerStyled>
        <H2Styled>{modalData.title}</H2Styled>
        <ContentSectionStyled>
          <ContentItemSectionStyled>
            {type === "CREATE" && <ContentItemWrapperStyled isVisible={true}>
              <ContentItemTitleStyled>동아리명</ContentItemTitleStyled>
              <ContentItemInputStyled
                onKeyUp={(e: any) => { if (e.key === "Enter") { handleClickSave(); }}}
                ref={newClubName}
                maxLength={MAX_INPUT_LENGTH}
              />
            </ContentItemWrapperStyled>}
            {type === "DELETE" && <ContentItemTitleStyled>{selectedClubInfo?.name} 동아리를 <strong>삭제</strong> 하시겠습니까?</ContentItemTitleStyled>}
          </ContentItemSectionStyled>
        </ContentSectionStyled>
        <input id="unselect-input" readOnly style={{ height: 0, width: 0 }} />
        <ButtonWrapperStyled>
          <Button
            onClick={handleClickSave}
            text={modalData.confirmMessage}
            theme="fill"
          />
          <Button
            onClick={onClose}
            text={"닫기"}
            theme={"line"}
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

const ModalContainerStyled = styled.div`
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

const ContentItemInputStyled = styled.input`
  border: 1px solid var(--line-color);
  width: 100%;
  height: 60px;
  border-radius: 10px;
  text-align: start;
  text-indent: 20px;
  font-size: 18px;
  /* cursor: input; */
  color: black;

  &::placeholder {
    color: var(--line-color);
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

const ButtonWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0;

  @media (max-height: 745px) {
    margin-top: 0;
  }
`;

export default ClubModal;
