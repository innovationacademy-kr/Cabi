import React from "react";
import styled from "styled-components";
import ButtonContainer from "./ButtonContainer";
import { LentDto } from "@/types/dto/lent.dto";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import cabiLogo from "@/assets/images/logo.svg";
import privateLogo from "@/assets/images/privateCabinetType.svg";
import shareLogo from "@/assets/images/shareCabinetType.svg";
import circleLogo from "@/assets/images/circleCabinetType.svg";

export interface ISelectedCabinetInfo {
  floor: number;
  section: string;
  cabinetNum: number;
  cabinetColor: string;
  cabinetLogo: string;
  userNameList: string;
  belowText: string;
  belowTextColor: string;
}

/* 
    require props
    1. is cabinet selected
    2. selected cabinet info
        i. state
            a. empty
            b. mine
            c. others
            d. broken
        ii. type
            a. PRIVATE
            b. SHARE
            c. CIRCLE

 component will pass props like below(or null when select nothing)
 const CabinetInfoDummy: ISelectedCabinetInfo = {
    floor: 2,
    section: "Oasis",
    cabinetNum: 42,
    cabinetColor: "var(--available)",
    cabinetLogo: "/src/assets/images/shareCabinetType.svg",
    userNameList: "jaesjeon\ninshin\n-",
    belowText: "16일 남았습니다.\n2022-12-22",
    belowTextColor: "black",
  };
*/

const CabinetInfoArea: React.FC<{
  selectedCabinetInfo: ISelectedCabinetInfo | null;
}> = (props) => {
  /* functional part: to components */

  //* Dummy data *//
  // let myCabinetIdx: number | null = 25;
  // let isCabinetSelected: boolean = true;
  // let selectedCabinetFloor: number = 2;
  // let selectedCabinetInfo: CabinetInfo = {
  //   cabinet_id: 24,
  //   cabinet_num: 42,
  //   lent_type: CabinetType.SHARE,
  //   cabinet_title: null,
  //   max_user: 3,
  //   status: CabinetStatus.AVAILABLE,
  //   section: "Oasis",
  //   lent_info: [
  //     {
  //       user_id: 12345,
  //       intra_id: "jaesjeon",
  //       lent_id: 321,
  //       lent_time: new Date(),
  //       expire_time: new Date(),
  //       is_expired: false,
  //     },
  //     {
  //       user_id: 13579,
  //       intra_id: "inshin",
  //       lent_id: 327,
  //       lent_time: new Date(),
  //       expire_time: new Date(),
  //       is_expired: false,
  //     },
  //   ],
  // };
  //* ----------------------------- *//

  // const getCabinetColorByState = (selectedCabinetInfo: CabinetInfo): string => {
  //   if (
  //     myCabinetIdx !== null &&
  //     selectedCabinetInfo.cabinet_id === myCabinetIdx
  //   )
  //     return "var(--mine)";
  //   if (selectedCabinetInfo.status === CabinetStatus.BROKEN)
  //     return "var(--broken)";
  //   if (selectedCabinetInfo.status === CabinetStatus.BANNED)
  //     return "var(--banned)";
  //   if (selectedCabinetInfo.status === CabinetStatus.EXPIRED)
  //     return "var(--expired)";
  //   if (
  //     selectedCabinetInfo.status === CabinetStatus.AVAILABLE ||
  //     selectedCabinetInfo.status === CabinetStatus.SET_EXPIRE_AVAILABLE
  //   )
  //     return "var(--available)";
  //   if (selectedCabinetInfo.status === CabinetStatus.SET_EXPIRE_FULL)
  //     return "var(--full)";
  //   return "UNDEFINED_COLOR";
  // };

  // const getCabinetLogoByType = (selectedCabinetType: string): string => {
  //   if (selectedCabinetType === CabinetType.PRIVATE) return privateLogo;
  //   if (selectedCabinetType === CabinetType.SHARE) return shareLogo;
  //   if (selectedCabinetType === CabinetType.CIRCLE) return circleLogo;
  //   return "UNDEFINED_LOGO";
  // };

  // const getCabinetUserList = (
  //   selectedCabinetInfo: CabinetInfo
  // ): string => {
  //   let userNameList: string = "";
  //   for (let i = 0; i < selectedCabinetInfo.max_user; i++) {
  //     const userName =
  //       i < selectedCabinetInfo.lent_info.length
  //         ? selectedCabinetInfo.lent_info[i].intra_id
  //         : "-";
  //     userNameList += userName;
  //     if (i !== selectedCabinetInfo.max_user - 1) userNameList += "\n";
  //   }
  //   return userNameList;
  // };

  /* -------------------------------------- */

  const { selectedCabinetInfo } = props;

  if (selectedCabinetInfo === null)
    return (
      <FlexDirectionColumnStyled>
        <CabiLogoStyled src={cabiLogo} />
        <TextStyled fontSize="1.125rem" fontColor="var(--gray-color)">
          사물함을 <br />
          선택해주세요
        </TextStyled>
      </FlexDirectionColumnStyled>
    );

  return (
    <FlexDirectionColumnStyled>
      <TextStyled fontSize="1rem" fontColor="var(--gray-color)">
        {selectedCabinetInfo.floor + "F - " + selectedCabinetInfo.section}
      </TextStyled>
      <CabinetRectangleStyled bgColor={selectedCabinetInfo.cabinetColor}>
        {selectedCabinetInfo.cabinetNum}
      </CabinetRectangleStyled>
      <CabiLogoStyled src={selectedCabinetInfo.cabinetLogo} />
      <TextStyled fontSize="1rem" fontColor="black">
        {selectedCabinetInfo.userNameList}
      </TextStyled>
      <CabinetInfoButtonsContainerStyled>
        <ButtonContainer onClick={() => {}} text="대여" theme="dark" />
        <ButtonContainer onClick={() => {}} text="취소" theme="white" />
      </CabinetInfoButtonsContainerStyled>
      <CabinetLentDateInfoStyled textColor={selectedCabinetInfo.belowTextColor}>
        {selectedCabinetInfo.belowText}
      </CabinetLentDateInfoStyled>
    </FlexDirectionColumnStyled>
  );
};

export default CabinetInfoArea;

const FlexDirectionColumnStyled = styled.div`
  position: absolute;
  right: 0;
  height: 100%;
  width: 330px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--white);
  box-shadow: 0px 0px 15px 1px gray;
`;

const CabiLogoStyled = styled.img`
  width: 35px;
  height: 35px;
  margin-bottom: 10px;
`;

const TextStyled = styled.p<{ fontSize: string; fontColor: string }>`
  font-size: ${(props) => props.fontSize};
  font-weight: 400;
  line-height: 28px;
  color: ${(props) => props.fontColor};
  text-align: center;
  white-space: pre-line;
`;

const CabinetRectangleStyled = styled.div<{ bgColor: string }>`
  width: 80px;
  height: 80px;
  border-radius: 10px;
  margin-top: 15px;
  margin-bottom: 60px;
  background-color: ${(props) => props.bgColor};
  font-size: 32px;
  line-height: 80px;
  color: black;
  text-align: center;
`;

const CabinetInfoButtonsContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 40px;
`;

const CabinetLentDateInfoStyled = styled.div<{ textColor: string }>`
  margin-top: 35px;
  color: ${(props) => props.textColor};
  font-size: 1rem;
  font-weight: 700;
  line-height: 28px;
  white-space: pre-line;
  text-align: center;
`;
