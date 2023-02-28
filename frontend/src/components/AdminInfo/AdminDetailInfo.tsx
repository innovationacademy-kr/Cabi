import { selectAdminDetailState } from "@/recoil/atoms";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import Button from "../Common/Button";

function getInfoText(data: any) {
  switch (data.type) {
    case "broken":
      return `${data.floor}F-${data.cabinet_num} ${data.section}`;
    case "banned":
      return `${data.intra_id}`;
    case "overdue":
      return `${data.location.toUpperCase()}`;
    default:
      return `Wrong Data`;
  }
}

const calDate = (end: Date) =>
  Math.ceil(
    (new Date(end).getTime() - new Date().getTime()) / 1000 / 3600 / 24
  );

function getInfoRect(data: any) {
  switch (data.type) {
    case "broken":
      return (
        <PositionStyled type={data.type}>{data.cabinet_num}</PositionStyled>
      );
    case "banned":
      return (
        <PositionStyled type={data.type}>
          {" "}
          -{calDate(data.unbanned_date)}
        </PositionStyled>
      );
    case "overdue":
      return (
        <PositionStyled type={data.type}>+{data.overdueDays}</PositionStyled>
      );
    default:
      return <PositionStyled type={data.type}>NULL</PositionStyled>;
  }
}

function getInfoIcon(data: any) {
  switch (data.type) {
    case "broken":
      return (
        <PosInfoStyled>
          <img src="/src/assets/images/cabinet.svg" />
        </PosInfoStyled>
      );
    case "overdue":
      return (
        <PosInfoStyled>
          <img src="/src/assets/images/privateIcon.svg" />
          <div>{data.intra_id}</div>
        </PosInfoStyled>
      );
    case "banned":
      return (
        <PosInfoStyled>
          <img src="/src/assets/images/privateIcon.svg" />
          <div>{data.intra_id}</div>
        </PosInfoStyled>
      );
    default:
      return <PosInfoStyled>NULL</PosInfoStyled>;
  }
}

const convertDateInfo = (date: Date) =>
  `~ ${date.getFullYear().toString().slice(2)}.${
    date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
  }.${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;

function getDateInfo(data: any) {
  switch (data.type) {
    case "broken":
      return <div></div>;
    case "overdue":
      return (
        <DateDetailInfo>
          <div>{`${data.overdueDays}일 지났습니다.`}</div>
        </DateDetailInfo>
      );
    case "banned":
      return (
        <DateDetailInfo>
          <div>{calDate(data.unbanned_date)}일 남았습니다. </div>
          <div>{convertDateInfo(new Date(data.unbanned_date))}</div>
        </DateDetailInfo>
      );
    default:
      return <div></div>;
  }
}

const AdminDetailInfo = ({ toggle }: { toggle: boolean }) => {
  const info = useRecoilValue(selectAdminDetailState);
  return (
    <DetailInfoStyled toggle={toggle}>
      <TextStyled>{getInfoText(info)}</TextStyled>
      {getInfoRect(info)}
      {getInfoIcon(info)}
      <Button
        text="상태 관리"
        theme="fill"
        onClick={() => console.log("반납")}
      />
      <Button text="취소" theme="line" onClick={() => console.log("취소")} />
      {getDateInfo(info)}
    </DetailInfoStyled>
  );
};

const DateDetailInfo = styled.div`
  font-weight: bold;
  margin-top: 3vh;
  text-align: center;
  & > div:first-child {
    color: red;
    margin-bottom: 2vh;
  }
`;

const PosInfoStyled = styled.div`
  width: 100px;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 3vh;
  & > img {
    width: 25px;
    height: 25px;
    margin-bottom: 20px;
  }
`;

const TextStyled = styled.div`
  font-size: 1rem;
  font-weight: 400;
  line-height: 28px;
  color: var(--gray-color);
  text-align: center;
  white-space: pre-line;
  margin-top: 50px;
`;

const PositionStyled = styled.div<{ type: string }>`
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 10px;
  font-size: 32px;
  color: var(--white);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  margin-bottom: 3vh;
  background: ${({ type }) =>
    type === "broken" ? "var(--broken)" : "var(--expired)"};
`;

const DetailInfoStyled = styled.div<{ toggle: boolean }>`
  min-width: 330px;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  padding: 45px 40px 20px;
  padding-top: 80px;
  border-left: 1px solid var(--line-color);
  background-color: var(--white);
  overflow-y: auto;
  display: ${({ toggle }) => (toggle ? "flex" : "none")};
  z-index: 3;
  flex-direction: column;
  align-items: center;
`;

export default AdminDetailInfo;
