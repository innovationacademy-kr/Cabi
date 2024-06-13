import { useEffect, useState } from "react";
import AdminItemProvideLog from "@/Cabinet/components/ItemLog/AdminItemProvideLog";
import { ItemLogResponseType } from "@/Cabinet/types/dto/admin.dto";
import useMenu from "@/Cabinet/hooks/useMenu";
import { STATUS_400_BAD_REQUEST } from "@/Cabinet/constants/StatusCode";

const AdminItemProvideLogContainer = () => {
  const { closeStore } = useMenu();
  const [logs, setLogs] = useState<ItemLogResponseType>({
    itemHistories: [],
    totalLength: 0,
  });
  const [page, setPage] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(-1);
  const [needsUpdate, setNeedsUpdate] = useState<boolean>(false);
  const size = 8;

  const mockItemHistories = [
    {
      items: [
        {
          itemSku: "SKU1001",
          itemName: "이사권",
          itemDetails: "이사권",
          issuedDate: "2024-05-28T10:00:00",
        },
        {
          itemSku: "SKU1002",
          itemName: "알림 등록권",
          itemDetails: "알림 등록권",
          issuedDate: "2024-05-28T11:00:00",
        },
        {
          itemSku: "SKU1003",
          itemName: "페널티권",
          itemDetails: "31일",
          issuedDate: "2024-05-28T12:00:00",
        },
        {
          itemSku: "SKU1004",
          itemName: "연장권",
          itemDetails: "15일",
          issuedDate: "2024-05-28T13:00:00",
        },
      ],
    },
  ];

  async function getData(page: number) {
    try {
      const items = mockItemHistories[0].items;
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedItems = items.slice(startIndex, endIndex);

      const paginatedData = {
        itemHistories: paginatedItems,
        totalLength: items.length,
      };

      setLogs(paginatedData);
      setTotalPage(Math.ceil(paginatedData.totalLength / size));
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setLogs({ itemHistories: [], totalLength: 0 });
    }
  }

  useEffect(() => {
    getData(page);
  }, [page]);

  useEffect(() => {
    if (needsUpdate) {
      getData(page);
      setNeedsUpdate(false);
    }
  }, [needsUpdate, page]);

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
    <AdminItemProvideLog
      closeItem={closeAndResetLogPage}
      logs={logs}
      page={page}
      totalPage={totalPage}
      onClickPrev={onClickPrev}
      onClickNext={onClickNext}
    />
  );
};

export default AdminItemProvideLogContainer;
