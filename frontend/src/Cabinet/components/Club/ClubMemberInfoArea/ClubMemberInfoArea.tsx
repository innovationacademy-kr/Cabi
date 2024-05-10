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
import { ReactComponent as LeaderIcon } from "@/Cabinet/assets/images/leader.svg";
import { ReactComponent as LogoImg } from "@/Cabinet/assets/images/logo.svg";
import { ReactComponent as UserImg } from "@/Cabinet/assets/images/privateIcon.svg";
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
  isMasterSelected: boolean;
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
  isMasterSelected,
}: ClubMemberInfoAreaProps) => {
  return (
    <>
      <ClubMemberInfoAreaStyled id="clubMemberInfoArea">
        {selectedClubCabinetInfo === null ? (
          <NotSelectedStyled>
            <CabiLogoStyled>
              <LogoImg />
            </CabiLogoStyled>
            <TextStyled
              fontSize="1.125rem"
              fontColor="var(--gray-line-btn-color)"
            >
              동아리를 <br />
              선택해주세요
            </TextStyled>
          </NotSelectedStyled>
        ) : (
          <>
            <ClubInfoWrapperStyled>
              {/* <CabinetTypeIconStyled cabinetType={CabinetType.CLUB} /> */}
              <TextStyled
                fontSize="1rem"
                fontColor="var(--normal-text-color)"
                fontWeight={700}
              >
                {selectedClubInfo!.clubName}
              </TextStyled>
            </ClubInfoWrapperStyled>
            <ClubMemberIconStyled isMasterSelected={isMasterSelected}>
              {isMasterSelected ? <LeaderIcon /> : <UserImg />}
            </ClubMemberIconStyled>
            <TextStyled fontSize="1rem" fontColor="var(--normal-text-color)">
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
      fill: var(--sys-main-color);
    }
  }
`;
const ClubMemberInfoAreaStyled = styled.div`
  position: fixed;
  top: 120px;
  right: 0;
  height: calc(100% - 120px);
  z-index: 9;
  transform: translateX(120%);
  transition: transform 0.3s ease-in-out;
  min-width: 330px;
  width: 330px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--bg-color);
  box-shadow: 0 0 40px 0 var(--left-nav-border-shadow-color);
  border-left: 1px solid var(--line-color);
  &.on {
    transform: translateX(0%);
  }
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

const ClubMemberIconStyled = styled.div<{ isMasterSelected: boolean }>`
  width: 24px;
  height: 24px;

  & > svg {
    width: 24px;
    height: 24px;
  }

  & > svg > path {
    stroke: var(--normal-text-color);
    transform: ${(props) =>
      props.isMasterSelected ? "scale(1.3)" : "scale(1.0)"};
  }
`;

export default ClubMemberInfoArea;
