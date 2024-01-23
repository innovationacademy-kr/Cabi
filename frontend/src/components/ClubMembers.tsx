import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { userState } from "@/recoil/atoms";
import crown from "@/assets/images/crown.svg";
import maru from "@/assets/images/maru.svg";
import shareIcon from "@/assets/images/shareIcon.svg";
import { ClubUserResponseDto } from "@/types/dto/club.dto";

// props : 누른 clubId, 동아리 멤버들, 내 정보(id), clubmaster
// 동아리 멤버들 아님 전체 api 정보
const ClubMembers: React.FC<{
  members: ClubUserResponseDto[];
  master: string;
}> = (props) => {
  const [myInfo, setMyInfo] = useRecoilState(userState);
  // ClubPage에서 data 받으면 여기서 지우고 prop으로 가져오기
  const [me, setMe] = useState<ClubUserResponseDto>({
    userId: 0,
    userName: "",
  });
  const [master, setMaster] = useState<ClubUserResponseDto>({
    userId: 2,
    userName: "jusohn",
  });
  const [sortedMems, setSortedMems] = useState<ClubUserResponseDto[] | null>(
    null
  );
  const [tmp, setTmp] = useState<ClubUserResponseDto[]>();
  // // mems 중 나랑 동아리장 뺀 배열
  useEffect(() => {
    let tmpAry = props.members.filter((mem) => {
      // 나랑 id/intra 같은지
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
  // 동아리 장이 아닐때
  // 나, 동아리장, 맨 위 배열 함침

  useEffect(() => {
    if (tmp) {
      tmp.unshift(master);
      tmp.unshift(me);
      let tmpSet = new Set<ClubUserResponseDto>(tmp);
      setSortedMems([...tmpSet]);
    }
  }, [tmp]);

  // 동아리장
  // 내가 동아리 장일때
  // subcolor bg color && 왕관
  // 아닐때
  // 나, 동아리장, 맨 위 배열 함침
  // 2차원 배열 - 맨 앞엔 추가 버튼

  return (
    <Container>
      {/* TitleBar */}
      <TitleBar>
        <p>동아리 멤버</p>
        <div>
          <img src={shareIcon} />
          <p>333</p>
          {/* <p>{props.members.length}</p> */}
        </div>
        {/* 아이콘 & 동아리 멤버 수 */}
      </TitleBar>
      {/* MemCard */}
      {myInfo.name === props.master ? <AddMemCard>+</AddMemCard> : null}
      <div id="memCard" style={{ backgroundColor: "green" }}>
        {sortedMems?.map((mem) => {
          return (
            <>
              <MemCard
                bgColor={mem.userName === myInfo.name ? "var(--sub-color)" : ""}
              >
                <div>
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
      </div>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 75px;
  background-color: blue;
  width: 810px;
`;

const TitleBar = styled.div`
  background-color: yellow;
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
    background-color: pink;
    width: 56px;
    height: 24px;
    font-size: 1rem;
    font-weight: normal;
    display: flex;
  }
`;

const AddMemCard = styled.div`
  border: 1px dashed grey;
  width: 150px;
  height: 150px;
  border-radius: 1rem;
`;
let MemCard = styled.div<{ bgColor: string }>`
  width: 145px;
  height: 170px;
  background-color: ${(props) => (props.bgColor ? props.bgColor : "#F5F5F5")};
  border-radius: 1rem;

  & #profileImg {
    width: 3rem;
    height: 3rem;
  }

  & #crown {
    width: 1rem;
    height: 1rem;
  }
`;
// TODO : px 맞추기
export default ClubMembers;
