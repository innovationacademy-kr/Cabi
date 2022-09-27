import styled from "@emotion/styled";
import { LentDto } from "../../types/dto/lent.dto";
import { UserDto } from "../../types/dto/user.dto";
import LentTextField from "../atoms/inputs/LentTextField";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 90%;
  background-color: white;
`;

interface LentInfoProps {
  location: string | undefined; // 사물함 건물
  floor: number | undefined; // 사물함 층수
  section?: string | undefined; // 사물함의 섹션 종류 (오아시스 등)
  cabinet_memo: string | undefined; // 사물함 비밀번호와 관련된 메모
  cabinet_id: number | undefined; // 캐비넷 고유 ID
  cabinet_num?: number | undefined; // 사물함에 붙어있는 숫자
  lent_type?: string | undefined; // 사물함의 종류 (개인, 공유, 동아리)
  cabinet_title: string | undefined; // 공유/동아리 사물함인 경우 사물함에 대한 설명
  max_user?: number | undefined; // 해당 사물함을 대여할 수 있는 최대 유저 수
  lent_info: LentDto[] | undefined;
  // lent_info: LentDto | undefined;
}

const LentInfo = (prop: LentInfoProps): JSX.Element => {
  const {
    location,
    floor,
    section,
    cabinet_memo,
    cabinet_id,
    cabinet_num,
    lent_type,
    cabinet_title,
    max_user,
    lent_info,
  } = prop;

  const cabinetInfo = (): JSX.Element => {
    return (
      <>
        <p>
          {location} {floor}F {cabinet_id}
        </p>
        <p>{/* lent_info.expire_time */}</p>
      </>
    );
  };

  // const userInfo = (): JSX.Element[] | null => {
  //   if (lent_info) {
  //     return lent_info.users.map((user: UserDto) => {
  //       return <p key={user.user_id}>{user.intra_id}</p>;
  //     });
  //   }
  //   return null;
  // };

  const userInfo = (): JSX.Element[] | null => {
    if (lent_info) {
      return lent_info.map((user: LentDto) => {
        return <p key={user.user_id}>{user.intra_id}</p>;
      });
    }
    return null;
  };

  return (
    <Content>
      {cabinetInfo()}
      <LentTextField
        contentType="title"
        currentContent="방 제목을 설정해주세요!"
      />
      {userInfo()}
      <LentTextField
        contentType="memo"
        currentContent="아직 사용자가 없습니다!"
      />
    </Content>
  );
};

export default LentInfo;
