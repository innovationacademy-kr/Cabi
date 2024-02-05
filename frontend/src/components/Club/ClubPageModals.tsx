import { useState } from "react";
import ClubMembersContainer from "@/components/Club/ClubMembers.container";
import AddClubMemModalContainer from "@/components/Modals/ClubModal/AddClubMemModal.container";
import { ClubInfoResponseDto } from "@/types/dto/club.dto";

export type TClubModalState = "addModal";

export interface ICurrentClubModalStateInfo {
  addModal: boolean;
}

const ClubPageModals: React.FC<{
  clubInfo: ClubInfoResponseDto;
  clubId: number;
  page: number;
  getClubInfo: (clubId: number) => Promise<void>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}> = (props) => {
  const [clubModal, setClubModal] = useState<ICurrentClubModalStateInfo>({
    addModal: false,
  });

  const closeModal = () => {
    setClubModal({
      ...clubModal,
      addModal: false,
    });
  };

  const openModal = (modalName: TClubModalState) => {
    setClubModal({
      ...clubModal,
      [modalName]: true,
    });
  };

  return (
    // 필요한 param => mandateMember, targetMember, targetId
    <>
      <ClubMembersContainer
        master={props.clubInfo.clubMaster}
        clubId={props.clubId}
        clubInfo={props.clubInfo}
        openModal={openModal}
        getClubInfo={props.getClubInfo}
        setPage={props.setPage}
        page={props.page}
      />
      {clubModal.addModal ? (
        <AddClubMemModalContainer
          closeModal={() => {
            closeModal();
          }}
          clubId={props.clubId}
          getClubInfo={props.getClubInfo}
          setPage={props.setPage}
        />
      ) : null}
    </>
  );
};

export default ClubPageModals;
