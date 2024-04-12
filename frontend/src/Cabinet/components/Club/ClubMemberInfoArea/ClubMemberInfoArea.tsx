import styled from "styled-components";
import {
  ICurrentClubModalStateInfo,
  TClubModalState,
} from "@/Cabinet/components/Club/ClubMemberInfoArea/ClubMemberInfoArea.container";
import Button from "@/Cabinet/components/Common/Button";
import DeleteClubMemberModal from "@/Cabinet/components/Modals/ClubModal/DeleteClubMemberModal";
import MandateClubMemberModal from "@/Cabinet/components/Modals/ClubModal/MandateClubMemberModal";
import {
  cabinetIconSrcMap,
  cabinetLabelColorMap,
  cabinetStatusColorMap,
} from "@/Cabinet/assets/data/maps";
import { ReactComponent as LogoImg } from "@/Cabinet/assets/images/logo.svg";
import {
  ClubCabinetInfo,
  ClubResponseDto,
  ClubUserResponseDto,
} from "@/Cabinet/types/dto/club.dto";
import CabinetStatus from "@/Cabinet/types/enum/cabinet.status.enum";
import CabinetType from "@/Cabinet/types/enum/cabinet.type.enum";

interface ClubMemberInfoAreaProps {
  selectedClubInfo: ClubResponseDto;
  selectedClubMemberInfo: ClubUserResponseDto;
  selectedClubCabinetInfo: ClubCabinetInfo | null;
  closeClubMemberInfoArea: () => void;
  isMaster: boolean;
  isMine: boolean;
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
  isMine,
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
            <ClubInfoWrapperStyled>
              {/* <CabinetTypeIconStyled cabinetType={CabinetType.CLUB} /> */}
              <TextStyled fontSize="1rem" fontColor="black" fontWeight={700}>
                {selectedClubInfo!.clubName}
              </TextStyled>
            </ClubInfoWrapperStyled>
            {selectedClubMemberInfo!.userName ===
            selectedClubInfo.clubMaster ? (
              <ClubMasterIconStyled />
            ) : (
              <CabinetTypeIconStyled cabinetType={CabinetType.PRIVATE} />
            )}
            <TextStyled fontSize="1rem" fontColor="black">
              {selectedClubMemberInfo!.userName || "-"}
            </TextStyled>
            <CabinetInfoButtonsContainerStyled>
              <Button
                onClick={() => openModal("mandateModal")}
                text="동아리장 위임"
                theme="fill"
                disabled={!isMaster || isMine}
              />
              <Button
                onClick={() => openModal("deleteModal")}
                text="내보내기"
                theme="line"
                disabled={!isMaster || isMine}
              />
              <Button
                onClick={closeClubMemberInfoArea}
                text="닫기"
                theme="grayLine"
              />
            </CabinetInfoButtonsContainerStyled>
          </>
        )}
      </ClubMemberInfoAreaStyled>
      {clubModal.mandateModal ? (
        <MandateClubMemberModal
          closeModal={() => closeModal("mandateModal")}
          clubId={selectedClubInfo.clubId}
          targetMember={selectedClubMemberInfo}
        />
      ) : clubModal.deleteModal ? (
        <DeleteClubMemberModal
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
  top: 120px;
  right: 0;
  min-width: 330px;
  width: 330px;
  height: calc(100% - 120px);
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

const TextStyled = styled.p<{
  fontSize: string;
  fontColor: string;
  fontWeight?: number;
}>`
  font-size: ${(props) => props.fontSize};
  font-weight: ${(props) => props.fontWeight || 400};
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
  margin: 1rem 0;
  /* height: 100%; */
`;

const ClubMasterIconStyled = styled.div`
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  margin-bottom: 10px;
  background-image: url("/src/Cabinet/assets/images/leader.svg");
  background-size: contain;
  background-repeat: no-repeat;
`;

const CabinetTypeIconStyled = styled.div<{ cabinetType: CabinetType }>`
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  margin-bottom: 10px;
  background-image: url(${(props) => cabinetIconSrcMap[props.cabinetType]});
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

export default ClubMemberInfoArea;
