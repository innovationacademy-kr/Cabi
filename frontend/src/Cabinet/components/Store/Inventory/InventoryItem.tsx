import { useState } from "react";
import styled from "styled-components";
import { ItemIconMap } from "@/Cabinet/assets/data/maps";
import { ReactComponent as SadCcabiIcon } from "@/Cabinet/assets/images/sadCcabi.svg";
import { ReactComponent as SelectIcon } from "@/Cabinet/assets/images/select.svg";
import { IItem } from "@/Cabinet/types/dto/store.dto";
import { StoreItemType } from "@/Cabinet/types/enum/store.enum";

const InventoryItem = ({
  itemName,
  items,
}: {
  itemName: StoreItemType;
  items: IItem[];
}) => {
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const onClickToggleBtn = () => {
    setIsToggled((prev) => !prev);
  };

  return (
    <>
      <ItemWrapperStyled>
        <ItemTitleStyled isToggled={isToggled} onClick={onClickToggleBtn}>
          <h2>{itemName}</h2>
          <button>
            <SelectIcon />
          </button>
        </ItemTitleStyled>
        <ItemCardSectionStyled isToggled={isToggled}>
          {items.length ? (
            <>
              <ItemCardStyled>
                <ItemIconStyled></ItemIconStyled>
                <CardTextStyled>
                  <span id="title">{itemName}</span>
                  <span id="type">3일</span>
                </CardTextStyled>
              </ItemCardStyled>
              <ItemCardStyled>
                <ItemIconStyled>
                  <ItemIconMap.EXTENSION />
                  {/* <ItemIconMap.SWAP />
                  <ItemIconMap.ALERT />
                  <ItemIconMap.PENALTY /> */}
                  {/* <ItemIconMap.itemName /> */}
                </ItemIconStyled>
                <CardTextStyled>
                  <span id="title">{itemName}</span>
                  <span id="type">3일</span>
                </CardTextStyled>
              </ItemCardStyled>
            </>
          ) : (
            <UnavailableItemMsgStyled isToggled={isToggled}>
              <p>해당 아이템을 보유하고 있지 않습니다</p>
              <UnavailableIconStyled>
                <SadCcabiIcon />
              </UnavailableIconStyled>
            </UnavailableItemMsgStyled>
          )}
          {/* 없을때 */}
        </ItemCardSectionStyled>
      </ItemWrapperStyled>
    </>
  );
};

const ItemCardStyled = styled.div`
  width: 106px;
  height: 106px;
  /* background-color: green; */
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  justify-content: space-between;
  border: 1px solid var(--session);
  margin: 10px;
`;

const ItemIconStyled = styled.div`
  width: 32px;
  height: 32px;

  & > svg > path {
    stroke: var(--main-color);
  }
`;

const CardTextStyled = styled.div`
  background-color: var(--sub-color);
  display: flex;
  flex-direction: column;
  align-items: center;

  & > #title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  & > #type {
    font-size: 12px;
    color: var(--gray-color);
  }
`;

const ItemTitleStyled = styled.div<{ isToggled: boolean }>`
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  color: var(--black);
  padding-left: 5px;
  padding-right: 5px;
  border-bottom: 1.5px solid #d9d9d9;
  margin-bottom: 10px;
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
    stroke: var(--gray-color);
  }
  margin-top: 40px;
`;

const ItemCardSectionStyled = styled.div<{ isToggled: boolean }>`
  display: ${(props) => (props.isToggled ? "none" : "flex")};
  transition: all 0.3s ease-in-out;
  flex-wrap: wrap;
`;

const UnavailableItemMsgStyled = styled.div<{ isToggled: boolean }>`
  display: ${(props) => (props.isToggled ? "none" : "flex")};
  transition: all 0.3s ease-in-out;
  flex-wrap: wrap;
  p {
    color: var(--gray-color);
    line-height: 1.5;
    word-break: keep-all;
  }
`;

const UnavailableIconStyled = styled.div`
  width: 24px;
  height: 24px;
  margin-left: 10px;

  & > svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 412px) {
    display: none;
  }
`;

const ItemWrapperStyled = styled.div`
  width: 70%;
  margin-top: 30px;
`;

export default InventoryItem;
