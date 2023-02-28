import { axiosCabinetByLocationFloor } from "@/api/axios/axios.custom";
import { selectAdminDetailState } from "@/recoil/atoms";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import Button from "../Common/Button";

const AdminDetailInfo = ({ toggle }: { toggle: boolean }) => {
  const info = useRecoilValue(selectAdminDetailState);
  console.log(info);
  useEffect(() => {
    async function getData() {}
  }, []);
  return (
    <DetailInfoStyled toggle={toggle}>
      <TextStyled>몇층 몇번 자리</TextStyled>
      <PositionStyled>150</PositionStyled>
      <PosInfoStyled>
        <img src="/src/assets/images/cabinet.svg" />
      </PosInfoStyled>
      <Button
        text="상태 관리"
        theme="fill"
        onClick={() => console.log("반납")}
      />
      <Button text="취소" theme="line" onClick={() => console.log("취소")} />
    </DetailInfoStyled>
  );
};

const PosInfoStyled = styled.div`
  width: 100px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3vh;
  & > img {
    width: 25px;
    height: 25px;
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

const PositionStyled = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  background: red;
  border-radius: 10px;
  font-size: 32px;
  color: var(--white);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  margin-bottom: 3vh;
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
