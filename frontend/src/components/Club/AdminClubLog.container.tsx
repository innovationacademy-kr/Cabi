import { useEffect, useState } from "react";
import AdminClubLog from "@/components/Club/AdminClubLog";
import { ClubLogResponseType } from "@/types/dto/lent.dto";
import { axiosGetClubUserLog } from "@/api/axios/axios.custom";

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
      setLogs([]);
      setTotalPage(1);
    }
  }
  console.log("test", totalPage);
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

  return (
    <AdminClubLog
      logs={logs}
      page={page}
      totalPage={totalPage}
      onClickPrev={onClickPrev}
      onClickNext={onClickNext}
    />
  );
};

export default AdminClubLogContainer;
