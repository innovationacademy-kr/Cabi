import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { targetUserInfoState } from "@/recoil/atoms";
import AdminUserLentLog from "@/components/LentLog/AdminUserLentLog";
import { LentLogResponseType } from "@/types/dto/lent.dto";
import { axiosGetUserLentLog } from "@/api/axios/axios.custom";
import useMenu from "@/hooks/useMenu";
import { getTotalPage } from "@/utils/dateUtils";
import { STATUS_400_BAD_REQUEST } from "@/constants/StatusCode";


const AdminUserLentLogContainer = () => {
  const { closeLent } = useMenu();
  const [logs, setLogs] = useState<LentLogResponseType>(undefined);
  const [page, setPage] = useState<number>(-1);
  const [totalPage, setTotalPage] = useState<number>(-1);
  const [needsUpdate, setNeedsUpdate] = useState<boolean>(false);
  const targetUserInfo = useRecoilValue(targetUserInfoState);
  async function getData(page: number) {
    try {
      const result = await axiosGetUserLentLog(targetUserInfo.userId, page);
      setTotalPage(getTotalPage(result.data.totalLength, 10));
      setLogs(result.data.result);
    } catch {
      setLogs(STATUS_400_BAD_REQUEST);
      setTotalPage(1);
    }
  }

  useEffect(() => {
    setPage(0);
    getData(0);
  }, [targetUserInfo]);

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

  const closeAndResetLogPage = () => {
    closeLent();
    setNeedsUpdate(true);
    setPage(0);
  };

  if (!targetUserInfo) return null;

  return (
    <AdminUserLentLog
      closeLent={closeAndResetLogPage}
      logs={logs}
      page={page}
      totalPage={totalPage}
      onClickPrev={onClickPrev}
      onClickNext={onClickNext}
    />
  );
};

export default AdminUserLentLogContainer;
