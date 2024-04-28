import { useRecoilState } from "recoil";
import styled from "styled-components";
import { selectedClubInfoState } from "@/Cabinet/recoil/atoms";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import { ClubLogResponseType, ClubUserDto } from "@/Cabinet/types/dto/lent.dto";
import { STATUS_400_BAD_REQUEST } from "@/Cabinet/constants/StatusCode";

const ClubLogTable = ({ ClubList }: { ClubList: ClubLogResponseType }) => {
  const [selectedClubInfo, setSelectedClubInfo] = useRecoilState(
    selectedClubInfoState
  );

  const handleRowClick = (clubInfo: ClubUserDto) => {
    setSelectedClubInfo(
      selectedClubInfo?.clubId === clubInfo.clubId ? null : clubInfo
    );
  };

  if (ClubList === undefined) return <LoadingAnimation />;

  return (
    <>
      {ClubList !== STATUS_400_BAD_REQUEST && ClubList.length !== 0 ? (
        <LogTableWrapperStyled>
          <LogTableStyled>
            <TheadStyled>
              <tr>
                <th>동아리명</th>
                <th>동아리장</th>
              </tr>
            </TheadStyled>
            <TbodyStyled>
              {ClubList.map(({ clubId, clubName, clubMaster }) => (
                <tr
                  key={clubId}
                  onClick={() =>
                    handleRowClick({ clubId, clubName, clubMaster })
                  }
                  className={
                    selectedClubInfo?.clubId === clubId ? "selected" : ""
                  }
                >
                  <td>{`${clubName}`}</td>
                  <td>{`${clubMaster}`}</td>
                </tr>
              ))}
            </TbodyStyled>
          </LogTableStyled>
        </LogTableWrapperStyled>
      ) : (
        <EmptyLogStyled>등록된 동아리가 없습니다.</EmptyLogStyled>
      )}
    </>
  );
};

const LogTableWrapperStyled = styled.div`
  width: 100%;
  max-width: 400px;
  overflow: hidden;
  margin: 0 auto;
`;

const LogTableStyled = styled.table`
  width: 100%;
  background: var(--bg-color);
  overflow: scroll;
  border-spacing: 0 0.3em;
  border-collapse: separate;
`;

const TheadStyled = styled.thead`
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: var(--bg-color);
`;

const TbodyStyled = styled.tbody`
  color: var(--shared-gray-color-500);
  & > tr {
    text-align: center;
    height: 50px;
    cursor: pointer;
    background: var(--shared-purple-color-100);
  }
  & > tr td:first-of-type {
    border-radius: 8px 0 0 8px;
  }
  & > tr td:last-of-type {
    border-radius: 0 8px 8px 0;
  }
  & > tr > td {
    height: 50px;
    line-height: 50px;
    width: 33.3%;
  }
  & > tr:hover,
  & > tr.selected {
    background-color: var(--sys-sub-color);
    color: var(--bg-color);
  }
`;

const EmptyLogStyled = styled.div`
  width: 100%;
  text-align: center;
  font-size: 1rem;
  padding: 20px 0;
`;

export default ClubLogTable;
