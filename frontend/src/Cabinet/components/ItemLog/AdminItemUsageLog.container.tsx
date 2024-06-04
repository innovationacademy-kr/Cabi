import { useEffect, useState } from "react";
import AdminItemUsageLog from "@/Cabinet/components/ItemLog/AdminItemUsageLog";
import { ItemLogResponseType } from "@/Cabinet/types/dto/admin.dto";
import { axiosGetUserItems } from "@/Cabinet/api/axios/axios.custom";
import useMenu from "@/Cabinet/hooks/useMenu";

const AdminItemUsageLogContainer = () => {
  const { closeStore } = useMenu();
  const [userId, setUserId] = useState<number>(0);
  const [logs, setLogs] = useState<ItemLogResponseType>({
    itemHistories: [],
    totalLength: 0,
  });
  const [page, setPage] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(-1);
  const [needsUpdate, setNeedsUpdate] = useState<boolean>(true);
  const size = 8;

  async function getData(page: number) {
    try {
      const paginatedData = await axiosGetUserItems(userId, page, size);
      setLogs({
        itemHistories: paginatedData.itemHistories,
        totalLength: paginatedData.totalLength,
      });
      setTotalPage(Math.ceil(paginatedData.totalLength / size));
    } catch {
      setLogs({ itemHistories: [], totalLength: 0 });
      setTotalPage(1);
    }
  }

  useEffect(() => {
    if (needsUpdate) {
      getData(page);
      setNeedsUpdate(false);
    }
  }, [needsUpdate, page, userId]);

  const onClickPrev = () => {
    if (page > 0) {
      setPage((prev) => prev - 1);
      setNeedsUpdate(true);
    }
  };

  const onClickNext = () => {
    if (page < totalPage - 1) {
      setPage((prev) => prev + 1);
      setNeedsUpdate(true);
    }
  };

  const closeAndResetLogPage = () => {
    closeStore();
    setPage(0);
    setNeedsUpdate(true);
  };

  return (
    <AdminItemUsageLog
      closeItem={closeAndResetLogPage}
      logs={logs}
      page={page}
      totalPage={totalPage}
      onClickPrev={onClickPrev}
      onClickNext={onClickNext}
    />
  );
};

export default AdminItemUsageLogContainer;
