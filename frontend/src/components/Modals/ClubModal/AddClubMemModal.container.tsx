import { useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  isCurrentSectionRenderState,
  targetClubInfoState,
} from "@/recoil/atoms";
import AddClubMemModal from "@/components/Modals/ClubModal/AddClubMemModal";
import ModalPortal from "@/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/components/Modals/ResponseModal/ResponseModal";
import { axiosAddClubMember } from "@/api/axios/axios.custom";

const AddClubMemModalContainer: React.FC<{
  closeModal: React.MouseEventHandler;
}> = (props) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const newMemo = useRef<HTMLInputElement>(null);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  const { clubId } = useRecoilValue(targetClubInfoState);

  const tryAddClubMemRequest = async (name: string) => {
    setIsLoading(true);
    try {
      await axiosAddClubMember(clubId, name);
      setIsCurrentSectionRender(true);
      setModalTitle(`동아리에 ${name} 님을 추가했습니다`);
    } catch (error: any) {
      setModalContent(error.response.data.message);
      setHasErrorOnResponse(true);
    } finally {
      setIsLoading(false);
      setShowResponseModal(true);
    }
  };

  const handleClickSave = () => {
    tryAddClubMemRequest(newMemo.current!.value);
  };

  return (
    <ModalPortal>
      {!showResponseModal ? (
        <AddClubMemModal
          closeModal={props.closeModal}
          handleClickSave={handleClickSave}
          newMemo={newMemo}
          isLoading={isLoading}
        />
      ) : null}
      {showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal
            modalTitle="동아리 멤버 추가 실패"
            modalContents={modalContent}
            closeModal={props.closeModal}
          />
        ) : (
          <SuccessResponseModal
            modalTitle={modalTitle}
            closeModal={props.closeModal}
          />
        ))}
    </ModalPortal>
  );
};

export default AddClubMemModalContainer;
