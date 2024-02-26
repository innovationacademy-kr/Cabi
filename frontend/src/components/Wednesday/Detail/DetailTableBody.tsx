import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  IItem,
  TAdminModalState,
  itemType,
} from "@/components/Wednesday/Detail/DetailTable";
import { ReactComponent as SadCcabiImg } from "@/assets/images/sadCcabi.svg";

const DetailTableBody = ({
  isAdmin,
  openAdminModal,
  item,
  itemStatus,
  id,
}: {
  isAdmin: boolean;
  openAdminModal: (modal: TAdminModalState) => void;
  item: IItem;
  itemStatus: itemType;
  id: number;
}) => {
  const [clickedItem, setClickedItem] = useState<null | IItem>(null);
  const navigator = useNavigate();

  const handleItemClick = (item: IItem) => {
    if (clickedItem?.date === item.date) setClickedItem(null);
    else setClickedItem(item);
  };

  return (
    <>
      <TableTrStyled
        itemStatus={itemStatus}
        id={clickedItem?.date === item.date ? "selected" : ""}
        onClick={() => {
          isAdmin && openAdminModal("statusModal");
          !itemStatus && handleItemClick(item);
        }}
      >
        <td className="leftEnd" id={itemStatus}>
          <span>{item.date}</span>
        </td>
        {itemStatus ? (
          <>
            <td id={itemStatus} className="rightEnd" colSpan={4}>
              <div>
                {itemStatus === itemType.NO_EVENT_PAST ? (
                  <>
                    <span>발표가 없었습니다</span>
                    <SadCcabiStyled>
                      <SadCcabiImg />
                    </SadCcabiStyled>
                  </>
                ) : (
                  <>
                    <NoEventPhraseStyled>
                      <span>
                        다양한 관심사를 함께 나누고 싶으신 분은 지금 바로 발표를
                        신청해보세요
                      </span>
                      <img src="/src/assets/images/happyCcabi.svg" />
                    </NoEventPhraseStyled>
                    <button
                      onClick={() => {
                        navigator("/wed/register");
                      }}
                    >
                      신청하기
                    </button>
                  </>
                )}
              </div>
            </td>
          </>
        ) : (
          <>
            <td>
              <span>{item.title}</span>
            </td>
            <td>
              <span>{item.intraId}</span>
            </td>
            <td>
              <span>{item.category}</span>
            </td>
            <td className="rightEnd">
              <span>{item.time}분</span>
            </td>
          </>
        )}
      </TableTrStyled>
    </>
  );
};

export default DetailTableBody;

const TableTrStyled = styled.tr<{
  itemStatus: itemType;
}>`
  height: 70px;
  width: 100%;
  line-height: 70px;
  text-align: center;
  font-size: 18px;
  background-color: #dce7fd;

  & > td {
    padding: 0 10px;
    /* white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden; */
  }

  & #noEventCurrent {
    background-color: white;
  }

  & #noEventPast {
    background-color: #eeeeee;
  }

  & > td > div {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }

  & button {
    width: 120px;
    height: 36px;
    background-color: #3f69fd;
    font-weight: bold;
    font-size: 1rem;
  }

  & .leftEnd {
    border-radius: 10px 0 0 10px;
  }

  & .rightEnd {
    border-radius: 0 10px 10px 0;
  }

  &:hover {
    cursor: ${(props) => (props.itemStatus ? "" : "pointer")};
    background-color: ${(props) => (props.itemStatus ? "" : "#91B5FA")};
  }
`;

const NoEventPhraseStyled = styled.div`
  display: flex;
  align-items: center;
  width: 600px;

  & > img {
    width: 30px;
    height: 30px;
    margin-left: 10px;
  }

  & > span {
    font-weight: bold;
  }
`;

const SadCcabiStyled = styled.div`
  width: 30px;
  height: 30px;
  display: flex;

  & svg {
    background-color: pink;
  }

  & svg > path {
    fill: var(--black);
  }
`;
