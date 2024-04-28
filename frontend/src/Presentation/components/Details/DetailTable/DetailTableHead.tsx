import styled from "styled-components";

const DetailTableHead = ({
  isMobile,
  headEntries,
  isAdmin,
}: {
  isMobile: boolean;
  headEntries: [string, string][];
  isAdmin: boolean;
}) => {
  return (
    <>
      {!isMobile ? (
        <TableHeadStyled isAdmin={isAdmin}>
          <tr>
            {headEntries.map((head, idx) => {
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

const TableHeadStyled = styled.thead<{ isAdmin: boolean }>`
  margin-bottom: 10px;
  height: 40px;
  line-height: 40px;
  background-color: var(--presentation-main-color);
  color: var(--ref-white);
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
    width: ${(props) => (!props.isAdmin ? "42%" : "31%")};
  }

  & #userName {
    width: 14%;
  }

  & #category {
    width: 9%;
  }

  & #presentationTime {
    width: 8%;
  }

  & #presentationLocation {
    width: 14%;
    border-radius: ${(props) => (!props.isAdmin ? "0 10px 10px 0" : "")};
  }

  & #presentationStatus {
    width: 11%;
    border-radius: 0 10px 10px 0;
  }
`;

export default DetailTableHead;
