import { useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import AdminCabinetListItem from "@/Cabinet/components/CabinetList/CabinetListItem/AdminCabinetListItem";
import CabinetListItem from "@/Cabinet/components/CabinetList/CabinetListItem/CabinetListItem";
import UnavailableDataInfo from "@/Cabinet/components/Common/UnavailableDataInfo";
import { ReactComponent as SelectImg } from "@/Cabinet/assets/images/select.svg";
import { CabinetPreviewInfo } from "@/Cabinet/types/dto/cabinet.dto";

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
      <FloorTitleStyled isToggled={isToggled} onClick={toggle}>
        <h2>{floorNumber}층</h2>
        <button>
          <SelectImg />
        </button>
      </FloorTitleStyled>
      {pendingCabinetsList.length !== 0 ? (
        <FloorCabinetsContainerStyled isToggled={isToggled}>
          {pendingCabinetsList.map((cabinet: CabinetPreviewInfo) =>
            isAdmin ? (
              <AdminCabinetListItem key={cabinet.cabinetId} {...cabinet} />
            ) : (
              <CabinetListItem key={cabinet.cabinetId} {...cabinet} />
            )
          )}
        </FloorCabinetsContainerStyled>
      ) : (
        !isToggled && (
          <UnavailableCabinetMsgWrapperStyled>
            <UnavailableDataInfo
              msg="해당 층에는 사용 가능한 사물함이 없습니다"
              fontSize="1rem"
            />
          </UnavailableCabinetMsgWrapperStyled>
        )
      )}
    </FloorContainerStyled>
  );
};

const FloorContainerStyled = styled.div`
  width: 70%;
  margin-top: 30px;
`;

const FloorTitleStyled = styled.div<{ isToggled: boolean }>`
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  color: var(--normal-text-color);
  padding-left: 5px;
  padding-right: 5px;
  border-bottom: 1.5px solid var(--service-man-title-border-btm-color);
  cursor: pointer;

  button {
    all: initial;
    cursor: inherit;
    z-index: 2;
    height: 30px;
    transform: ${(props) =>
      props.isToggled ? "rotate(180deg)" : "rotate(0deg)"};
  }

  & > button > svg > path {
    stroke: var(--gray-line-btn-color);
  }
`;

const FloorCabinetsContainerStyled = styled.div<{ isToggled: boolean }>`
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

const UnavailableCabinetMsgWrapperStyled = styled.div`
  width: 100%;
  display: flex;
  padding-top: 20px;
  padding-left: 5px;
`;

export default FloorContainer;
