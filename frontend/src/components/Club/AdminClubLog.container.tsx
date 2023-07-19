  import { useEffect, useState } from "react";
  import AdminClubLog from "@/components/Club/AdminClubLog";
  import { ClubLogResponseType, ClubUserDto } from "@/types/dto/lent.dto";
  import { axiosGetClubUserLog } from "@/api/axios/axios.custom";
  import { STATUS_400_BAD_REQUEST } from "@/constants/StatusCode";

  const AdminClubLogContainer = ( props: any ) => {
  const [logs, setLogs] = useState<ClubLogResponseType>(undefined);
  const [page, setPage] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(1);
  const { shouldFetchData, setShouldFetchData } = props;

  const getData = async (page: number) => {
    try {
      const result = await axiosGetClubUserLog(page);
      if (totalPage != Math.ceil(result.data.totalLength / 10) && page >= 1)
      {
        setTotalPage(Math.ceil(result.data.totalLength / 10));
        setPage(page - 1);
      }
      else
        setTotalPage(Math.ceil(result.data.totalLength / 10));
      setLogs(result.data.result);
    } catch {
      setLogs(STATUS_400_BAD_REQUEST);
      setTotalPage(1);
    }
    }
    
  useEffect(() => {
    getData(page);
    if (shouldFetchData) {
      setShouldFetchData(false);
    }
  }, [page, totalPage, shouldFetchData]);

  const onClickPrev = () => {
    if (page === 0) {
      setPage(totalPage - 1);
    } else {
      setPage((prev) => prev - 1);
    }
  };

  const onClickNext = () => {
    if (page == totalPage - 1) {
      setPage(0);
    } else {
      setPage((prev) => prev + 1);
    }
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
      changePageOnClickIndexButton={changePageOnClickIndexButton}
    />
  );
};

  export default AdminClubLogContainer;
