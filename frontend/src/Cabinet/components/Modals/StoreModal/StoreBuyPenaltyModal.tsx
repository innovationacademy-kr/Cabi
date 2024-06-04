import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { userState } from "@/Cabinet/recoil/atoms";
import Dropdown, { IDropdown } from "@/Cabinet/components/Common/Dropdown";
import { IItemTimeRemaining, IStoreItem } from "@/Cabinet/types/dto/store.dto";
import { UserDto } from "@/Cabinet/types/dto/user.dto";
import { StorePenaltyType } from "@/Cabinet/types/enum/store.enum";
import {
  axiosMyInfo,
  axiosMyItems,
  axiosUseItem,
} from "@/Cabinet/api/axios/axios.custom";
import { formatDate, formatDateTime } from "@/Cabinet/utils/dateUtils";
import Modal, { IModalContents } from "../Modal";
import ModalPortal from "../ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "../ResponseModal/ResponseModal";

interface PenaltyModalProps {
  onClose: () => void;
  remainPenaltyPeriod: IItemTimeRemaining | null;
}

const STATUS_OPTIONS = [
  { name: "3일", value: StorePenaltyType.PENALTY_3, isDisabled: false },
  { name: "7일", value: StorePenaltyType.PENALTY_7, isDisabled: false },
  { name: "31일", value: StorePenaltyType.PENALTY_31, isDisabled: false },
];

const StoreBuyPenalty: React.FC<PenaltyModalProps> = ({
  onClose,
  remainPenaltyPeriod,
}) => {
  const [selectedOption, setSelectedOption] = useState<StorePenaltyType>(
    StorePenaltyType.PENALTY_3
  );
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const setMyInfo = useSetRecoilState<UserDto>(userState);
  const [statusOptions, setStatusOptions] = useState(STATUS_OPTIONS);
  const [isPenaltyItem, setIsPenaltyItem] = useState<boolean>(false);
  const [enabledOptions, setEnabledOptions] = useState(
    STATUS_OPTIONS.find((option) => !option.isDisabled)
  );

  const handleDropdownChange = (option: StorePenaltyType) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    const enabledOption = statusOptions.find((option) => !option.isDisabled);
    setEnabledOptions(enabledOption);
    setSelectedOption(
      enabledOption ? enabledOption.value : StorePenaltyType.PENALTY_3
    );
  }, [statusOptions]);

  const STATUS_DROP_DOWN_PROPS: IDropdown = {
    options: statusOptions,
    defaultValue: enabledOptions ? enabledOptions.name : "",
    onChangeValue: handleDropdownChange,
  };

  const tryGetPenaltyItem = async () => {
    try {
      const { data } = await axiosMyItems();
      const penaltyTypes = data.penaltyItems.map(
        (item: IStoreItem) => item.itemSku
      );
      setStatusOptions((prevOptions) =>
        prevOptions.map((option) => ({
          ...option,
          isDisabled: !penaltyTypes.includes(option.value),
        }))
      );
      if (data.penaltyItems.length == 0) {
        setShowResponseModal(true);
        setHasErrorOnResponse(true);
        setModalTitle("페널티 감면권이 없습니다");
        setModalContent("페널티 감면권은 까비상점에서 구매하실 수 있습니다.");
      } else {
        setIsPenaltyItem(true);
      }
    } catch (error) {
      throw error;
    }
  };

  const tryPenaltyItemUse = async (sku: StorePenaltyType) => {
    try {
      await axiosUseItem(sku, null, null, null, null);
      const { data: myInfo } = await axiosMyInfo();
      setMyInfo(myInfo);
      setModalTitle("페널티 감면권 사용 완료");
      if (myInfo.unbannedAt === null) {
        setModalContent("남은 페널티 기간이 모두 소멸되었습니다");
      } else {
        const unbannedAtDate = new Date(myInfo.unbannedAt);
        setModalContent(
          `해제 날짜 : <strong> ${formatDate(
            unbannedAtDate,
            "."
          )} ${formatDateTime(unbannedAtDate, ":")}</strong> `
        );
      }
    } catch (error) {
      throw error;
    }
  };

  const HandlePenaltyItemUse = async (sku: StorePenaltyType) => {
    setIsLoading(true);
    try {
      await tryPenaltyItemUse(sku);
    } catch (error: any) {
      setModalTitle(error.response);
      setHasErrorOnResponse(true);
    } finally {
      setIsLoading(false);
      setShowResponseModal(true);
    }
  };

  useEffect(() => {
    tryGetPenaltyItem();
  }, []);

  const modalContents: IModalContents = {
    type: "hasProceedBtn",
    iconType: "CHECK",
    iconScaleEffect: false,
    title: "페널티 감면권 사용 안내",
    proceedBtnText: "지급하기",
    cancelBtnText: "취소",
    closeModal: onClose,
    isLoading: isLoading,
    onClickProceed: async () => {
      HandlePenaltyItemUse(selectedOption);
    },
    renderAdditionalComponent: () => (
      <>
        <ModalContainerStyled>
          <ModalDropdownNameStyled>페널티권 타입</ModalDropdownNameStyled>
          <Dropdown {...STATUS_DROP_DOWN_PROPS} />
        </ModalContainerStyled>
        <ModalDetailStyled>
          <ModalDetailContentStyled>
            현재 남아있는 페널티 기간은 <br />
            <strong>
              {remainPenaltyPeriod && remainPenaltyPeriod.days}일{" "}
              {remainPenaltyPeriod && remainPenaltyPeriod.hours}시간{" "}
              {remainPenaltyPeriod && remainPenaltyPeriod.minutes}분{" "}
            </strong>{" "}
            입니다. <br />
            선택한 페널티 감면권에 해당하는 일수만큼 <br />
            페널티가 감소합니다. <br />
            페널티 감면권 사용은 취소할수 없습니다.
          </ModalDetailContentStyled>
        </ModalDetailStyled>
      </>
    ),
  };

  return (
    <ModalPortal>
      {isPenaltyItem && !showResponseModal && (
        <Modal modalContents={modalContents} />
      )}
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

const ModalContainerStyled = styled.div`
  padding: 10px 20px 0 20px;
`;

const ModalDropdownNameStyled = styled.div`
  display: flex;
  margin: 10px 10px 15px 5px;
  font-size: 18px;
`;
const ModalDetailStyled = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 30px;
  & > p {
    margin: 10px;
    & > span {
      font-weight: 600;
    }
  }
`;

const ModalDetailContentStyled = styled.div`
  line-height: 1.5;
  font-size: 0.8rem;
`;

export default StoreBuyPenalty;
