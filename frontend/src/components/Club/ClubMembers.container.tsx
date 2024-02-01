import React, { MouseEvent, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { isCurrentSectionRenderState, userState } from "@/recoil/atoms";
import { ClubInfoResponseDto, ClubUserResponseDto } from "@/types/dto/club.dto";
import ClubMembers from "./ClubMembers";
import { TClubModalState } from "./ClubPageModals";

const ClubMembersContainer: React.FC<{
  master: String;
  clubId: number;
  clubInfo: ClubInfoResponseDto;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openModal: (modalName: TClubModalState) => void;
  setTargetMember: React.Dispatch<React.SetStateAction<string>>;
  setTargetId: React.Dispatch<React.SetStateAction<number>>;
  setMandateMember: React.Dispatch<React.SetStateAction<string>>;
  getClubInfo: (clubId: number) => Promise<void>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
}> = (props) => {
  const myInfo = useRecoilValue(userState);
  const [members, setMembers] = useState<ClubUserResponseDto[]>([]);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  // TODO : setIsCurrentSectionRender props로 넘겨주기
  const [moreBtn, setMoreBtn] = useState<boolean>(true);

  const clickMoreButton = () => {
    props.setPage((prev) => prev + 1);
  };

  const deleteClubMemberModal = (
    e: MouseEvent<HTMLDivElement>,
    targetMember: string,
    userId: number
  ) => {
    props.setTargetMember(targetMember);
    props.setTargetId(userId);
    props.openModal("deleteModal");
  };

  const mandateClubMasterModal = (
    e: MouseEvent<HTMLDivElement>,
    mandateMaster: string
  ) => {
    e.preventDefault();
    if (mandateMaster !== props.master) {
      props.setMandateMember(mandateMaster);
      props.openModal("mandateModal");
    }
  };

  useEffect(() => {
    if (props.page === 0) {
      setMembers(props.clubInfo.clubUsers);
    } else {
      setMembers((prev) => {
        return [...prev, ...props.clubInfo.clubUsers];
      });
      setIsCurrentSectionRender(true);
    }
  }, [props.clubInfo]);
  // 나 -> 동아리장 -> 맨 위 배열 함침

  useEffect(() => {
    if (props.clubInfo.clubUserCount) {
      if (members!.length >= props.clubInfo.clubUserCount) {
        setMoreBtn(false);
        setIsCurrentSectionRender(true);
      } else setMoreBtn(true);
    }
  }, [members]);

  useEffect(() => {
    if (props.clubId) {
      props.getClubInfo(props.clubId);

      setIsCurrentSectionRender(true);
    }
  }, [props.page]);

  // TODO : props. 떼기
  return (
    <ClubMembers
      clubUserCount={props.clubInfo.clubUserCount}
      imMaster={myInfo.name === props.master}
      openModal={props.openModal}
      master={props.master}
      moreBtn={moreBtn}
      clickMoreButton={clickMoreButton}
      mandateClubMasterModal={mandateClubMasterModal}
      deleteClubMemberModal={deleteClubMemberModal}
      members={members}
      myInfo={myInfo}
    />
  );
};

export default ClubMembersContainer;
