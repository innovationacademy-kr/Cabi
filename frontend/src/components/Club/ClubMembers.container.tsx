import React, { MouseEvent, useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
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
  const [myInfo, setMyInfo] = useRecoilState(userState);
  const [me, setMe] = useState<ClubUserResponseDto>({
    userId: 0,
    userName: "",
  });
  const [master, setMaster] = useState<ClubUserResponseDto>({
    userId: 0,
    userName: "",
  });
  const [sortedMems, setSortedMems] = useState<ClubUserResponseDto[]>([
    {
      userId: 0,
      userName: "",
    },
  ]);
  const [tmp, setTmp] = useState<ClubUserResponseDto[]>([]);
  // memsbers 중 나랑 동아리장 뺀 배열
  const [members, setMembers] = useState<ClubUserResponseDto[]>([
    {
      userId: 0,
      userName: "",
    },
  ]);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  // TODO : setIsCurrentSectionRender props로 넘겨주기
  const [moreBtn, setMoreBtn] = useState<boolean>(true);
  const [imMaster, setImMaster] = useState<boolean>(false);

  const clickMoreButton = () => {
    props.setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (props.clubId) {
      props.getClubInfo(props.clubId);
      setIsCurrentSectionRender(true);
    }
  }, [props.page]);

  useEffect(() => {
    if (props.clubInfo) setMembers(props.clubInfo.clubUsers);
  }, [props.clubInfo]);

  const SortMemAry = () => {
    if (props.master) {
      let tmpAry = members.filter((mem) => {
        if (mem.userName !== myInfo.name && mem.userName !== props.master) {
          return true;
        } else {
          if (mem.userName === myInfo.name) setMe(mem);
          if (mem.userName === props.master) setMaster(mem);
          return false;
        }
      });
      setTmp(tmpAry);
    }
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
    SortMemAry();
    if (myInfo.name === master.userName) setImMaster(true);
  }, [members, master.userName]);
  // 나 -> 동아리장 -> 맨 위 배열 함침

  useEffect(() => {
    const masterAry = [master];
    const meAry = [me];
    const concatteAry =
      master.userName === me.userName ? meAry : meAry.concat(masterAry);
    setSortedMems([...concatteAry, ...tmp]);
  }, [tmp, master]);

  useEffect(() => {
    if (props.clubInfo.clubUserCount) {
      if (sortedMems!.length >= props.clubInfo.clubUserCount) {
        setMoreBtn(false);
        setIsCurrentSectionRender(true);
      } else setMoreBtn(true);
    }
  }, [props.clubInfo.clubUserCount, sortedMems]);

  // TODO : props. 떼기
  return (
    <ClubMembers
      clubUserCount={props.clubInfo.clubUserCount}
      imMaster={imMaster}
      openModal={props.openModal}
      sortedMems={sortedMems}
      me={me}
      master={master}
      moreBtn={moreBtn}
      clickMoreButton={clickMoreButton}
      mandateClubMasterModal={mandateClubMasterModal}
      deleteClubMemberModal={deleteClubMemberModal}
    />
  );
};

export default ClubMembersContainer;
