import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { selectedClubInfoState } from "@/recoil/atoms";
import AdminClubLog from "@/components/Club/AdminClubLog";
import { ClubLogResponseType, ClubUserDto } from "@/types/dto/lent.dto";
import { axiosGetClubUserLog } from "@/api/axios/axios.custom";
import { STATUS_400_BAD_REQUEST } from "@/constants/StatusCode";

const AdminClubLogContainer = () => {
  const [logs, setLogs] = useState<ClubLogResponseType>(undefined);
  const [page, setPage] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [needsUpdate, setNeedsUpdate] = useState<boolean>(false);

  async function getData(page: number) {
    try {
      const result = await axiosGetClubUserLog(page);
      setTotalPage(Math.ceil(result.data.totalLength / 10));
      setLogs(result.data.result);
    } catch {
      setLogs(STATUS_400_BAD_REQUEST);
      setTotalPage(1);
    }
  }
  useEffect(() => {
    getData(page);
  }, [page, needsUpdate]);

  const onClickPrev = () => {
    if (page == 0) return;
    setNeedsUpdate(true);
    setPage((prev) => prev - 1);
  };

  const onClickNext = () => {
    if (page == totalPage - 1) return;
    setPage((prev) => prev + 1);
  };

  const [selectedClubInfo, setSelectedClubInfo] = useRecoilState(
    selectedClubInfoState
  );

  const handleRowClick = (clubInfo: ClubUserDto) => {
    setSelectedClubInfo(
      selectedClubInfo?.userId === clubInfo.userId ? null : clubInfo
    );
  };
  const changePageOnClickIndexButton = (pageIndex: number) => {
    if (totalPage === 0) return;
    setPage(pageIndex);
  };

  return (
    <AdminClubLog
      logs={logs}
      page={page}
      totalPage={totalPage}
      onClickPrev={onClickPrev}
      onClickNext={onClickNext}
      handleRowClick={handleRowClick}
      changePageOnClickIndexButton={changePageOnClickIndexButton}
    />
  );
};

export default AdminClubLogContainer;
