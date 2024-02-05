import styled from "styled-components";
import {
  ICurrentClubModalStateInfo,
  TClubModalState,
} from "@/components/ClubMemberInfoArea/ClubMemberInfoArea.container";
import Button from "@/components/Common/Button";
import DeleteClubMemModal from "@/components/Modals/ClubModal/DeleteClubMemModal";
import MandateClubMemModal from "@/components/Modals/ClubModal/MandateClubMemModal";
import {
  cabinetLabelColorMap,
  cabinetStatusColorMap,
} from "@/assets/data/maps";
import { ReactComponent as LogoImg } from "@/assets/images/logo.svg";
import {
  ClubCabinetInfo,
  ClubResponseDto,
  ClubUserResponseDto,
} from "@/types/dto/club.dto";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";

interface ClubMemberInfoAreaProps {
  selectedClubInfo: ClubResponseDto;
  selectedClubMemberInfo: ClubUserResponseDto;
  selectedClubCabinetInfo: ClubCabinetInfo | null;
  closeClubMemberInfoArea: () => void;
  isMaster: boolean;
  clubModal: ICurrentClubModalStateInfo;
  openModal: (modalName: TClubModalState) => void;
  closeModal: (modalName: TClubModalState) => void;
}

const ClubMemberInfoArea = ({
  selectedClubInfo,
  selectedClubMemberInfo,
  selectedClubCabinetInfo,
  closeClubMemberInfoArea,
  isMaster,
  clubModal,
  openModal,
  closeModal,
}: ClubMemberInfoAreaProps) => {
  return (
    <>
      <ClubMemberInfoAreaStyled id="clubMemberInfoArea">
        {selectedClubCabinetInfo === null ? (
          <NotSelectedStyled>
            <CabiLogoStyled>
              <LogoImg />
            </CabiLogoStyled>
            <TextStyled fontSize="1.125rem" fontColor="var(--gray-color)">
              동아리를 <br />
              선택해주세요
            </TextStyled>
          </NotSelectedStyled>
        ) : (
          <>
            <TextStyled fontSize="1rem" fontColor="var(--gray-color)">
              {selectedClubCabinetInfo!.floor !== 0
                ? selectedClubCabinetInfo!.floor +
                  "F - " +
                  selectedClubCabinetInfo!.section
                : "-"}
            </TextStyled>
            <CabinetRectangleStyled cabinetStatus={CabinetStatus.FULL}>
              {selectedClubCabinetInfo!.visibleNum !== 0
                ? selectedClubCabinetInfo!.visibleNum
                : "-"}
            </CabinetRectangleStyled>
            <ClubInfoWrapperStyled>
              <CabinetTypeIconStyled />
              <TextStyled fontSize="1rem" fontColor="black">
                {selectedClubInfo!.clubName}
              </TextStyled>
            </ClubInfoWrapperStyled>
            <CabinetTypeIconStyled />
            <TextStyled fontSize="1rem" fontColor="black">
              {selectedClubMemberInfo!.userName}
            </TextStyled>
            <CabinetInfoButtonsContainerStyled>
              <Button
                onClick={() => openModal("mandateModal")}
                text="동아리장 위임"
                theme="fill"
                disabled={!isMaster}
              />
              <Button
                onClick={() => openModal("deleteModal")}
                text="내보내기"
                theme="line"
                disabled={!isMaster}
              />
              <Button
                onClick={closeClubMemberInfoArea}
                text="닫기"
                theme="grayLine"
              />
            </CabinetInfoButtonsContainerStyled>
            {/* <CabinetLentDateInfoStyled>동아리 사물함</CabinetLentDateInfoStyled> */}
          </>
        )}
      </ClubMemberInfoAreaStyled>
      {clubModal.mandateModal ? (
        <MandateClubMemModal
          closeModal={() => closeModal("mandateModal")}
          clubId={selectedClubInfo.clubId}
          targetMember={selectedClubMemberInfo}
        />
      ) : clubModal.deleteModal ? (
        <DeleteClubMemModal
          closeModal={() => closeModal("deleteModal")}
          clubId={selectedClubInfo.clubId}
          targetMember={selectedClubMemberInfo}
        />
      ) : null}
    </>
  );
};

const NotSelectedStyled = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CabiLogoStyled = styled.div`
  width: 35px;
  height: 35px;
  margin-bottom: 10px;
  svg {
    .logo_svg__currentPath {
      fill: var(--main-color);
    }
  }
`;
const ClubMemberInfoAreaStyled = styled.div`
  position: fixed;
  top: 80px;
  right: 0;
  min-width: 330px;
  width: 330px;
  height: calc(100% - 80px);
  padding: 40px;
  z-index: 9;
  transform: translateX(120%);
  transition: transform 0.3s ease-in-out;
  box-shadow: 0 0 40px 0 var(--bg-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--white);
`;

const TextStyled = styled.p<{ fontSize: string; fontColor: string }>`
  font-size: ${(props) => props.fontSize};
  font-weight: 400;
  line-height: 28px;
  color: ${(props) => props.fontColor};
  text-align: center;
  white-space: pre-line;
`;

const CabinetRectangleStyled = styled.div<{
  cabinetStatus: CabinetStatus;
}>`
  width: 80px;
  height: 80px;
  line-height: 80px;
  border-radius: 10px;
  margin-top: 15px;
  margin-bottom: 3vh;
  background-color: ${({ cabinetStatus }) =>
    cabinetStatusColorMap[cabinetStatus]};
  font-size: 2rem;
  color: ${({ cabinetStatus }) => cabinetLabelColorMap[cabinetStatus]};
  text-align: center;
`;

const ClubInfoWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  /* height: 100%; */
`;

const CabinetTypeIconStyled = styled.div`
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  margin-bottom: 10px;
  background-image: url("/src/assets/images/privateIcon.svg");
  background-size: contain;
  background-repeat: no-repeat;
`;

const CabinetInfoButtonsContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  align-items: center;
  max-height: 320px;
  margin: 3vh 0;
  width: 100%;
`;

const CabinetLentDateInfoStyled = styled.div`
  color: var(--black);
  font-size: 1rem;
  font-weight: 700;
  line-height: 28px;
  white-space: pre-line;
  text-align: center;
`;

export default ClubMemberInfoArea;
