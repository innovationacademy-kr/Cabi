import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { isCurrentSectionRenderState } from "@/recoil/atoms";
import { ClubUserResponseDto } from "@/types/dto/club.dto";
import { axiosAddClubMem } from "@/api/axios/axios.custom";
import ModalPortal from "../ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "../ResponseModal/ResponseModal";
import AddClubMemModal from "./AddClubMemModal";

const AddClubMemModalContainer: React.FC<{
  closeModal: React.MouseEventHandler;
  setMembers: React.Dispatch<React.SetStateAction<ClubUserResponseDto[]>>;
  clubId: number;
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
      await axiosAddClubMem(props.clubId, name);
      // 성공하면 200 아니면 에러 코드 반환됨
      setIsCurrentSectionRender(true);
      setModalTitle("동아리에 멤버가 추가됐습니다");
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
