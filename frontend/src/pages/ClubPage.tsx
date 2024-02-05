import { useEffect, useState } from "react";
import styled from "styled-components";
import ClubInfo from "@/components/Club/ClubInfo";
import ClubList from "@/components/Club/ClubList";
import {
  ClubListReponseType,
  ClubPaginationResponseDto,
} from "@/types/dto/club.dto";
import { axiosMyClubList } from "@/api/axios/axios.custom";
import { STATUS_400_BAD_REQUEST } from "@/constants/StatusCode";

const ClubPage = () => {
  const [clubId, setClubId] = useState<number>(0);
  const [clubList, setClubList] = useState<ClubListReponseType>(undefined);

  useEffect(() => {
    getMyClubList();
  }, []);

  const getMyClubList = async () => {
    try {
      const response = await axiosMyClubList();
      const result = response.data.result;
      const totalLength = response.data.totalLength;
      if (totalLength === 0) {
        setClubList(STATUS_400_BAD_REQUEST);
      } else {
        setClubList({ result, totalLength } as ClubPaginationResponseDto);
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <WrapperStyled>
      {clubList === STATUS_400_BAD_REQUEST ? (
        <EmptyClubListTextStyled>
          가입한 동아리가 없어요!
        </EmptyClubListTextStyled>
      ) : (
        <>
          <ClubList
            clubList={clubList}
            toggleType={clubId}
            setToggleType={setClubId}
          />
          <ClubInfo clubId={clubId} />
        </>
      )}
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const EmptyClubListTextStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.5rem;
  /* font-weight: bold; */
`;

export default ClubPage;
