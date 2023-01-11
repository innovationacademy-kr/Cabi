import {
  axiosCabinetById,
  axiosLentId,
  axiosMyLentInfo,
  axiosReturn,
} from "@/api/axios/axios.custom";
import ModalContainer from "@/containers/ModalContainer";
import { ModalInterface } from "@/containers/ModalContainer";
import {
  currentCabinetIdState,
  isCurrentSectionRenderState,
  myCabinetInfoState,
  targetCabinetInfoState,
  userState,
} from "@/recoil/atoms";
import { MyCabinetInfoResponseDto } from "@/types/dto/cabinet.dto";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

const Modal = (props: {
  modalObj: ModalInterface;
  onClose: React.MouseEventHandler;
}) => {
  const confirmMessage = props.modalObj.confirmMessage;
  const currentCabinetId = useRecoilValue(currentCabinetIdState);
  const [myInfo, setMyInfo] = useRecoilState(userState);
  const setMyLentInfo =
    useSetRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const [targetCabinetInfo, setTargetCabinetInfo] = useRecoilState(
    targetCabinetInfoState
  );
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  let expireDate = new Date();
  const addDays = targetCabinetInfo?.lent_type === "SHARE" ? 41 : 20;
  expireDate.setDate(expireDate.getDate() + addDays);
  const padTo2Digits = (num: number) => {
    return num.toString().padStart(2, "0");
  };
  const formatDate = (date: Date) => {
    return [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join("/");
  };
  const formattedExpireDate = formatDate(expireDate);
  const lentDetail = `
    대여기간은 <strong>${formattedExpireDate} 23:59</strong>까지 입니다.
    대여 후 72시간 이내 취소(반납) 시,
    72시간의 대여 불가 패널티가 적용됩니다.
    “메모 내용”은 공유 인원끼리 공유됩니다.
    귀중품 분실 및 메모 내용의 유출에 책임지지 않습니다.
  `;
  const returnDetail = `
    대여기간은 <strong>${formattedExpireDate} 23:59</strong>까지 입니다.
    지금 반납 하시겠습니까?
  `;
  const onClickLent = async () => {
    try {
      await axiosLentId(currentCabinetId);
      //userCabinetId 세팅
      setMyInfo({ ...myInfo, cabinet_id: currentCabinetId });
      setIsCurrentSectionRender(true);

      // 캐비닛 상세정보 바꾸는 곳
      try {
        const { data } = await axiosCabinetById(currentCabinetId);
        setTargetCabinetInfo(data);
      } catch (error) {
        console.log(error);
      }
      // 내 대여정보 바꾸는 곳
      try {
        const { data: myLentInfo } = await axiosMyLentInfo();
        setMyLentInfo(myLentInfo);
      } catch (error) {
        console.error(error);
      }
    } catch (error: any) {
      if (error.response.status !== 401) {
        alert(error.response.data.message);
      }
      console.log(error);
    }
  };
  const onClickReturn = async () => {
    try {
      await axiosReturn();
      //userCabinetId 세팅
      setMyInfo({ ...myInfo, cabinet_id: -1 });
      setIsCurrentSectionRender(true);
      // 캐비닛 상세정보 바꾸는 곳
      try {
        const { data } = await axiosCabinetById(currentCabinetId);
        setTargetCabinetInfo(data);
      } catch (error) {
        console.log(error);
      }
      //userLentInfo 세팅
      try {
        const { data: myLentInfo } = await axiosMyLentInfo();
        setMyLentInfo(myLentInfo);
      } catch (error) {
        console.error(error);
      }
    } catch (error: any) {
      if (error.response.status !== 401) {
        alert(error.response.data.message);
      }
      console.log(error);
    }
  };
  return (
    <ModalContainer
      modalObj={props.modalObj}
      onClose={props.onClose}
      onClickProceed={
        confirmMessage.includes("대여")
          ? onClickLent
          : confirmMessage.includes("반납")
          ? onClickReturn
          : null
      }
      detail={
        confirmMessage.includes("대여")
          ? lentDetail
          : confirmMessage.includes("반납")
          ? returnDetail
          : null
      }
    />
  );
};

export default Modal;
