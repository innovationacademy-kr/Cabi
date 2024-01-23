import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { userState } from "@/recoil/atoms";
import crown from "@/assets/images/crown.svg";
import maru from "@/assets/images/maru.svg";
import shareIcon from "@/assets/images/shareIcon.svg";
import { ClubUserResponseDto } from "@/types/dto/club.dto";
import AddClubMemModal from "./Modals/ClubModal/AddClubMemModal";

// TODO : 동아리 멤버들 아님 전체 api 정보
const ClubMembers: React.FC<{
  members: ClubUserResponseDto[];
  master: string;
}> = (props) => {
  const [myInfo, setMyInfo] = useRecoilState(userState);
  const [me, setMe] = useState<ClubUserResponseDto>({
    userId: 0,
    userName: "",
  });
  const [master, setMaster] = useState<ClubUserResponseDto>({
    userId: 2,
    userName: "jusohn",
  });
  // TODO : ClubPage에서 data 받으면 여기서 지우고 prop으로 가져오기
  const [sortedMems, setSortedMems] = useState<ClubUserResponseDto[] | null>(
    null
  );
  const [tmp, setTmp] = useState<ClubUserResponseDto[]>([]);
  // memsbers 중 나랑 동아리장 뺀 배열
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  // TODO : modal 관련 상위에 있으면 재사용하기

  useEffect(() => {
    let tmpAry = props.members.filter((mem) => {
      if (mem.userName !== myInfo.name && mem.userName !== props.master) {
        return true;
      } else {
        if (mem.userName === myInfo.name)
          // TODO : userName이 intra id인지?
          setMe(mem);
        if (mem.userName === props.master) setMaster(mem);
        return false;
      }
    });
    setTmp(tmpAry);
  }, []);
  // 나 -> 동아리장 -> 맨 위 배열 함침

  useEffect(() => {
    const masterAry = [master];
    const meAry = [me];
    const concatteAry = meAry.concat(masterAry);
    let tmpSet = new Set([...concatteAry, ...tmp]);
    console.log("[...concatteAry, ...tmp] : ", [...concatteAry, ...tmp]);
    console.log("tmpSet : ", tmpSet);
    setSortedMems([...tmpSet]);
  }, [tmp]);

  // 동아리장
  // 내가 동아리 장일때
  // subcolor bg color && 왕관
  // 아닐때
  // 나, 동아리장, 맨 위 배열 함침
  // 2차원 배열 - 맨 앞엔 추가 버튼

  const AddMem = () => {
    openModal();
  };

  return (
    <Container>
      {/* TitleBar */}
      <TitleBar>
        <p>동아리 멤버</p>
        <div>
          <img src={shareIcon} />
          <p>{props.members.length}</p>
        </div>
        {/* 아이콘 & 동아리 멤버 수 */}
      </TitleBar>
      <div id="memCard">
        <MemSection>
          {myInfo.name === props.master ? (
            <AddMemCard onClick={AddMem}>
              <p>+</p>
            </AddMemCard>
          ) : null}
          {sortedMems?.map((mem) => {
            return (
              <>
                <MemCard
                  bgColor={
                    mem.userName === myInfo.name ? "var(--sub-color)" : ""
                  }
                  // TODO : key 추가
                >
                  <div id="top">
                    <img id="profileImg" src={maru}></img>
                    {mem.userName === props.master ? (
                      <img id="crown" src={crown} />
                    ) : null}
                  </div>
                  <div>{mem.userName}</div>
                </MemCard>
              </>
            );
          })}
        </MemSection>
      </div>
      {isModalOpen && <AddClubMemModal closeModal={() => closeModal()} />}
    </Container>
  );
};

// TODO : wrapperstyled로 해야하는지?

const Container = styled.div`
  margin-top: 75px;
  width: 810px;
  margin-bottom: 180px;
`;

const TitleBar = styled.div`
  height: 3rem;
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 30px;

  & img {
    width: 24px;
    height: 24px;
    margin-right: 5px;
  }

  & > div {
    width: 56px;
    height: 24px;
    font-size: 1rem;
    font-weight: normal;
    display: flex;
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

let MemCard = styled.div<{ bgColor: string }>`
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

  & #top {
    display: flex;
    border: 1rem;
  }
`;

let MemSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 162px);
  grid-template-rows: repeat(auto-fill, 184px);
  justify-content: center;
  width: 100%;
`;

export default ClubMembers;
