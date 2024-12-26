import { useState } from "react";
import { useRecoilValue } from "recoil";
import {
  targetClubCabinetInfoState,
  targetClubInfoState,
  targetClubUserInfoState,
  userState,
} from "@/Cabinet/recoil/atoms";
import ClubMemberInfoArea from "@/Cabinet/components/Club/ClubMemberInfoArea/ClubMemberInfoArea";
import useMenu from "@/Cabinet/hooks/useMenu";

export type TClubModalState = "deleteModal" | "mandateModal";

export interface ICurrentClubModalStateInfo {
  deleteModal: boolean;
  mandateModal: boolean;
}

const ClubMemberInfoAreaContainer = () => {
  const myInfo = useRecoilValue(userState);
  const targetClubInfo = useRecoilValue(targetClubInfoState);
  const targetClubUserInfo = useRecoilValue(targetClubUserInfoState);
  const targetClubCabinetInfo = useRecoilValue(targetClubCabinetInfoState);
  const [clubModal, setClubModal] = useState<ICurrentClubModalStateInfo>({
    deleteModal: false,
    mandateModal: false,
  });
  const { closeClubMember } = useMenu();

  const openModal = (modalName: TClubModalState) => {
    setClubModal({
      ...clubModal,
      [modalName]: true,
    });
  };

  const closeModal = () => {
    setClubModal({
      ...clubModal,
      deleteModal: false,
      mandateModal: false,
    });
  };

  return (
    <ClubMemberInfoArea
      selectedClubInfo={targetClubInfo}
      selectedClubMemberInfo={targetClubUserInfo}
      selectedClubCabinetInfo={targetClubCabinetInfo}
      closeClubMemberInfoArea={closeClubMember}
      isMaster={targetClubInfo.clubMaster === myInfo.name}
      isMine={targetClubUserInfo.userName === myInfo.name}
      clubModal={clubModal}
      openModal={openModal}
      closeModal={closeModal}
      isMasterSelected={
        targetClubUserInfo!.userName === targetClubInfo.clubMaster
      }
    />
  );
};

export default ClubMemberInfoAreaContainer;
