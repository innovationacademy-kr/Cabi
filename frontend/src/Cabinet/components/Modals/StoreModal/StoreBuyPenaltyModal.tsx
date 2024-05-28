import { useEffect, useState } from "react";
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
import { IInventoryInfo } from "../../Store/Inventory/Inventory";

interface PenaltyModalProps {
  onClose: () => void;
  remainPenaltyPeriod: number;
}

const StoreBuyPenalty: React.FC<PenaltyModalProps> = ({
  onClose,
  remainPenaltyPeriod,
}) => {
  const [selectedOption, setSelectedOption] = useState("0");
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const setMyInfo = useSetRecoilState<UserDto>(userState);
  const [myItems, setMyItems] = useState<IInventoryInfo | null>(null);

  const penaltyPeriod = [
    { sku: "PENALTY_3", period: "3일" },
    { sku: "PENALTY_7", period: "7일" },
    { sku: "PENALTY_31", period: "31일" },
  ];

  const tryGetPenaltyItem = async () => {
    try {
      const { data } = await axiosMyItems();
      setMyItems(data);
      const foundItem = data.penaltyItems.find(
        (item: IStoreItem) =>
          item.itemDetails === penaltyPeriod[Number(selectedOption)].period
      );
      if (foundItem) return true;
      else return false;
    } catch (error) {
      throw error;
    }
  };

  // const getMyItems = async () => {
  //   try {
  //     const response = await axiosMyItems();
  //     setMyItems(response.data);
  //   } catch (error: any) {
  //     console.error("Error getting inventory:", error);
  //   }
  // };


  useEffect(() => {
    tryGetPenaltyItem();
  }, []);

  const findMyExtension = (period: string) => {
    return !myItems?.penaltyItems.some((item) => item.itemDetails === period);
  };

  const tryPenaltyItemUse = async (
    item: string,
    usePenaltyItemDays: number
  ) => {
    try {
      await axiosUseItem(item, null, null, null, null);
      const { data: myInfo } = await axiosMyInfo();
      setMyInfo(myInfo);
      setModalTitle("페널티 감면권 사용 완료");
      if (remainPenaltyPeriod <= usePenaltyItemDays) {
        setModalContent("남은 페널티 기간이 모두 소멸되었습니다");
      } else {
        setModalContent(
          `해제 날짜 : <strong> ${getReduceDateString(
            myInfo.unbannedAt,
            usePenaltyItemDays
          )} 23:59 </strong> `
        );
      }
    } catch (error) {
      throw error;
    }
  };

  const HandlePenaltyItemUse = async (item: string) => {
    setIsLoading(true);
    const usePenaltyItemDays = parseInt(
      penaltyPeriod[Number(selectedOption)].period
    );
    try {
      const hasPenaltyItem = await tryGetPenaltyItem();
      if (hasPenaltyItem === false) {
        setModalTitle("페널티 감면권이 없습니다");
        setModalContent("페널티 감면권은 까비상점에서 구매하실 수 있습니다.");
      } else {
        await tryPenaltyItemUse(item, usePenaltyItemDays);
      }
    } catch (error: any) {
      setModalTitle(error.response.data.message);
      setHasErrorOnResponse(true);
    } finally {
      setIsLoading(false);
      setShowResponseModal(true);
    }
  };

  const handleDropdownChange = (option: string) => {
    // console.log("test",option );
    setSelectedOption(option);
  };
  // const findMyExtension = (period: string) => {
  //   return !myItems?.extensionItems.some((item) => item.itemDetails === period);
  // };
  const modalContents: IModalContents = {
    type: "hasProceedBtn",
    iconType: "CHECK",
    iconScaleEffect: false,
    title: "페널티 감면권 사용 안내",
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
          <ModalDropdownNameStyled>페널티권 타입</ModalDropdownNameStyled>
          <Dropdown
            options={[
              {
                name: penaltyPeriod[0].period,
                value: 0,
                disabled: findMyExtension(penaltyPeriod[0].period),
              },
              {
                name: penaltyPeriod[1].period,
                value: 1,
                disabled: findMyExtension(penaltyPeriod[1].period),
              },
              {
                name: penaltyPeriod[2].period,
                value: 2,
                disabled: findMyExtension(penaltyPeriod[2].period),
              },
            ]}
            defaultValue={findMyExtension(penaltyPeriod[0].period)
              ? findMyExtension(penaltyPeriod[1].period)
                ? penaltyPeriod[0].period
                : penaltyPeriod[1].period
              : penaltyPeriod[2].period}
            onChangeValue={handleDropdownChange}
          />
        </ModalContainerStyled>

        <ModalDetailStyled>
          <ModalDetailContentStyled>
            현재 남아있는 페널티 일수는 <strong>{remainPenaltyPeriod}</strong>{" "}
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
