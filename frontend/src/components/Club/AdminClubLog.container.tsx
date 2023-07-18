import { useEffect, useState } from "react";
import AdminclubLog from "@/components/Club/AdminClubLog";
import { ClubLogResponseType } from "@/types/dto/lent.dto";
import { axiosGetClubUserLog } from "@/api/axios/axios.custom";
import { STATUS_400_BAD_REQUEST } from "@/constants/StatusCode";

const AdminClubLogContainer = () => {
  const [logs, setLogs] = useState<ClubLogResponseType>(undefined);
  const [page, setPage] = useState<number>(-1);
  const [totalPage, setTotalPage] = useState<number>(-1);
  const [needsUpdate, setNeedsUpdate] = useState<boolean>(false);
  async function getData(page: number) {
    try {
      const result = await axiosGetClubUserLog(page);
      setTotalPage(result.data.totalPage);
      setLogs(result.data.result);
    } catch {
      setLogs(STATUS_400_BAD_REQUEST);
      setTotalPage(1);
    }
  }
  useEffect(() => {
    setPage(0);
    getData(0);
  });

  useEffect(() => {
    if (needsUpdate || page > 0) {
      setNeedsUpdate(false);
      getData(page);
    }
  }, [page]);

  const onClickPrev = () => {
    if (page == 0) return;
    setNeedsUpdate(true);
    setPage((prev) => prev - 1);
  };

  const onClickNext = () => {
    if (page == totalPage - 1) return;
    setPage((prev) => prev + 1);
  };

  return (
    <AdminclubLog
      logs={logs}
      page={page}
      totalPage={totalPage}
      onClickPrev={onClickPrev}
      onClickNext={onClickNext}
    />
  );
};

export default AdminClubLogContainer;
