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
  myLentInfo: MyCabinetInfoResponseDto | null;
}

const LentInfo = (props: LentInfoProps): JSX.Element => {
  const { myLentInfo } = props;

  const cabinetInfo = (): JSX.Element => {
    return (
      <>
        <h2 style={{ marginBottom: "0.4rem" }}>
          {myLentInfo?.location} {myLentInfo?.floor}F {myLentInfo?.cabinet_num}
        </h2>
        {myLentInfo?.lent_info?.[0].expire_time ? (
          <p style={{ marginTop: 0, marginBottom: "1rem" }}>
            ~{" "}
            {myLentInfo?.lent_info?.[0].expire_time.toString().substring(0, 10)}
          </p>
        ) : (
          <p />
        )}
      </>
    );
  };

  const userInfo = (): JSX.Element | null => {
    if (myLentInfo?.lent_info && myLentInfo?.lent_type === "SHARE") {
      return (
        <UserInfoDiv>
          <p style={{ margin: 0 }}>함께 사용중인 카뎃들</p>
          <hr />
          {myLentInfo.lent_info.map((user: LentDto) => {
            return (
              <p style={{ margin: 0 }} key={user.user_id}>
                📌 {user.intra_id}
              </p>
            );
          })}
        </UserInfoDiv>
      );
    }
    return null;
  };

  return (
    <Content>
      {cabinetInfo()}
      <LentTextField
        contentType="title"
        currentContent={myLentInfo?.cabinet_title}
        cabinetType={myLentInfo?.lent_type}
      />
      <LentTextField
        contentType="memo"
        currentContent={myLentInfo?.cabinet_memo}
        cabinetType={myLentInfo?.lent_type}
      />
      {userInfo()}
    </Content>
  );
};

export default LentInfo;
