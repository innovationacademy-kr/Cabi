import { useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  isCurrentSectionRenderState,
  targetClubInfoState,
} from "@/recoil/atoms";
import AddClubMemberModal from "@/components/Modals/ClubModal/AddClubMemberModal";
import ModalPortal from "@/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/components/Modals/ResponseModal/ResponseModal";
import { axiosAddClubMember } from "@/api/axios/axios.custom";

const AddClubMemberModalContainer: React.FC<{
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

  const tryAddClubMemberRequest = async (name: string) => {
    setIsLoading(true);
    try {
      await axiosAddClubMember(clubId, name);
      setModalTitle(`동아리에 ${name}님을 추가했습니다`);
      setTimeout(() => {
        setIsCurrentSectionRender(true);
      }, 1000);
    } catch (error: any) {
      setModalContent(error.response.data.message);
      setHasErrorOnResponse(true);
    } finally {
      setIsLoading(false);
      setShowResponseModal(true);
    }
  };

  const handleClickSave = () => {
    tryAddClubMemberRequest(newMemo.current!.value);
  };

  return (
    <ModalPortal>
      {!showResponseModal ? (
        <AddClubMemberModal
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

export default AddClubMemberModalContainer;
