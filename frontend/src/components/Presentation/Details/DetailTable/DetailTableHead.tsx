import styled from "styled-components";

const DetailTableHead = ({
  isMobile,
  tableHeadEntries,
}: {
  isMobile: boolean;
  tableHeadEntries: [string, string][];
}) => {
  return (
    <>
      {!isMobile ? (
        <TableHeadStyled>
          <tr>
            {tableHeadEntries.map((head, idx) => {
              return (
                <th key={idx} id={head[0]}>
                  {head[1]}
                </th>
              );
            })}
          </tr>
        </TableHeadStyled>
      ) : null}
    </>
  );
};

export default DetailTableHead;
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
