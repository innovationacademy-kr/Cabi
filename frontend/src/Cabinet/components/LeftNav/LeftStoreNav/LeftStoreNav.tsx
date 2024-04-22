import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { myClubListState, targetClubInfoState } from "@/Cabinet/recoil/atoms";
import { FloorSectionStyled } from "@/Cabinet/components/LeftNav/LeftSectionNav/LeftSectionNav";
import {
  ClubPaginationResponseDto,
  ClubResponseDto,
} from "@/Cabinet/types/dto/club.dto";
import useMenu from "@/Cabinet/hooks/useMenu";

const LeftStoreNav = ({
  onClickRedirectButton,
}: {
  onClickRedirectButton: (location: string) => void;
}) => {
  // const storeList = ["까비상점", "인벤토리", "아이템 사용내역", "코인 내역"];
  interface StoreItem {
    name: string;
    route: string;
  }
  
  const storeList: StoreItem[] = [
    {name : "까비상점", route : "/store"},
    {name : "인벤토리", route : "/store"},
    {name : "아이템 사용내역", route : "/store"},
    {name : "코인 내역", route : "/store"},
  ];
  const [currentSection, SetCurrentSection] = useState("까비상점");
  const [userCoins, setUserCoins] = useState(420);

  return (
    <>
      <StoreLeftNavOptionStyled>
        <CoinCountStyled>
          코인
          <span>
            <span>{userCoins}</span> 까비
          </span>
        </CoinCountStyled>
        {storeList.map((item: StoreItem, index: number) =>(
          <StoreSectionStyled
          className={
            item.name === currentSection? "leftNavButtonActive cabiButton" : "cabiButton"
          }
          onClick={() => {
            SetCurrentSection(item.name);
            onClickRedirectButton(item.route);
          }
          }
          >{item.name}</StoreSectionStyled>
        ))}
      </StoreLeftNavOptionStyled>
    </>
  );
};

const CoinCountStyled = styled.div`
  display: flex;
  width: 100%;
  padding: 20px;
  align-items: center;
  justify-content: space-between;
  font-weight: 400;
  & span > span {
    font-weight: 800;
  }
`;
`

// const StoreLeftNavOptionStyled = styled.div<{
//   isProfile: boolean;
// }>`;
const StoreLeftNavOptionStyled = styled.div`
  min-width: 240px;
  height: 100%;
  padding: 32px 10px;
  border-right: 1px solid var(--line-color);
  font-weight: 300;
  position: relative;
  & hr {
    width: 80%;
    height: 1px;
    background-color: #d9d9d9;
    border: 0;
    margin-top: 20px;
    margin-bottom: 20px;
  }
`;
const StoreSectionStyled = styled.div`
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-radius: 10px;
  text-indent: 20px;
  color: var(--gray-color);
  margin: 2px 0;
  cursor: pointer;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--main-color);
      color: var(--white);
    }
  }
`;

export default LeftStoreNav;
