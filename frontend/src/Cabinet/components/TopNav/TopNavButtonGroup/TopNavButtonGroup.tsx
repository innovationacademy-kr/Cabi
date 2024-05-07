import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import {
  currentCabinetIdState,
  myCabinetInfoState,
  targetCabinetInfoState,
  userState,
} from "@/Cabinet/recoil/atoms";
import TopNavButton from "@/Cabinet/components/TopNav/TopNavButtonGroup/TopNavButton/TopNavButton";
import { CabinetInfo } from "@/Cabinet/types/dto/cabinet.dto";
import { LentDto } from "@/Cabinet/types/dto/lent.dto";
import CabinetStatus from "@/Cabinet/types/enum/cabinet.status.enum";
import CabinetType from "@/Cabinet/types/enum/cabinet.type.enum";
import {
  axiosCabinetById,
  axiosDeleteCurrentBanLog,
} from "@/Cabinet/api/axios/axios.custom";
import useMenu from "@/Cabinet/hooks/useMenu";

export const getDefaultCabinetInfo = () => ({
  building: "",
  floor: 0,
  cabinetId: 0,
  visibleNum: 0,
  lentType: CabinetType.PRIVATE,
  title: null,
  maxUser: 0,
  status: CabinetStatus.PENDING,
  section: "",
  lents: [] as LentDto[],
  statusNote: "",
});

const TopNavButtonGroup = ({ isAdmin }: { isAdmin?: boolean }) => {
  const { toggleCabinet, toggleMap, toggleStore, openCabinet, closeAll } =
    useMenu();
  const [currentCabinetId, setCurrentCabinetId] = useRecoilState(
    currentCabinetIdState
  );
  const setTargetCabinetInfo = useSetRecoilState<CabinetInfo>(
    targetCabinetInfoState
  );
  const [myInfo, setMyInfo] = useRecoilState(userState);
  const [myCabinetInfo, setMyCabinetInfo] = useRecoilState(myCabinetInfoState);
  const { pathname } = useLocation();
  const navigator = useNavigate();

  async function setTargetCabinetInfoToMyCabinet() {
    setCurrentCabinetId(myInfo.cabinetId);
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
    if (myInfo.cabinetId === null && !myCabinetInfo?.cabinetId) {
      setTargetCabinetInfoToMyCabinet();
      toggleCabinet();
    } else if (currentCabinetId !== myInfo.cabinetId) {
      setTargetCabinetInfoToMyCabinet();
      openCabinet();
    } else {
      toggleCabinet();
    }
  };
  const searchBarOn = () => {
    document.getElementById("searchBar")!.classList.add("on");
    document.getElementById("topNavLogo")!.classList.add("pushOut");
    document.getElementById("topNavButtonGroup")!.classList.add("pushOut");
    document.getElementById("topNavWrap")!.classList.add("pushOut");
  };
  const clickSearchButton = () => {
    if (!pathname.includes("search")) navigator("search");
    closeAll();
    searchBarOn();
  };
  return (
    <NaviButtonsStyled id="topNavButtonGroup">
      {import.meta.env.VITE_UNBAN === "true" && (
        <TopNavButton
          onClick={() => axiosDeleteCurrentBanLog(myInfo.userId)}
          imgSrc="/src/Cabinet/assets/images/happyCcabiWhite.png"
          width="32px"
          height="32px"
        />
      )}
      {isAdmin && (
        <TopNavButton
          id="searchButton"
          onClick={clickSearchButton}
          imgSrc="/src/Cabinet/assets/images/searchWhite.svg"
          width="28px"
          height="28px"
          disable={true}
        />
      )}
      <TopNavButton
        onClick={toggleStore}
        imgSrc="/src/Cabinet/assets/images/storeCoinNav.svg"
      />
      {!isAdmin && !!myInfo.cabinetId && (
        <>
          <TopNavButton
            disable={!myInfo.cabinetId}
            onClick={clickMyCabinet}
            imgSrc="/src/Cabinet/assets/images/myCabinetIcon.svg"
          />
        </>
      )}
      <TopNavButton
        onClick={toggleMap}
        imgSrc="/src/Cabinet/assets/images/map.svg"
      />
    </NaviButtonsStyled>
  );
};

const NaviButtonsStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > div:last-child {
    margin-right: 0;
  }
`;

export default TopNavButtonGroup;
