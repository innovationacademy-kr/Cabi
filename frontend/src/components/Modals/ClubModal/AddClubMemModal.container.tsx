import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { isCurrentSectionRenderState } from "@/recoil/atoms";
import { axiosAddClubMember } from "@/api/axios/axios.custom";
import ModalPortal from "../ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "../ResponseModal/ResponseModal";
import AddClubMemModal from "./AddClubMemModal";

const AddClubMemModalContainer: React.FC<{
  closeModal: React.MouseEventHandler;
  clubId: number;
  getClubInfo: (clubId: number) => Promise<void>;
}> = (props) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );

  const AddclubMemDetail = `멤버 인트라 아이디`;

  const tryAddClubMemRequest = async (name: string) => {
    setIsLoading(true);
    try {
      await axiosAddClubMember(props.clubId, name);
      setIsCurrentSectionRender(true);
      // 성공하면 200 아니면 에러 코드 반환됨
      setModalTitle("동아리에 멤버가 추가됐습니다");
      props.getClubInfo(props.clubId);
    } catch (error: any) {
      setModalContent(error.response.data.message);
      setHasErrorOnResponse(true);
    } finally {
      setIsLoading(false);
      setShowResponseModal(true);
    }
  };

  return (
    <ModalPortal>
      <AddClubMemModal
        closeModal={props.closeModal}
        onAddMem={tryAddClubMemRequest}
      />
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
