import React, { MouseEvent, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { userState } from "@/recoil/atoms";
import closeIcon from "@/assets/images/close-circle.svg";
import crown from "@/assets/images/crown.svg";
import maru from "@/assets/images/maru.svg";
import shareIcon from "@/assets/images/shareIcon.svg";
import { ClubInfoResponseDto, ClubUserResponseDto } from "@/types/dto/club.dto";
import AddClubMemModalContainer from "../Modals/ClubModal/AddClubMemModal.container";
import DeleteClubMemModal from "../Modals/ClubModal/DeleteClubMemModal";
import MandateClubMemModal from "../Modals/ClubModal/MandateClubMemModal";

const ClubMembers: React.FC<{
  master: string;
  clubId: number;
  clubInfo: ClubInfoResponseDto;
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
  const [sortedMems, setSortedMems] = useState<ClubUserResponseDto[] | null>(
    null
  );
  const [tmp, setTmp] = useState<ClubUserResponseDto[]>([]);
  // memsbers 중 나랑 동아리장 뺀 배열
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [members, setMembers] = useState<ClubUserResponseDto[]>([
    {
      userId: 0,
      userName: "",
    },
  ]);

  const [mandateMember, setMandateMember] = useState("");

  const [modalName, setModalName] = useState("");

  const getMandateMaster = (mandateMaster: string) => {
    setMandateMember(mandateMaster);
  };

  interface ICurrentModalStateInfo {
    addModal: boolean;
    deleteModal: boolean;
    mandateModal: boolean;
    passwordCheckModal: boolean;
  }

  const [userModal, setUserModal] = useState<ICurrentModalStateInfo>({
    addModal: false,
    deleteModal: false,
    mandateModal: false,
    passwordCheckModal: false,
  });

  const [targetMember, setTargetMember] = useState("");

  type TModalState =
    | "addModal"
    | "deleteModal"
    | "mandateModal"
    | "passwordCheckModal";

  // 나중에 container로 분리할때 다시 고려
  const mandateClubMasterModal = (
    e: MouseEvent<HTMLDivElement>,
    mandateMaster: string
  ) => {
    e.preventDefault();
    if (mandateMaster !== props.master) {
      setMandateMember(mandateMaster);
      openModal("mandateModal");
    }
  };

  const deleteClubMemberModal = (
    e: MouseEvent<HTMLDivElement>,
    targetMember: string
  ) => {
    setTargetMember(targetMember);
    openModal("deleteModal");
  };

  const openModal = (modalName: TModalState) => {
    if (modalName === "addModal") {
      setModalName("addModal");
    } else if (modalName === "deleteModal") {
      setModalName("deleteModal");
    } else if (modalName === "mandateModal") {
      setModalName("mandateModal");
    } else if (modalName === "passwordCheckModal") {
      setModalName("passwordCheckModal");
    }
    setIsModalOpen(true);
    setUserModal({
      ...userModal,
      [modalName]: true,
    });
  };

  const closeModal = () => {
    setUserModal({
      ...userModal,
      addModal: false,
      deleteModal: false,
      mandateModal: false,
      passwordCheckModal: false,
    });
    setIsModalOpen(false);
  };
  // TODO : modal 관련 상위에 있으면 재사용하기

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

  useEffect(() => {
    SortMemAry();
  }, [members, master.userName]);
  // 나 -> 동아리장 -> 맨 위 배열 함침

  useEffect(() => {
    const masterAry = [master];
    const meAry = [me];
    const concatteAry =
      master.userName === me.userName ? meAry : meAry.concat(masterAry);
    setSortedMems([...concatteAry, ...tmp]);
  }, [tmp, master]);

  return (
    <Container>
      {/* TitleBar */}
      <TitleBar>
        <p>동아리 멤버</p>
        <div>
          {/* 아이콘 & 동아리 멤버 수 */}
          <img src={shareIcon} />
          <p id="membersLength">{members.length}</p>
        </div>
      </TitleBar>
      <div id="memCard">
        <MemSection>
          {myInfo.name === master.userName ? (
            <AddMemCard onClick={() => openModal("addModal")}>
              <p>+</p>
            </AddMemCard>
          ) : null}
          {sortedMems?.map((mem, idx) => {
            return (
              <MemCard
                onContextMenu={(e: MouseEvent<HTMLDivElement>) =>
                  me.userName === props.master &&
                  mandateClubMasterModal(e, `${mem.userName}`)
                }
                key={idx}
                bgColor={mem.userName === myInfo.name ? "var(--sub-color)" : ""}
              >
                <div id="top">
                  <img id="profileImg" src={maru}></img>
                  {mem.userName === master.userName ? (
                    <img id="crown" src={crown} />
                  ) : mem.userName === myInfo.name ? null : (
                    <img
                      id="closeIcon"
                      src={closeIcon}
                      onClick={(e: MouseEvent<HTMLDivElement>) =>
                        deleteClubMemberModal(e, `${mem.userName}`)
                      }
                    />
                  )}
                </div>
                <div>{mem.userName}</div>
              </MemCard>
            );
          })}
        </MemSection>
      </div>

      {isModalOpen &&
        (userModal.addModal ? (
          <AddClubMemModalContainer
            closeModal={() => {
              closeModal();
            }}
            clubId={props.clubId}
          />
        ) : userModal.mandateModal ? (
          <MandateClubMemModal
            closeModal={() => {
              closeModal();
            }}
            clubId={props.clubId}
            mandateMember={mandateMember}
          />
        ) : userModal.deleteModal ? (
          <DeleteClubMemModal
            closeModal={() => {
              closeModal();
            }}
            targetMember={targetMember}
          />
        ) : null)}
    </Container>
  );
};

// wrapperstyled로 해야하는지? ㄴㄴ. 맨 앞에 잘 설명하는 키워드 붙이면 됨
// TODO : styled component는 뒤에 styled 붙이기
const Container = styled.div`
  margin-top: 75px;
  width: 100%;
  /* margin-bottom: 180px; */
`;

const TitleBar = styled.div`
  height: 3rem;
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  font-weight: 700;
  padding-left: 7px;

  & img {
    width: 24px;
    height: 24px;
    margin-right: 6px;
  }

  & > div {
    line-height: 24px;
    height: 24px;
    font-size: 1rem;
    font-weight: normal;
    display: flex;
  }

  & #membersLength {
    width: 34px;
  }
`;

const AddMemCard = styled.div`
  width: 145px;
  height: 170px;
  border-radius: 1rem;
  margin: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%23333' stroke-width='1' stroke-dasharray='6' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");

  & > p {
    font-size: 26px;
  }
`;

const MemCard = styled.div<{ bgColor: string }>`
  width: 145px;
  height: 170px;
  background-color: ${(props) => (props.bgColor ? props.bgColor : "#F5F5F5")};
  border-radius: 1rem;
  margin: 7px;
  padding: 20px;

  & #profileImg {
    width: 3rem;
    height: 3rem;
    margin-bottom: 54px;
    margin-right: 42px;
  }

  & #crown {
    width: 1rem;
    height: 1rem;
  }

  & #closeIcon {
    width: 1rem;
    height: 1rem;
  }

  & #top {
    display: flex;
    border: 1rem;
  }
`;

const MemSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 159px);
  grid-template-rows: repeat(auto-fill, 184px);
  justify-content: center;
  width: 100%;
`;

export default ClubMembers;
