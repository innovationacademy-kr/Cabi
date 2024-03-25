import styled from "styled-components";
import Card from "@/components/Card/Card";
import {
  CardContentStyled,
  CardContentWrapper,
  ContentDetailStyled,
  ContentInfoStyled,
} from "@/components/Card/CardStyles";
import { MyCabinetInfo } from "@/components/Card/LentInfoCard/LentInfoCard.container";
import { ReactComponent as PrivateIcon } from "@/assets/images/privateIcon.svg";
import { ReactComponent as ShareIcon } from "@/assets/images/shareIcon.svg";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import { formatDate } from "@/utils/dateUtils";

const calculateFontSize = (userCount: number): string => {
  const baseSize = 1;
  if (userCount === 0) return `${baseSize}rem`;
  const decrement = 0.13335;
  const minSize = 0.59;
  const calculatedSize = Math.max(
    baseSize - (userCount - 1) * decrement,
    minSize
  );
  return `${calculatedSize}rem`;
};

const LentInfoCard = ({
  cabinetInfo,
  unbannedAt,
}: {
  cabinetInfo: MyCabinetInfo;
  unbannedAt: Date | null | undefined;
}) => {
  return (
    <Card
      title={"대여정보"}
      gridArea={"lentInfo"}
      width={"350px"}
      height={"366px"}
    >
      <>
        <CabinetInfoWrapper>
          <CabinetRectangleStyled
            isLented={cabinetInfo.isLented}
            status={cabinetInfo.status as CabinetStatus}
            banned={!!unbannedAt}
          >
            {cabinetInfo.visibleNum !== 0
              ? cabinetInfo.visibleNum
              : !!unbannedAt
              ? "!"
              : "-"}
          </CabinetRectangleStyled>
          <CabinetInfoDetailStyled>
            <CabinetInfoTextStyled
              fontSize={cabinetInfo.floor !== 0 ? "1rem" : "0.9rem"}
              fontColor="var(--gray-tmp-5)"
            >
              {cabinetInfo.floor !== 0
                ? cabinetInfo.floor + "층 - " + cabinetInfo.section
                : "대여 중이 아닌 사용자"}
            </CabinetInfoTextStyled>

            <CabinetUserListWrapper>
              <CabinetIconStyled title={cabinetInfo.lentType}>
                {cabinetInfo.lentType === CabinetType.PRIVATE && (
                  <PrivateIcon />
                )}
                {cabinetInfo.lentType === CabinetType.SHARE && <ShareIcon />}
              </CabinetIconStyled>
              <CabinetInfoTextStyled
                fontSize={calculateFontSize(cabinetInfo.userCount)}
                fontColor="var(--color-text-normal)"
              >
                {cabinetInfo.userNameList}
              </CabinetInfoTextStyled>
            </CabinetUserListWrapper>
          </CabinetInfoDetailStyled>
        </CabinetInfoWrapper>
        <CardContentWrapper>
          <CardContentStyled>
            <ContentInfoStyled>사용 기간</ContentInfoStyled>
            <ContentDetailStyled>
              {cabinetInfo?.isLented && cabinetInfo.status != "IN_SESSION"
                ? `${cabinetInfo.dateUsed}일`
                : "-"}
            </ContentDetailStyled>
          </CardContentStyled>
          <CardContentStyled>
            <ContentInfoStyled>
              {cabinetInfo?.status === "OVERDUE" ? "연체 기간" : "남은 기간"}
            </ContentInfoStyled>
            <ContentDetailStyled status={cabinetInfo.status as CabinetStatus}>
              {cabinetInfo?.expireDate ? `${cabinetInfo.dateLeft}일` : "-"}
            </ContentDetailStyled>
          </CardContentStyled>
          <CardContentStyled>
            <ContentInfoStyled>
              {!!unbannedAt ? "패널티 종료 일자" : "종료 일자"}
            </ContentInfoStyled>
            <ContentDetailStyled>
              {!!unbannedAt
                ? formatDate(new Date(unbannedAt), ".")
                : cabinetInfo?.expireDate
                ? formatDate(new Date(cabinetInfo?.expireDate), ".")
                : "-"}
            </ContentDetailStyled>
          </CardContentStyled>
        </CardContentWrapper>
        <CardContentWrapper>
          <CardContentStyled>
            <ContentInfoStyled>이전 대여자</ContentInfoStyled>
            <ContentDetailStyled>
              {cabinetInfo?.previousUserName || "-"}
            </ContentDetailStyled>
          </CardContentStyled>
        </CardContentWrapper>
      </>
    </Card>
  );
};

const CabinetInfoWrapper = styled.div`
  display: flex;
  width: 85%;
  margin: 9px 0 9px 0;
  align-items: center;
`;

const CabinetRectangleStyled = styled.div<{
  isLented: boolean;
  status: CabinetStatus;
  banned?: boolean;
}>`
  width: 60px;
  height: 60px;
  line-height: ${(props) => (props.status === "IN_SESSION" ? "56px" : "60px")};
  border: ${(props) =>
    props.status === "IN_SESSION" && "2px solid var(--main-color);"};
  border-radius: 10px;
  margin-right: 20px;
  background-color: ${(props) =>
    props.banned
      ? "var(--expired)"
      : props.isLented
      ? "var(--mine)"
      : "var(--gray-tmp-2)"};
  color: ${(props) =>
    props.banned
      ? "var(--color-background)"
      : props.status === "IN_SESSION"
      ? "var(--main-color)"
      : "var(--black)"};
  /* 내 사물함이면 black */
  font-size: 2rem;
  text-align: center;
`;

const CabinetInfoDetailStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const CabinetInfoTextStyled = styled.div<{
  fontSize: string;
  fontColor: string;
}>`
  font-size: ${(props) => props.fontSize};
  font-weight: 400;
  line-height: 28px;
  color: ${(props) => props.fontColor};
  text-align: center;
  white-space: pre-line;
`;

const CabinetUserListWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CabinetIconStyled = styled.div`
  width: 18px;
  height: 18px;
  margin-right: 10px;

  & > svg {
    width: 18px;
    height: 18px;
  }

  & > svg > path {
    stroke: var(--color-text-normal);
    transform: scale(0.8);
  }
`;

export default LentInfoCard;
