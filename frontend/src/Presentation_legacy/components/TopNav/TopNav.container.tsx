import React, { SetStateAction, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { myCabinetInfoState } from "@/Cabinet/recoil/atoms";
import { MyCabinetInfoResponseDto } from "@/Cabinet/types/dto/cabinet.dto";
import { axiosMyLentInfo } from "@/Cabinet/api/axios/axios.custom";
import useMenu from "@/Cabinet/hooks/useMenu";
import TopNav from "@/Presentation_legacy/components/TopNav/TopNav";

const TopNavContainer: React.FC<{
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
}> = (props) => {
  const setMyLentInfo =
    useSetRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const { setIsLoading } = props;
  const { toggleLeftNav } = useMenu();

  const onClickLogo = () => {
    toggleLeftNav();
  };

  useEffect(() => {
    async function getMyLentInfo() {
      try {
        const { data: myLentInfo } = await axiosMyLentInfo();

        setMyLentInfo(myLentInfo);
      } catch (error) {
        console.error(error);
      }
    }
    Promise.all([getMyLentInfo()]).then(() => setIsLoading(false));
  }, []);

  return <TopNav onClickLogo={onClickLogo} />;
};

export default TopNavContainer;
