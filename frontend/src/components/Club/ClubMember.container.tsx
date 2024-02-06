import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  targetClubCabinetInfoState,
  targetClubUserInfoState,
  userState,
} from "@/recoil/atoms";
import ClubMember from "@/components/Club/ClubMember";
import { ClubInfoResponseDto, ClubUserResponseDto } from "@/types/dto/club.dto";
import useMenu from "@/hooks/useMenu";

export type TClubMemberModalState = "addModal";

export interface ICurrentClubMemberModalStateInfo {
  addModal: boolean;
}
const ClubMemberContainer: React.FC<{
  clubInfo: ClubInfoResponseDto;
  getClubInfo: (clubId: number, page: number) => void;
  setPage: (page: number) => void;
  page: number;
}> = (props) => {
  const [moreButton, setMoreButton] = useState<boolean>(true);
  const [members, setMembers] = useState<ClubUserResponseDto[]>([]);
  const [clubModal, setClubModal] = useState<ICurrentClubMemberModalStateInfo>({
    addModal: false,
  });
  const { toggleClubMember } = useMenu();
  const myInfo = useRecoilValue(userState);
  const setTargetClubUser = useSetRecoilState(targetClubUserInfoState);
  const setTargetClubCabinet = useSetRecoilState(targetClubCabinetInfoState);

  const clickMoreButton = () => {
    props.setPage(props.page + 1);
  };

  const selectClubMemberOnClick = (member: ClubUserResponseDto) => {
    setTargetClubCabinet({
      building: props.clubInfo.building,
      floor: props.clubInfo.floor,
      section: props.clubInfo.section,
      visibleNum: props.clubInfo.visibleNum,
    });
    setTargetClubUser(member);
    toggleClubMember();
  };

  const openModal = (modalName: TClubMemberModalState) => {
    setClubModal({
      ...clubModal,
      [modalName]: true,
    });
  };

  const closeModal = () => {
    setClubModal({
      ...clubModal,
      addModal: false,
    });
  };

  useEffect(() => {
    if (props.page === 0) {
      setMembers(props.clubInfo.clubUsers);
    } else {
      setMembers((prev) => {
        return [...prev, ...props.clubInfo.clubUsers];
      });
    }
  }, [props.clubInfo]);

  useEffect(() => {
    if (props.clubInfo.clubUserCount) {
      if (members!.length >= props.clubInfo.clubUserCount) {
        setMoreButton(false);
      } else {
        setMoreButton(true);
      }
    }
  }, [members]);

  return (
    <ClubMember
      clubUserCount={props.clubInfo.clubUserCount}
      imMaster={myInfo.name === props.clubInfo.clubMaster.userName}
      clubModal={clubModal}
      openModal={openModal}
      closeModal={closeModal}
      master={props.clubInfo.clubMaster.userName}
      moreButton={moreButton}
      clickMoreButton={clickMoreButton}
      members={members}
      selectClubMemberOnClick={selectClubMemberOnClick}
    />
  );
};

export default ClubMemberContainer;
