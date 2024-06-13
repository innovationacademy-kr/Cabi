import styled from "styled-components";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import { ItemLogResponseType } from "@/Cabinet/types/dto/admin.dto";
import { STATUS_400_BAD_REQUEST } from "@/Cabinet/constants/StatusCode";

const dateOptions: Intl.DateTimeFormatOptions = {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
};

const AdminItemProvideTable = ({
  itemLog,
}: {
  itemLog: ItemLogResponseType;
}) => {
  if (itemLog === undefined) return <LoadingAnimation />;

  return (
    <LogTableWrapperstyled>
      <LogTableStyled>
        <TheadStyled>
          <tr>
            <th>지급일</th>
            <th>아이템</th>
          </tr>
        </TheadStyled>
        {itemLog !== STATUS_400_BAD_REQUEST && (
          <TbodyStyled>
            {itemLog.itemHistories.map(
              ({ issuedDate, itemName, itemDetails, usedAt }, idx) => (
                <tr key={idx}>
                  <td
                    title={
                      issuedDate
                        ? new Date(issuedDate).toLocaleString("ko-KR")
                        : ""
                    }
                  >
                    {issuedDate
                      ? new Date(issuedDate).toLocaleString(
                          "ko-KR",
                          dateOptions
                        )
                      : ""}
                  </td>
                  <td>
                    {itemName !== itemDetails
                      ? `${itemName} - ${itemDetails}`
                      : itemName}
                  </td>
                </tr>
              )
            )}
          </TbodyStyled>
        )}
      </LogTableStyled>
      {itemLog === STATUS_400_BAD_REQUEST && (
        <EmptyLogStyled>아이템 사용기록이 없습니다.</EmptyLogStyled>
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
    font-size: small;
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

export default AdminItemProvideTable;
