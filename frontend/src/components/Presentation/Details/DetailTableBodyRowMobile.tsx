import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { currentPresentationState } from "@/recoil/atoms";
import { IDate } from "@/components/Presentation/Details/DetailContent.container";
import {
  TAdminModalState,
  itemType,
} from "@/components/Presentation/Details/DetailTable.container";
import { IPresentationScheduleDetailInfo } from "@/types/dto/presentation.dto";
import {
  presentationCategoryKorean,
  presentationPeriodNumber,
} from "./DetailTableBodyRow.container";

const DetailTableBodyRowMobile = ({
  isAdmin,
  openAdminModal,
  item,
  itemStatus,
  itemDate,
  hasNoCurrentEvent,
}: {
  isAdmin: boolean;
  openAdminModal: (modal: TAdminModalState) => void;
  item: IPresentationScheduleDetailInfo;
  itemStatus: itemType;
  itemDate: IDate | null;
  hasNoCurrentEvent: boolean;
}) => {
  const [clickedItem, setClickedItem] =
    useState<null | IPresentationScheduleDetailInfo>(null);
  const navigator = useNavigate();
  const setCurrentPresentation = useSetRecoilState(currentPresentationState);
  const handleItemClick = (item: IPresentationScheduleDetailInfo) => {
    if (isAdmin && !itemStatus) {
      setCurrentPresentation({
        id: item.id,
        dateTime: item.dateTime,
        presentationTime: item.presentationTime,
        presentationStatus: item.presentationStatus,
        presentationLocation: item.presentationLocation,
        detail: item.detail,
      });
      openAdminModal("statusModal");
    } else {
      if (clickedItem?.dateTime === item.dateTime) {
        setClickedItem(null);
      } else {
        setClickedItem(item);
      }
    }
  };

  const colSize = 4;

  return (
    <>
      {clickedItem?.dateTime === item.dateTime ? (
        <TopTableDetailTrStyled
          onClick={() => {
            !itemStatus && handleItemClick(item);
          }}
        >
          <td>
            <div className="leftEnd">
              <div>
                {itemDate?.month}월 {itemDate?.day}일
              </div>
            </div>
          </td>
          <td>
            <div>{item.userName}</div>
          </td>
          <td>
            <div>{presentationCategoryKorean[item.category!]}</div>
          </td>
          <td>
            <div className="rightEnd">
              {presentationPeriodNumber[item.presentationTime!]}분
            </div>
          </td>
        </TopTableDetailTrStyled>
      ) : (
        <>
          <MobileTableDateStyled
            
            onClick={() => {
              !itemStatus && handleItemClick(item);
            }}
          >
            <td colSpan={colSize} >
              <div className ={itemStatus}>
                {itemDate?.month}월 {itemDate?.day}일
              </div>
            </td>
          </MobileTableDateStyled>
        </>
      )}
      <>
        <MobileTableStyled
          id={clickedItem?.dateTime === item.dateTime ? "selected" : ""}
          onClick={() => {
            !itemStatus && handleItemClick(item);
          }}
          open={clickedItem?.dateTime === item.dateTime}
        >
          {itemStatus ? (
            <>
              <td id={itemStatus} colSpan={colSize}>
                <NoEventDivStyled>
                  {!hasNoCurrentEvent ? (
                    <>
                      <div>발표가 없었습니다</div>
                    </>
                  ) : (
                    <>
                      <NoEventPhraseStyled>
                        <div>지금 바로 발표를 신청해보세요</div>
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
                </NoEventDivStyled>
              </td>
            </>
          ) : (
            <>
              <td id={itemStatus} className="end" colSpan={colSize}>
                <div>{item.subject}</div>
              </td>
            </>
          )}
        </MobileTableStyled>
      </>

      {clickedItem?.dateTime === item.dateTime ? (
        <>
          <TableDetailTrStyled
            onClick={() => {
              !itemStatus && handleItemClick(item);
            }}
          >
            <td colSpan={colSize}>
              <div>{item.detail}</div>
            </td>
          </TableDetailTrStyled>
        </>
      ) : null}
    </>
  );
};

export default DetailTableBodyRowMobile;

const MobileTableStyled = styled.tr<{
  open?: boolean;
}>`
  width: 100%;
  height: 55px;
  line-height: 30px;
  text-align: center;
  font-size: 18px;
  background-color: #dce7fd;
  font-weight: bold;
  border-radius: 10px;
  
  & .end {
    padding-top: 10px;
    border-radius: ${(props) => (props.open ? "0 0 0 0" : "0 0 10px 10px")};
  }
  & #noEventCurrent {
    background-color: var(--full);
    border-radius: 0 0 10px 10px;
  }
  
  & #noEventPast {
    background-color: var(--full);
    border-radius: 0 0 10px 10px;
  }
  
  & button {
    max-width: 120px;
    width: 20%;
    height: 32px;
    background-color: #3f69fd;
    font-size: 1rem;
    font-weight: bold;
  }
  
`;

const MobileTableDateStyled = styled.tr`
width: 100%;
  height: 30px;
  line-height: 35px;
  font-size: 18px;

  & td {
    
    .noEventCurrent {
      background-color: var(--full);
    }
    
    .noEventPast {
      background-color: var(--full);
    }
    div {
      padding-left: 10px;
      border-radius: 10px 10px 0 0;
      background-color: #dce7fd;
  }
}
`;



const TableDetailTrStyled = styled.tr`
  background-color: #91b5fa;

  line-height: 30px;
  & > td {
    border-radius: 0 0 10px 10px;
    padding: 0;
  }
  & > td > div {
    background-color: white;
    border-radius: 10px;
    margin: 24px;
    margin-top: 0;
    line-height: 24px;
    padding: 20px 50px;
    font-size: 18px;
  }

`;
const TopTableDetailTrStyled = styled.tr`
  background-color: #91b5fa;
  width: 100%;
  & > td {
    border-radius: 10px 10px 0 0;
    padding: 0;
  }
  & > td > div {
    line-height: 24px;
    font-size: 18px;
    text-align: center;
    padding: 15px 0 0 5px;
    background-color: #91b5fa;
  }
  & .leftEnd {
    border-radius: 10px 0 0px 0px;
  }

  & .rightEnd {
    border-radius: 0px 10px 0px 0px;
  }

`;

const NoEventDivStyled = styled.div`
  height: 50px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const NoEventPhraseStyled = styled.div`
  display: flex;
  justify-content: end;

  & > div {
    font-weight: bold;
    line-height: 30px;
  }
`;
