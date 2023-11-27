import { useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import AdminCabinetListItem from "@/components/CabinetList/CabinetListItem/AdminCabinetListItem";
import CabinetListItem from "@/components/CabinetList/CabinetListItem/CabinetListItem";
import { CabinetPreviewInfo } from "@/types/dto/cabinet.dto";

// 하나의 층에 대한 타이틀과 캐비넷 리스트를 담고 있는 컴포넌트
const FloorContainer = ({
  pendingCabinetsList,
  floorNumber,
}: {
  pendingCabinetsList: CabinetPreviewInfo[];
  floorNumber: string;
}) => {
  const [isToggled, setIsToggled] = useState<boolean>(false);

  const isAdmin = useLocation().pathname.includes("admin");

  const toggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <FloorContainerStyled>
      <FloorTitleStyled isToggled={isToggled}>
        <div>{floorNumber}층</div>
        <button onClick={toggle}></button>
      </FloorTitleStyled>
      {pendingCabinetsList.length !== 0 ? (
        <FlootCabinetsContainerStyled isToggled={isToggled}>
          {pendingCabinetsList.map((cabinet: CabinetPreviewInfo) =>
            isAdmin ? (
              <AdminCabinetListItem key={cabinet.cabinetId} {...cabinet} />
            ) : (
              <CabinetListItem key={cabinet.cabinetId} {...cabinet} />
            )
          )}
        </FlootCabinetsContainerStyled>
      ) : (
        <NoPendingCabinetMessageStyled isToggled={isToggled}>
          <p>해당 층에는 오픈 예정인 사물함이 없습니다 </p>
          <img src="/src/assets/images/sadCcabi.png" alt="noPending" />
        </NoPendingCabinetMessageStyled>
      )}
    </FloorContainerStyled>
  );
};

const FloorContainerStyled = styled.div`
  width: 70%;
  margin-top: 50px;
`;

const FloorTitleStyled = styled.h2<{ isToggled: boolean }>`
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  color: var(--black);
  padding-left: 5px;

  border-bottom: 1.5px solid #d9d9d9;
  div {
  }
  button {
    z-index: 2;
    height: 30px;
    width: 10px;
    background: url(/src/assets/images/select.svg) no-repeat 100%;
    transform: ${(props) =>
      props.isToggled ? "rotate(180deg)" : "rotate(0deg)"};
    margin-right: 5px;
  }
`;

const FlootCabinetsContainerStyled = styled.div<{ isToggled: boolean }>`
  display: ${(props) => (props.isToggled ? "none" : "flex")};
  transition: all 0.3s ease-in-out;
  flex-wrap: wrap;
  margin-top: 20px;
  margin-left: -5px;
  & > div {
    margin-top: 0px;
    margin-right: 0px;
  }
`;

const NoPendingCabinetMessageStyled = styled.div<{ isToggled: boolean }>`
  display: ${(props) => (props.isToggled ? "none" : "flex")};
  align-items: center;
  margin-top: 20px;
  margin-left: 5px;
  p {
    color: var(--gray-color);
    line-height: 1.5;
    word-break: keep-all;
  }
  img {
    width: 30px;
    aspect-ratio: 1 / 1;
    margin-left: 8px;
  }
`;

const LoadingContainerStyled = styled.div`
  margin-top: 30px;
`;

export default FloorContainer;
