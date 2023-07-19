import { useRecoilState } from "recoil";
import styled from "styled-components";
import { selectedClubInfoState } from "@/recoil/atoms";
import LoadingAnimation from "@/components/Common/LoadingAnimation";
import { ClubLogResponseType, ClubUserDto } from "@/types/dto/lent.dto";
import { STATUS_400_BAD_REQUEST } from "@/constants/StatusCode";

const ClubLogTableTmp = ({ ClubList }: { ClubList: ClubLogResponseType }) => {
  const [selectedClubInfo, setSelectedClubInfo] = useRecoilState(
    selectedClubInfoState
  );

  const handleRowClick = (clubInfo: ClubUserDto) => {
    setSelectedClubInfo(
      selectedClubInfo?.userId === clubInfo.userId ? null : clubInfo
    );
  };

  if (ClubList === undefined) return <LoadingAnimation />;

  return (
    <LogTableWrapperStyled>
      <LogTableStyled>
        <TheadStyled>
          <tr>
            <th>동아리명</th>
          </tr>
        </TheadStyled>
        {ClubList !== STATUS_400_BAD_REQUEST && (
          <TbodyStyled>
            {ClubList.map(({ userId, name }) => (
              <tr
                key={userId}
                onClick={() => handleRowClick({ userId, name })}
                className={
                  selectedClubInfo?.userId === userId ? "selected" : ""
                }
              >
                <td title={`${name}`}>{`${name}`}</td>
              </tr>
            ))}
          </TbodyStyled>
        )}
      </LogTableStyled>
      {ClubList === STATUS_400_BAD_REQUEST ||
        (ClubList.length === 0 && (
          <EmptyLogStyled>등록된 동아리가 없습니다.</EmptyLogStyled>
        ))}
    </LogTableWrapperStyled>
  );
};

const LogTableWrapperStyled = styled.div`
  width: 100%;
  max-width: 400px;
  border-radius: 10px;
  overflow: hidden;
  margin: 0 auto;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
`;

const LogTableStyled = styled.table`
  width: 100%;
  background: var(--white);
  overflow: scroll;
`;

const TheadStyled = styled.thead`
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: var(--main-color);
  color: var(--white);
`;

const TbodyStyled = styled.tbody`
  & > tr {
    text-align: center;
    height: 50px;
    cursor: pointer;
  }
  & > tr > td {
    height: 50px;
    line-height: 50px;
    width: 33.3%;
  }
  & > tr:nth-child(2n) {
    background: #f9f6ff;
  }
  & > tr.selected {
    background-color: var(--lightpurple-color);
    color: var(--white);
    font-weight: 700;
  }
`;

const EmptyLogStyled = styled.div`
  width: 100%;
  text-align: center;
  font-size: 1rem;
  padding: 20px 0;
`;

export default ClubLogTableTmp;
