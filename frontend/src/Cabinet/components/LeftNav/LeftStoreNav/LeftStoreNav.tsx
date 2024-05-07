import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { userState } from "@/Cabinet/recoil/atoms";
import { ReactComponent as CoinIcon } from "@/Cabinet/assets/images/coinIcon.svg";
import { UserDto } from "@/Cabinet/types/dto/user.dto";

interface IStorePageItem {
  name: string;
  route: string;
}

const storePages: IStorePageItem[] = [
  { name: "까비상점", route: "store" },
  { name: "인벤토리", route: "store/inventory" },
  { name: "아이템 사용내역", route: "store/item-use-log" },
  { name: "코인 내역", route: "store/coin-log" },
];

const LeftStoreNav = ({
  onClickRedirectButton,
}: {
  onClickRedirectButton: (location: string) => void;
}) => {
  const [currentPage, SetCurrentPage] = useState(storePages[0].name);
  const [userInfo] = useRecoilState(userState);
  // const setUser = useSetRecoilState<UserDto>(userState);

  // useEffect(() => {

  // }, []);
  return (
    <>
      <StoreLeftNavOptionStyled>
        <CoinCountStyled>
          코인
          <UserCoinsWrapperStyled>
            <CoinIconStyled>
              <CoinIcon />
            </CoinIconStyled>
            <CoinTextStyled>
              <span>{userInfo.coins}</span> 까비
            </CoinTextStyled>
          </UserCoinsWrapperStyled>
        </CoinCountStyled>
        <hr />
        {storePages.map((item: IStorePageItem) => (
          <StoreSectionStyled
            key={item.name}
            className={
              item.name === currentPage
                ? "leftNavButtonActive cabiButton"
                : "cabiButton"
            }
            onClick={() => {
              SetCurrentPage(item.name);
              onClickRedirectButton(item.route);
            }}
          >
            {item.name}
          </StoreSectionStyled>
        ))}
      </StoreLeftNavOptionStyled>
    </>
  );
};

const StoreLeftNavOptionStyled = styled.div`
  min-width: 240px;
  height: 100%;
  padding: 32px 10px;
  border-right: 1px solid var(--line-color);
  font-weight: 300;
  font-size: var(--size-base);
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

const CoinCountStyled = styled.div`
  display: flex;
  width: 100%;
  padding: 0px 20px 0px 20px;
  align-items: center;
  justify-content: space-between;
  color: var(--gray-color);
`;

const UserCoinsWrapperStyled = styled.div`
  display: flex;
  align-items: center;
`;

const CoinTextStyled = styled.span`
  margin-left: 5px;
  & span {
    font-weight: 800;
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

const CoinIconStyled = styled.div`
  width: 20px;
  height: 20px;

  & > svg > path {
    stroke: var(--main-color);
  }
`;

export default LeftStoreNav;
