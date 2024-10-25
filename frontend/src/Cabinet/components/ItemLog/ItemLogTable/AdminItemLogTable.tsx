import { HttpStatusCode } from "axios";
import styled from "styled-components";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import { ItemLogResponseType } from "@/Cabinet/types/dto/admin.dto";
import { formatDate } from "@/Cabinet/utils/dateUtils";

const AdminItemLogTable = ({ itemLog }: { itemLog: ItemLogResponseType }) => {
  if (!itemLog) return <LoadingAnimation />;
  return (
    <LogTableWrapperstyled>
      <LogTableStyled>
        <TheadStyled>
          <tr>
            <th>발급일</th>
            <th>아이템</th>
            <th>사용일</th>
          </tr>
        </TheadStyled>
        {itemLog !== HttpStatusCode.BadRequest &&
          Array.isArray(itemLog.itemHistories) && (
            <TbodyStyled>
              {itemLog.itemHistories.map(
                ({ purchaseAt, itemName, itemDetails, usedAt }, idx) => (
                  <tr key={idx}>
                    <td
                      title={new Date(purchaseAt ?? "").toLocaleString("ko-KR")}
                    >
                      {formatDate(new Date(purchaseAt ?? ""), ".", 2, 2, 2)}
                    </td>
                    <td>
                      {itemName !== itemDetails
                        ? `${itemName} - ${itemDetails}`
                        : itemName}
                    </td>
                    <td
                      title={
                        usedAt ? new Date(usedAt).toLocaleString("ko-KR") : "-"
                      }
                    >
                      {usedAt
                        ? formatDate(new Date(usedAt), ".", 2, 2, 2)
                        : "-"}
                    </td>
                  </tr>
                )
              )}
            </TbodyStyled>
          )}
      </LogTableStyled>
      {(itemLog === HttpStatusCode.BadRequest ||
        itemLog.totalLength === undefined ||
        itemLog.totalLength === 0) && (
        <EmptyLogStyled>아이템 내역이 없습니다.</EmptyLogStyled>
      )}
    </LogTableWrapperstyled>
  );
};

const LogTableWrapperstyled = styled.div`
  width: 100%;
  max-width: 800px;
  border-radius: 10px;
  overflow: hidden;
  margin: 0 auto;
  box-shadow: 0 0 10px 0 var(--table-border-shadow-color-100);
`;

const LogTableStyled = styled.table`
  width: 100%;
  background: var(--bg-color);
  overflow: scroll;
`;

const TheadStyled = styled.thead`
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: var(--sys-main-color);
  color: var(--white-text-with-bg-color);
`;

const TbodyStyled = styled.tbody`
  & > tr {
    font-size: 11px;
    text-align: center;
    height: 50px;
  }
  & > tr > td {
    height: 50px;
    line-height: 50px;
    width: 33.3%;
  }
  & > tr:nth-child(2n) {
    background: var(--table-even-row-bg-color);
  }
`;

const EmptyLogStyled = styled.div`
  width: 100%;
  text-align: center;
  font-size: 1rem;
  padding: 20px 0;
`;

export default AdminItemLogTable;
