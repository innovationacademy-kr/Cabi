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
        <h2>
          {myLentInfo?.location} {myLentInfo?.floor}F {myLentInfo?.cabinet_num}
        </h2>
        <p>{/* lent_info.expire_time */}</p>
      </>
    );
  };

  const userInfo = (): JSX.Element[] | null => {
    if (myLentInfo?.lent_info) {
      return myLentInfo.lent_info.map((user: LentDto) => {
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
        currentContent={myLentInfo?.cabinet_title}
      />
      <LentTextField
        contentType="memo"
        currentContent={myLentInfo?.cabinet_memo}
      />
      {userInfo()}
    </Content>
  );
};

export default LentInfo;
