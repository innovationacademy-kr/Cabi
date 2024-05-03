import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { userState } from "@/Cabinet/recoil/atoms";
import { IItemType, IStoreItem } from "@/Cabinet/pages/StoreMainPage";
import Dropdown from "@/Cabinet/components/Common/Dropdown";
import { UserDto } from "@/Cabinet/types/dto/user.dto";
import { axiosUseItem } from "@/Cabinet/api/axios/axios.custom";
import {
  formatDate,
  getExtendedDateString,
  getReduceDateString,
  getRemainingTime,
} from "@/Cabinet/utils/dateUtils";
import Modal, { IModalContents } from "../Modal";
import ModalPortal from "../ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "../ResponseModal/ResponseModal";

interface StorModalProps {
  onClose: () => void;
  //   onPurchase: (item: string) => void;
  //   selectItem: IStoreItem;
}

const StoreBuyPenalty: React.FC<StorModalProps> = ({
  onClose,
  //   onPurchase,
  //   selectItem,
}) => {
  const [selectedOption, setSelectedOption] = useState("0");
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState(false);
  const [errorDetails, setErrorDetails] = useState("");
  const [modalTitle, setModalTitle] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userInfo = useRecoilValue<UserDto>(userState);

  const penaltyPeriod = [
    { sku: "penalty_3", period: "3일", day: 3 },
    { sku: "penalty_15", period: "15일", day: 15 },
    { sku: "penalty_31", period: "31일", day: 31 },
  ];

  console.log("userInfo : ", userInfo.unbannedAt);
  console.log("calExpiredTime", getRemainingTime(userInfo.unbannedAt));

  const tryPenaltyItemUse = async (item: string) => {
    const remainPenaltyPeriod = getRemainingTime(userInfo.unbannedAt);

    if (userInfo.unbannedAt == undefined) {
      console.log("패널티 사용자 아님");
      setHasErrorOnResponse(true);
      setModalTitle("패널티 축소권이 없습니다");
      setModalContent("패널티 축소권은 까비상점에서 구매하실 수 있습니다.");
    } else {
      try {
        // await axiosUseItem(item);
        setIsLoading(true);
        setModalTitle("패널티 축소권 사용 완료");
        console.log("item : ", item);
        // 패널티 기간이 남은 경우
        // 패널티권을 이용해 패널티기간이 사라진 경우
        if (userInfo && remainPenaltyPeriod < 0) {
          setModalContent("남은 패널티 기간이 없습니다");
        } else {
          setModalContent(
            `해제 날짜 : <strong> ${getReduceDateString(
              userInfo.unbannedAt,
              penaltyPeriod[Number(selectedOption)].day
            )} 23:59 </strong> `
          );
          setShowSuccessModal(true);
        }
        // 구매 처리 후 모달 닫기
        setIsModalOpen(false);
      } catch (e) {
        // axios 실패시 예외처리
        console.log(e);
      } finally {
        setIsLoading(false);
        setShowResponseModal(true);
      }
    }
  };
  const handleDropdownChange = (option: string) => {
    setSelectedOption(option);
  };

  const modalContents: IModalContents = {
    type: "hasProceedBtn",
    iconType: "CHECK",
    iconScaleEffect: false,
    title: "패널티 축소권 사용 안내",
    // detail: "현재 남아있는 패널티 일수는 7일입니다.",
    proceedBtnText: "네, 사용할게요",
    cancelBtnText: "취소",
    closeModal: onClose,
    isLoading: isLoading,
    onClickProceed: async () => {
      tryPenaltyItemUse(penaltyPeriod[Number(selectedOption)].sku);
    },
    renderAdditionalComponent: () => (
      <>
        <ModalContainerStyled>
          <ModalDropdownNameStyled>패널티권 타입</ModalDropdownNameStyled>
          <Dropdown
            options={[
              {
                name: penaltyPeriod[0].period,
                value: "0",
              },
              {
                name: penaltyPeriod[1].period,
                value: "1",
              },
              {
                name: penaltyPeriod[2].period,
                value: "2",
              },
            ]}
            defaultValue={penaltyPeriod[0].period}
            onChangeValue={handleDropdownChange}
          />
        </ModalContainerStyled>

        <ModalDetailStyled>
          <p>
            현재 남아있는 패널티 일수는 7일 입니다. 선택한 패널티 축소권에
            해당하는 일수만큼 패널티가 감소합니다. 패널티 축소권 사용은 취소할
            수 없습니다.
          </p>
        </ModalDetailStyled>
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
  > p {
    margin: 10px;
    > span {
      font-weight: 600;
    }
  }
`;
export default StoreBuyPenalty;
