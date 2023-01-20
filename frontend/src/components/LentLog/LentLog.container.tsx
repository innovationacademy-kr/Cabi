import { axiosMyLentLog } from "@/api/axios/axios.custom";
import useMenu from "@/hooks/useMenu";
import { useEffect, useState } from "react";
import LentLog from "./LentLog";
import { LentLogDto } from "@/types/dto/lent.dto";

const LentLogContainer = () => {
  const { closeLent } = useMenu();
  const [logs, setLogs] = useState<LentLogDto[]>([]);
  const [page, setPage] = useState<number>(-1);
  const [totalPage, setTotalPage] = useState<number>(-1);
  async function getData(page: number) {
    try {
      const result = await axiosMyLentLog(0);
      setTotalPage(Math.floor(result.data.total_length / 10) + 1);
      setLogs(result.data.result);
    } catch (e) {
      throw e;
    }
  }
  useEffect(() => {
    setPage(1);
    getData(1);
  }, []);

  const onClickPrev = () => {
    if (page == 1) return;
    setPage(page - 1);
    getData(page - 1);
  };
  const onClickNext = () => {
    if (page == totalPage) return;
    setPage(page + 1);
    getData(page + 1);
  };

  return (
    <LentLog
      closeLent={closeLent}
      logs={logs}
      page={page}
      totalPage={totalPage}
      onClickPrev={onClickPrev}
      onClickNext={onClickNext}
    />
  );
};

export default LentLogContainer;
