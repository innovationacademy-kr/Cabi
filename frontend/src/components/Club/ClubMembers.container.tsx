import React, { MouseEvent, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  isCurrentSectionRenderState,
  targetClubCabinetInfoState,
  targetClubUserInfoState,
  userState,
} from "@/recoil/atoms";
import ClubMembers from "@/components/Club/ClubMembers";
import { ClubInfoResponseDto, ClubUserResponseDto } from "@/types/dto/club.dto";
import useMenu from "@/hooks/useMenu";

export type TClubMemberModalState = "addModal";

export interface ICurrentClubMemberModalStateInfo {
  addModal: boolean;
}
const ClubMembersContainer: React.FC<{
  clubId: number;
  clubInfo: ClubInfoResponseDto;
  getClubInfo: (clubId: number) => Promise<void>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
}> = (props) => {
  const myInfo = useRecoilValue(userState);
  const [members, setMembers] = useState<ClubUserResponseDto[]>([]);
  const { toggleClubMember, openClubMember } = useMenu();
  // const setIsCurrentSectionRender = useSetRecoilState(
  //   isCurrentSectionRenderState
  // );
  // TODO : setIsCurrentSectionRender props로 넘겨주기
  const [moreBtn, setMoreBtn] = useState<boolean>(true);
  const setTargetClubUser = useSetRecoilState(targetClubUserInfoState);
  const setTargetClubCabinet = useSetRecoilState(targetClubCabinetInfoState);
  const [clubModal, setClubModal] = useState<ICurrentClubMemberModalStateInfo>({
    addModal: false,
  });

  const clickMoreButton = () => {
    props.setPage((prev) => prev + 1);
    // props.getClubInfo(props.clubId);
    // setIsCurrentSectionRender(true);
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

  const closeModal = () => {
    setClubModal({
      ...clubModal,
      addModal: false,
    });
  };

  const openModal = (modalName: TClubMemberModalState) => {
    setClubModal({
      ...clubModal,
      [modalName]: true,
    });
  };

  useEffect(() => {
    if (props.page === 0) {
      setMembers(props.clubInfo.clubUsers);
    } else {
      setMembers((prev) => {
        return [...prev, ...props.clubInfo.clubUsers];
      });
      // setIsCurrentSectionRender(true);
    }
  }, [props.clubInfo]);
  // 나 -> 동아리장 -> 맨 위 배열 함침

  useEffect(() => {
    if (props.clubInfo.clubUserCount) {
      if (members!.length >= props.clubInfo.clubUserCount) {
        setMoreBtn(false);
        // setIsCurrentSectionRender(true);
      } else setMoreBtn(true);
    }
  }, [members]);

  // useEffect(() => {
  //   if (props.clubId) {
  //     props.getClubInfo(props.clubId);
  //     setIsCurrentSectionRender(true);
  //   }
  // }, [props.page]);

  // TODO : props. 떼기
  return (
    <ClubMembers
      clubId={props.clubId}
      clubUserCount={props.clubInfo.clubUserCount}
      imMaster={myInfo.name === props.clubInfo.clubMaster}
      clubModal={clubModal}
      openModal={openModal}
      closeModal={closeModal}
      master={props.clubInfo.clubMaster}
      moreBtn={moreBtn}
      clickMoreButton={clickMoreButton}
      members={members}
      myInfo={myInfo}
      selectClubMemberOnClick={selectClubMemberOnClick}
    />
  );
};

export default ClubMembersContainer;
