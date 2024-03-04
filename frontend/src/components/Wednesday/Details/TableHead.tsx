import styled from "styled-components";

export const tableHeadArray = [
  { date: "날짜" },
  { subject: "제목" },
  { userName: "ID" },
  { category: "카테고리" },
  { presentationTime: "시간" },
];

const TableHead = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <>
      {!isMobile ? (
        <TableHeadStyled>
          <tr>
            {tableHeadArray.map((head, idx) => {
              let entries = Object.entries(head);
              return (
                <th key={idx} id={entries[0][0]}>
                  {entries[0][1]}
                </th>
              );
            })}
          </tr>
        </TableHeadStyled>
      ) : null}
    </>
  );
};

export default TableHead;
const TableHeadStyled = styled.thead`
  margin-bottom: 10px;
  height: 40px;
  line-height: 40px;
  background-color: #3f69fd;
  color: var(--white);
  width: 100%;

  & > td {
    font-size: 1rem;
    text-align: center;
  }

  & #date {
    width: 13%;
    border-radius: 10px 0 0 10px;
  }

  & #subject {
    width: 56%;
  }

  & #userName {
    width: 14%;
  }

  & #category {
    width: 9%;
  }

  & #presentationTime {
    width: 8%;
    border-radius: 0 10px 10px 0;
  }
`;
