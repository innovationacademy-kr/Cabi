import { useRecoilState, useSetRecoilState } from "recoil";
import {
  currentCabinetIdState,
  myCabinetInfoState,
  targetCabinetInfoState,
  userState,
} from "@/recoil/atoms";
import ExtensionCard from "@/components/Card/ExtensionCard/ExtensionCard";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import { LentDto, LentExtensionDto } from "@/types/dto/lent.dto";
import { axiosCabinetById } from "@/api/axios/axios.custom";
import useMenu from "@/hooks/useMenu";

const ExtensionCardContainer = ({
  extensionInfo,
}: {
  extensionInfo: LentExtensionDto | null;
}) => {
  const { toggleCabinet, openCabinet, closeAll } = useMenu();
  const [myInfo, setMyInfo] = useRecoilState(userState);
  const [currentCabinetId, setCurrentCabinetId] = useRecoilState(
    currentCabinetIdState
  );
  const [myCabinetInfo, setMyCabinetInfo] = useRecoilState(myCabinetInfoState);
  const setTargetCabinetInfo = useSetRecoilState<CabinetInfo>(
    targetCabinetInfoState
  );
  async function setTargetCabinetInfoToMyCabinet() {
    setCurrentCabinetId(myInfo.cabinetId);
    setMyInfo((prev) => ({ ...prev, cabinetId: null }));
    try {
      if (!myCabinetInfo?.cabinetId) return;
      const { data } = await axiosCabinetById(myCabinetInfo.cabinetId);
      if (data.lents.length === 0 && myInfo.cabinetId !== null) {
        setMyInfo((prev) => ({ ...prev, cabinetId: null }));
      } else {
        const doesNameExist = data.lents.some(
          (lent: LentDto) => lent.name === myInfo.name
        );
        if (doesNameExist) {
          setTargetCabinetInfo(data);
          setCurrentCabinetId(data.cabinetId);
          setMyInfo((prev) => ({ ...prev, cabinetId: data.cabinetId }));
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  const clickMyCabinet = () => {
    if (!!extensionInfo && !!myInfo.cabinetId) {
      if (myInfo.cabinetId === null && !myCabinetInfo?.cabinetId) {
        setTargetCabinetInfoToMyCabinet();
        toggleCabinet();
      } else if (currentCabinetId !== myInfo.cabinetId) {
        setTargetCabinetInfoToMyCabinet();
        openCabinet();
      } else {
        toggleCabinet();
      }
    }
  };
  return (
    <ExtensionCard
      extensionInfo={extensionInfo}
      button={{
        label: !!extensionInfo ? "보유중" : "미보유",
        onClick: () => clickMyCabinet(),
        isClickable: !!extensionInfo && !!myInfo.cabinetId,
        isExtensible: !!extensionInfo,
      }}
    />
  );
};

export default ExtensionCardContainer;
