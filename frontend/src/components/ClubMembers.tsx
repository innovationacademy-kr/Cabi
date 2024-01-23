import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { userState } from "@/recoil/atoms";
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
  const [sortedMems, setSortedMems] = useState<ClubUserResponseDto[]>();
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

  useEffect(() => {
    console.log("sortedMems : ", sortedMems);
  }, [sortedMems]);
  // 동아리장
  // 내가 동아리 장일때
  // subcolor bg color && 왕관
  // 아닐때
  // 나, 동아리장, 맨 위 배열 함침
  // 2차원 배열 - 맨 앞엔 추가 버튼

  return (
    <div>
      {/* TitleBar */}
      <div>
        <p>동아리 멤버</p>
        {/* 아이콘 & 동아리 멤버 수 */}
      </div>
      {/* MemCard */}
      <div id="memCard">
        {/* 동아리장 ? <AddMemCard/> : null */}
        <AddMemCard>+</AddMemCard>
        {/* {mems.map((mem) => {
          return <MemCard>{mem.userName}</MemCard>;
          // 나도 아니고 동아리 장도 아니면 ?
          // return
        })} */}
      </div>
      <div></div>
    </div>
  );
};

{
  /* // 추가
// 			<div style={borderline 회색 & 점선 & 굵기}>+</div>
// 			// 나
// 			//
// 			//
// 			<div bg : subcolor>
// 				<div>
// 					<img></img>
// 					 <div>
// 					{/* icon */
}
{
  /* // 					동아리 장? <svg></svg> : null */
}
{
  /* // 					</div> */
}
{
  /* // 				</div> */
}
{
  /* // 				<div> */
}
{
  /* // 					memid */
}
{
  /* // 				</div> */
}
{
  /* // 			</div> */
}
{
  /* // 			// 그 외 */
}
{
  /* // 			return <div></div>; */
}
{
  /* // 		}) */
}
{
  /* pagenation */
}
{
  /* <div></div>  */
}

const AddMemCard = styled.div`
  border: 1px dashed grey;
`;
let MemCard = styled.div`
  border: 1px solid grey;
`;
// {/* /* TODO : px 맞추기 */ */}
export default ClubMembers;
