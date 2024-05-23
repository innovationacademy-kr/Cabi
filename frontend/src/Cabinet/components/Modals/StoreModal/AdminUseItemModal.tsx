import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { myCabinetInfoState, userState } from "@/Cabinet/recoil/atoms";
import Dropdown from "@/Cabinet/components/Common/Dropdown";
import { IStoreItem } from "@/Cabinet/types/dto/store.dto";
import { UserDto } from "@/Cabinet/types/dto/user.dto";
import {
  axiosMyInfo,
  axiosMyItems,
  axiosUseItem,
} from "@/Cabinet/api/axios/axios.custom";
import { getReduceDateString } from "@/Cabinet/utils/dateUtils";
import Modal, { IModalContents } from "../Modal";
import ModalPortal from "../ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "../ResponseModal/ResponseModal";

interface PenaltyModalProps {
  onClose: () => void;
}

const AdminUseItemModal: React.FC<PenaltyModalProps> = ({ onClose }) => {
  const [selectedOption, setSelectedOption] = useState<string>("0");
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const penaltyPeriod = [
    { sku: "PENALTY", period: ["3일", "7일", "31일"], str: "페널티" },
    { sku: "EXTENSION", period: ["3일", "15일", "31일"], str: "연장권" },
    { sku: "SWAP", period: "", str: "이사권" },
    { sku: "ALARM", period: "", str: "알람권" },
  ];

  const HandlePenaltyItemUse = async (item: string) => {
    console.log("나중에 axios연결");
  };

  const handleDropdownChange = (option: string) => {
    setSelectedOption(option);
  };

  const modalContents: IModalContents = {
    type: "hasProceedBtn",
    iconType: "CHECK",
    iconScaleEffect: false,
    title: "아이템 지급",
    proceedBtnText: "네, 사용할게요",
    cancelBtnText: "취소",
    closeModal: onClose,
    isLoading: isLoading,
    onClickProceed: async () => {
      HandlePenaltyItemUse(penaltyPeriod[Number(selectedOption)].sku);
    },
    renderAdditionalComponent: () => (
      <>
        <ModalContainerStyled>
          <ModalDropdownNameStyled>아이템</ModalDropdownNameStyled>
          <Dropdown
            options={[
              {
                name: penaltyPeriod[0].str,
                value: "0",
              },
              {
                name: penaltyPeriod[1].str,
                value: "1",
              },
              {
                name: penaltyPeriod[2].str,
                value: "2",
              },
              {
                name: penaltyPeriod[3].str,
                value: "3",
              },
            ]}
            defaultValue={penaltyPeriod[0].str}
            onChangeValue={handleDropdownChange}
          />
        </ModalContainerStyled>

        <ModalContainerStyled>
          <ModalDropdownNameStyled>아이템 타입</ModalDropdownNameStyled>
          {selectedOption === "0" || selectedOption === "1" ? (
            <Dropdown
              options={[
                {
                  name: penaltyPeriod[Number(selectedOption)].period[0],
                  value: "0",
                },
                {
                  name: penaltyPeriod[Number(selectedOption)].period[1],
                  value: "1",
                },
                {
                  name: penaltyPeriod[Number(selectedOption)].period[2],
                  value: "2",
                },
              ]}
              defaultValue={penaltyPeriod[Number(selectedOption)].period[0]}
            />
          ) : (
            <ModalDropdownTypeEmptyStyled>
              타입이 없습니다.
            </ModalDropdownTypeEmptyStyled>
          )}
        </ModalContainerStyled>
      </>
    ),
  };

  return (
    <ModalPortal>
      {!showResponseModal && <Modal modalContents={modalContents} />}
      {showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal
            modalTitle={modalTitle}
            modalContents={modalContent}
            closeModal={onClose}
          />
        ) : (
          <SuccessResponseModal
            modalTitle={modalTitle}
            modalContents={modalContent}
            closeModal={onClose}
          />
        ))}
    </ModalPortal>
  );
};

const ModalDropdownTypeEmptyStyled = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid var(--line-color);
  width: 100%;
  height: 60px;
  border-radius: 10px;
  text-align: start;
  padding-left: 20px;
  font-size: 1.125rem;
  color: var(--sys-main-color);
`;

const ModalContainerStyled = styled.div`
  padding: 10px 20px 0 20px;
`;

const ModalDropdownNameStyled = styled.div`
  display: flex;
  margin: 10px 10px 15px 5px;
  font-size: 18px;
`;

export default AdminUseItemModal;
