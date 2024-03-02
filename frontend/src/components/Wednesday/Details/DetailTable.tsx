import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { IDate } from "@/pages/Wednesday/DetailPage";
import DetailTableBody from "@/components/Wednesday/Details/DetailTableBody";
import EditStatusModal from "@/components/Wednesday/Modals/EditStatusModal/EditStatusModal";
import { IPresentationScheduleDetailInfo } from "@/types/dto/wednesday.dto";
import {
  PresentationCategoryType,
  PresentationPeriodType,
} from "@/types/enum/Presentation/presentation.type.enum";
import DetailTableBodyMobile from "./DetailTableBodyMobile";

export interface IAdminCurrentModalStateInfo {
  statusModal: boolean;
}

export type TAdminModalState = "statusModal";

export enum itemType {
  EVENT_AVAILABLE = "",
  NO_EVENT_CURRENT = "noEventCurrent",
  NO_EVENT_PAST = "noEventPast",
}

const DetailTable = ({
  presentationDetailInfo,
  makeIDateObj,
}: {
  presentationDetailInfo: IPresentationScheduleDetailInfo[] | null;
  makeIDateObj: (date: Date) => IDate;
}) => {
  const [adminModal, setAdminModal] = useState<IAdminCurrentModalStateInfo>({
    statusModal: false,
  });
  const { pathname } = useLocation();
  const isAdmin = pathname.includes("admin/presentation");
  const tableHeadArray = [
    { date: "날짜" },
    { subject: "제목" },
    { userName: "ID" },
    { category: "카테고리" },
    { presentationTime: "시간" },
  ];
  const [list, setList] = useState<IPresentationScheduleDetailInfo[] | null>(
    null
  );
  const [itemDate, setItemDate] = useState<IDate | null>(null);

  const openAdminModal = (modal: TAdminModalState) => {
    setAdminModal({ ...adminModal, [modal]: true });
  };

  const closeAdminModal = (modal: TAdminModalState) => {
    setAdminModal({ ...adminModal, [modal]: false });
  };

  const mockRes: IPresentationScheduleDetailInfo[] = [
    {
      id: 0,
      subject: null,
      summary: null,
      detail: null,
      userName: null,
      presentationTime: null,
      category: null,
      dateTime: "2024-04-01T07:22:01.233Z",
    },
    {
      id: 0,
      subject: null,
      summary: null,
      detail: null,
      userName: null,
      presentationTime: null,
      category: null,
      dateTime: "2024-02-01T07:22:01.233Z",
    },
    {
      id: 1,
      dateTime: "2024-02-17T07:22:01.233Z",
      summary: "",
      subject: "우하하하",
      userName: "jeekim",
      detail:
        "아니 내가 찍는 사진들 항상 왜 이렇게 나오는 건데? 장비 탓인가 싶어서 최신 스마트폰으로 바꿔 봤지만 크게 달라지지 않은 결과물😒 취미로 시작하고 싶은데 도대체 뭐가 뭔지 모르겠는 사진! 2년 간 사진 강의만 빡시게 해온 jisokang이 엑기스만 쫙쫙 뽑아서 알기 쉽게 알려드립니다! 😉",
      category: PresentationCategoryType.HOBBY,
      presentationTime: PresentationPeriodType.HALF,
    },
    {
      id: 2,
      dateTime: "2024-02-17T07:22:01.233Z",
      summary: "",
      subject: "사진을 위한 넓고 얕은 지식눌렀을때는 제목이",
      userName: "eeeeeeeeee",
      detail:
        "아니 내가 찍는 사진들 항상 왜 이렇게 나오는 건데? 장비 탓인가 싶어서 최신 스마트폰으로 바꿔 봤지만 크게 달라지지 않은 결과물😒 취미로 시작하고 싶은데 도대체 뭐가 뭔지 모르겠는 사진! 2년 간 사진 강의만 빡시게 해온 jisokang이 엑기스만 쫙쫙 뽑아서 알기 쉽게 알려드립니다! 😉",
      category: PresentationCategoryType.HOBBY,
      presentationTime: PresentationPeriodType.HOUR_HALF,
    },
  ];

  useEffect(() => {
    setList(mockRes); //TODO : presentationDetailInfo로 대체
  }, []);

  return (
    <>
      <TableStyled>
        <TableHeadStyled>
          <tr>
            {tableHeadArray.map((head, idx) => {
              let entries = Object.entries(head);
              return (
                <th key={idx} id={entries[0][0]}>
                  {entries[0][1]}
                </th>
              );
            })}
          </tr>
        </TableHeadStyled>
        <tbody>
          <WhiteSpaceTrStyled />
        </tbody>
        <TableBodyStyled>
          {list?.map((item, idx) => {
            let itemStatus = itemType.EVENT_AVAILABLE;

            if (!item.subject) {
              const date = new Date();
              let dateISO = date.toISOString();
              const dateObj = new Date(dateISO);

              const itemDateObj = new Date(item.dateTime);
              if (dateObj > itemDateObj) itemStatus = itemType.NO_EVENT_PAST;
              else itemStatus = itemType.NO_EVENT_CURRENT;
            }

            return (
              <>
                <DetailTableBody
                  isAdmin={isAdmin}
                  openAdminModal={openAdminModal}
                  item={item}
                  itemStatus={itemStatus}
                  itemDate={makeIDateObj(new Date(item.dateTime))}
                  key={idx}
                  hasNoCurrentEvent={itemStatus === itemType.NO_EVENT_CURRENT}
                />
                <DetailTableBodyMobile
                  isAdmin={isAdmin}
                  openAdminModal={openAdminModal}
                  item={item}
                  itemStatus={itemStatus}
                  itemDate={makeIDateObj(new Date(item.dateTime))}
                  key={idx + "mobile"}
                  hasNoCurrentEvent={itemStatus === itemType.NO_EVENT_CURRENT}
                />
                <WhiteSpaceTrStyled key={idx + "whiteSpaceTr"} />
              </>
            );
          })}
        </TableBodyStyled>
      </TableStyled>
      {adminModal.statusModal && (
        <EditStatusModal closeModal={() => closeAdminModal("statusModal")} />
      )}
    </>
  );
};

export default DetailTable;

const TableStyled = styled.table`
  width: 100%;
  table-layout: fixed;
`;

const TableHeadStyled = styled.thead`
  margin-bottom: 10px;
  height: 40px;
  line-height: 40px;
  background-color: #3f69fd;
  color: var(--white);
  width: 100%;

  & > td {
    font-size: 1rem;
    text-align: center;
  }

  & #date {
    width: 13%;
    border-radius: 10px 0 0 10px;
  }

  & #subject {
    width: 56%;
  }

  & #userName {
    width: 14%;
  }

  & #category {
    width: 9%;
  }

  & #presentationTime {
    width: 8%;
    border-radius: 0 10px 10px 0;
  }

  @media screen and (max-width: 1150px) {
    display: none;
  }
`;

const TableBodyStyled = styled.tbody`
  width: 100%;

  & #selected {
    background-color: #91b5fa;
  }
`;

export const WhiteSpaceTrStyled = styled.tr`
  height: 24px;
  width: 100%;
`;
