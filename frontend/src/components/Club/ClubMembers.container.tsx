import React, { MouseEvent, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  isCurrentSectionRenderState,
  targetClubCabinetInfoState,
  targetClubUserInfoState,
  userState,
} from "@/recoil/atoms";
import { ClubInfoResponseDto, ClubUserResponseDto } from "@/types/dto/club.dto";
import useMenu from "@/hooks/useMenu";
import ClubMembers from "./ClubMembers";
import { TClubModalState } from "./ClubPageModals";

const ClubMembersContainer: React.FC<{
  master: String;
  clubId: number;
  clubInfo: ClubInfoResponseDto;
  openModal: (modalName: TClubModalState) => void;
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
      clubUserCount={props.clubInfo.clubUserCount}
      imMaster={myInfo.name === props.master}
      openModal={props.openModal}
      master={props.master}
      moreBtn={moreBtn}
      clickMoreButton={clickMoreButton}
      members={members}
      myInfo={myInfo}
      selectClubMemberOnClick={selectClubMemberOnClick}
    />
  );
};

export default ClubMembersContainer;
