import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AGURequestMail from "@/Cabinet/components/AGU/AGURequestMail";
import AGUReturn from "@/Cabinet/components/AGU/AGUReturn";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import { MyCabinetInfoResponseDto } from "@/Cabinet/types/dto/cabinet.dto";
import CabinetStatus from "@/Cabinet/types/enum/cabinet.status.enum";
import CabinetType from "@/Cabinet/types/enum/cabinet.type.enum";
import { getCookie } from "@/Cabinet/api/react_cookie/cookies";

const tmp: MyCabinetInfoResponseDto = {
  building: "새롬관",
  cabinetId: 91,
  floor: 2,
  lentType: CabinetType.PRIVATE,
  lents: [
    {
      expiredAt: new Date("2025-04-12T23:59:59.932478"),
      lentHistoryId: 3,
      name: "jeekim",
      startedAt: new Date("2025-03-12T18:03:19.932478"),
      userId: 2,
    },
  ],
  maxUser: 1,
  memo: "",
  previousUserName: "",
  section: "End of Cluster 1",
  shareCode: -1,
  status: CabinetStatus.FULL,
  statusNote: "",
  title: "",
  visibleNum: 11,
};

const AGUPage = () => {
  // TODO: animation
  const idRef = useRef<HTMLInputElement>(null);
  const [mail, setMail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const returnSubTitle = `현재 대여중인 사물함 정보입니다. <strong>지금 반납 하시겠습니까?</strong>`;
  const aguToken = getCookie("agu_token");

  // TODO : return으로?

  return (
    <WrapperStyled>
      <UtilsSectionStyled></UtilsSectionStyled>
      <HeaderStyled>A.G.U 사물함 반납</HeaderStyled>
      {/* <SubHeaderStyled>{returnSubTitle}</SubHeaderStyled> */}
      {/* {aguToken && myLentInfoState ? ( */}
      {/* {aguToken && mail ? ( */}
      {aguToken ? (
        <AGUReturn
          setIsLoading={setIsLoading}
          setMail={setMail}
          mail={mail}
          aguToken={aguToken}
        />
      ) : (
        <AGURequestMail
          mail={mail}
          idRef={idRef}
          setIsLoading={setIsLoading}
          setMail={setMail}
        />
      )}
      {/* <LoadingAnimation /> */}
      {/* TODO: 이메일 링크 보냈는데 agu인데 사물함 없을때 */}
    </WrapperStyled>
  );
};
/* myLentInfoState
  building:"새롬관"
  cabinetId:91
  floor:2
  lentType:"PRIVATE"
  lents:[{…}] 
  [{
    expiredAt: "2025-04-12T23:59:59.932478"
    lentHistoryId: 3
    name: "jeekim"
    startedAt: "2025-03-12T18:03:19.932478"
    userId: 2}]
  maxUser:1
  memo:""
  previousUserName:null
  section:"End of Cluster 1"
  sessionExpiredAt:null
  shareCode:null
  status:"FULL"
  statusNote:""
  title:""
  visibleNum:11
  */
/*
 2층 - End of Cluster 1, 8번
대여기간 : 2022/12/21 23:59까지
{floor}층 - {section}, {lents[].lentHistoryId}번
대여기간 : {formattedDate}까지
 */

const WrapperStyled = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow-y: scroll;
`;

const UtilsSectionStyled = styled.section`
  width: 70%;
  margin-top: 50px;
`;

const HeaderStyled = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-top: 30px;
`;

const SubHeaderStyled = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: var(--sys-sub-color);
  margin-top: 25px;
  line-height: 1.5;
  word-break: keep-all;
  margin: 25px 10px 0px 10px;
  color: var(--sys-main-color);

  span {
    font-weight: 700;
    text-decoration: underline;
  }
`;

export default AGUPage;
