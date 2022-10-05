import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { axiosMyLentInfo } from "../../network/axios/axios.custom";
import { MyCabinetInfoResponseDto } from "../../types/dto/cabinet.dto";
import { LentDto } from "../../types/dto/lent.dto";
import LentTextField from "../atoms/inputs/LentTextField";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 90%;
  background-color: white;
`;

const UserInfoDiv = styled.div``;

interface LentInfoProps {
  cabinet_data: MyCabinetInfoResponseDto | null;
}

const LentInfo = (): JSX.Element => {
  const [myLentInfo, setMyLentInfo] = useState<MyCabinetInfoResponseDto | null>(
    null
  );
  useEffect(() => {
    // TODO (seuan)
    // 대여, 반납 후 cabinetId에 대한 state 적용이 완료된 후 사용할 것.
    // if (cabinetId === -1) navigate("/main");
    axiosMyLentInfo()
      .then((response) => {
        setMyLentInfo(response.data);
        console.log(response.data);
      })
      .then(() => console.log(myLentInfo))
      .catch((error) => {
        console.error(error);
        // navigate("/main");
      });
  }, []);

  const cabinetInfo = (): JSX.Element => {
    return (
      <>
        <h2 style={{ marginBottom: "0.4rem" }}>
          {myLentInfo?.location} {myLentInfo?.floor}F {myLentInfo?.cabinet_num}
        </h2>
        <p style={{ marginTop: 0, marginBottom: "2rem" }}>
          ~ {myLentInfo?.lent_info?.[0].expire_time.toString().substring(0, 10)}
        </p>
      </>
    );
  };

  const userInfo = (): JSX.Element[] | null => {
    if (myLentInfo?.lent_info) {
      return myLentInfo.lent_info.map((user: LentDto) => {
        return (
          <p style={{ margin: 0 }} key={user.user_id}>
            📌 {user.intra_id}
          </p>
        );
      });
    }
    return null;
  };

  return (
    <Content>
      {cabinetInfo()}
      <LentTextField
        contentType="title"
        currentContent={myLentInfo?.cabinet_title}
      />
      <LentTextField
        contentType="memo"
        currentContent={myLentInfo?.cabinet_memo}
      />
      {/* TODO: gyuwlee
      개인사물함인 경우 보이지 않게 바꾸기 */}
      함께 사용중인 카뎃들
      <hr />
      {userInfo()}
    </Content>
  );
};

export default LentInfo;
