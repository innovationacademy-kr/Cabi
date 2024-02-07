import { useEffect, useState } from "react";
import styled from "styled-components";
import MultiToggleSwitch2, {
  toggleItem,
} from "@/components/Common/MultiToggleSwitch2";
import { ClubListReponseType } from "@/types/dto/club.dto";
import { STATUS_400_BAD_REQUEST } from "@/constants/StatusCode";

interface ClubListProps<T> {
  clubList: ClubListReponseType;
  toggleType: T;
  setToggleType: React.Dispatch<React.SetStateAction<T>>;
}

const ClubList = <T,>({
  clubList,
  toggleType,
  setToggleType,
}: ClubListProps<T>) => {
  const [toggleList, setToggleList] = useState<toggleItem[]>([]);

  useEffect(() => {
    if (clubList && clubList !== STATUS_400_BAD_REQUEST) {
      setToggleType(clubList.result[0].clubId as T);
      const clubToToggle = clubList.result.map((club) => {
        return {
          name: club.clubName.toString(),
          key: club.clubId,
        };
      });
      setToggleList(clubToToggle);
    }
  }, [clubList]);

  return (
    <ClubListWrapperStyled>
      <MultiToggleSwitch2
        initialState={toggleType}
        setState={setToggleType}
        toggleList={toggleList}
      />
    </ClubListWrapperStyled>
  );
};

const ClubListWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80%;
  max-width: 720px;
  margin: 2rem 0;
`;

export default ClubList;