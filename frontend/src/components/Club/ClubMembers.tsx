import React, { MouseEvent, useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { isCurrentSectionRenderState, userState } from "@/recoil/atoms";
import closeIcon from "@/assets/images/close-circle.svg";
import crown from "@/assets/images/crown.svg";
import maru from "@/assets/images/maru.svg";
import shareIcon from "@/assets/images/shareIcon.svg";
import { ClubInfoResponseDto, ClubUserResponseDto } from "@/types/dto/club.dto";
import { TClubModalState } from "./ClubPageModals";

const ClubMembers: React.FC<{
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
  const [sortedMems, setSortedMems] = useState<ClubUserResponseDto[] | null>(
    null
  );
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
    <ClubMembersContainerStyled>
      {/* TitleBar */}
      <TitleBarStyled>
        <p>동아리 멤버</p>
        <div>
          {/* 아이콘 & 동아리 멤버 수 */}
          <img src={shareIcon} />
          <p id="membersLength">{props.clubInfo.clubUserCount}</p>
        </div>
      </TitleBarStyled>
      <div id="memCard">
        <MemSectionStyled>
          {myInfo.name === master.userName ? (
            <AddMemCardStyled onClick={() => props.openModal("addModal")}>
              <p>+</p>
            </AddMemCardStyled>
          ) : null}
          {sortedMems?.map((mem, idx) => {
            return (
              <MemCardStyled
                onContextMenu={(e: MouseEvent<HTMLDivElement>) => {
                  me.userName === props.master &&
                    mandateClubMasterModal(e, `${mem.userName}`);
                }}
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
                        deleteClubMemberModal(e, `${mem.userName}`, mem.userId)
                      }
                    />
                  )}
                </div>
                <div>{mem.userName}</div>
              </MemCardStyled>
            );
          })}
        </MemSectionStyled>
        {moreBtn ? (
          <ButtonContainerStyled>
            <MoreButtonStyled onClick={clickMoreButton}>
              더보기
            </MoreButtonStyled>
          </ButtonContainerStyled>
        ) : null}
      </div>
    </ClubMembersContainerStyled>
  );
};

const ClubMembersContainerStyled = styled.div`
  margin-top: 75px;
  width: 100%;
  /* margin-bottom: 180px; */
`;

const TitleBarStyled = styled.div`
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

const AddMemCardStyled = styled.div`
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

const MemCardStyled = styled.div<{ bgColor: string }>`
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
    width: 1.5rem;
    height: 1.5rem;
  }

  & #top {
    /* background-color: blue; */
    width: 100%;
    display: flex;
    border: 1rem;
  }
`;

const MemSectionStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 159px);
  grid-template-rows: repeat(auto-fill, 184px);
  justify-content: center;
  width: 100%;
`;

const ButtonContainerStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MoreButtonStyled = styled.button`
  width: 200px;
  height: 50px;
  margin: 20px auto;
  border: 1px solid var(--main-color);
  border-radius: 30px;
  text-indent: -20px;
  background-color: var(--white);
  color: var(--main-color);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 55%;
    top: 50%;
    transform: translateY(-40%);
    width: 20px;
    height: 20px;
    background: url(/src/assets/images/selectPurple.svg) no-repeat 100%;
  }
`;

export default ClubMembers;
