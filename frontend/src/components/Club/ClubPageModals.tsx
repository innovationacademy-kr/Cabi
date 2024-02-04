import { useEffect, useState } from "react";
import {
  ClubInfoResponseDto,
  ClubPaginationResponseDto,
} from "@/types/dto/club.dto";
import AddClubMemModalContainer from "../Modals/ClubModal/AddClubMemModal.container";
import DeleteClubMemModal from "../Modals/ClubModal/DeleteClubMemModal";
import MandateClubMemModal from "../Modals/ClubModal/MandateClubMemModal";
import ClubMembersContainer from "./ClubMembers.container";

export type TClubModalState =
  | "addModal"
  | "deleteModal"
  | "mandateModal"
  | "passwordCheckModal";

export interface ICurrentClubModalStateInfo {
  addModal: boolean;
  deleteModal: boolean;
  mandateModal: boolean;
  passwordCheckModal: boolean;
}

const ClubPageModals: React.FC<{
  clubInfo: ClubInfoResponseDto;
  clubId: number;
  page: number;
  getClubInfo: (clubId: number) => Promise<void>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalName, setModalName] = useState("");
  const [targetMember, setTargetMember] = useState("");
  const [targetId, setTargetId] = useState(0);
  const [mandateMember, setMandateMember] = useState("");

  // 나중에 함수로 묶기
  // const getModalParams = (targetName: string) => {
  //   setTargetMember(targetName);
  //   setTargetId(targetId);
  //   setMandateMember(mandateMember);
  // };

  const [userModal, setUserModal] = useState<ICurrentClubModalStateInfo>({
    addModal: false,
    deleteModal: false,
    mandateModal: false,
    passwordCheckModal: false,
  });

  const closeModal = () => {
    setUserModal({
      ...userModal,
      addModal: false,
      deleteModal: false,
      mandateModal: false,
      passwordCheckModal: false,
    });
  };

  const openModal = (modalName: TClubModalState) => {
    if (modalName === "addModal") {
      setModalName("addModal");
    } else if (modalName === "deleteModal") {
      setModalName("deleteModal");
    } else if (modalName === "mandateModal") {
      setModalName("mandateModal");
    } else if (modalName === "passwordCheckModal") {
      setModalName("passwordCheckModal");
    }
    // setIsModalOpen(true);
    setUserModal({
      ...userModal,
      [modalName]: true,
    });
  };

  return (
    // 필요한 param => mandateMember, targetMember, targetId
    <>
      {userModal.addModal ? (
        <AddClubMemModalContainer
          closeModal={() => {
            closeModal();
          }}
          clubId={props.clubId}
          getClubInfo={props.getClubInfo}
          setPage={props.setPage}
        />
      ) : userModal.mandateModal ? (
        <MandateClubMemModal
          closeModal={() => {
            closeModal();
          }}
          clubId={props.clubId}
          mandateMember={mandateMember}
          getClubInfo={props.getClubInfo}
          setPage={props.setPage}
        />
      ) : userModal.deleteModal ? (
        <DeleteClubMemModal
          closeModal={() => {
            closeModal();
          }}
          clubId={props.clubId}
          targetMember={targetMember}
          userId={targetId}
          getClubInfo={props.getClubInfo}
          setPage={props.setPage}
        />
      ) : null}
      <ClubMembersContainer
        master={props.clubInfo.clubMaster}
        clubId={props.clubId}
        clubInfo={props.clubInfo}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        openModal={openModal}
        setTargetMember={setTargetMember}
        setTargetId={setTargetId}
        setMandateMember={setMandateMember}
        getClubInfo={props.getClubInfo}
        setPage={props.setPage}
        page={props.page}
      />
    </>
  );
};


export default ClubPageModals;
