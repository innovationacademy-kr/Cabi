import { useEffect, useState } from "react";
import styled from "styled-components";
import ClubList from "@/components/Club/ClubList";
import ClubPageInfo from "@/components/Club/ClubPageInfo";
import {
  ClubListReponseType,
  ClubPaginationResponseDto,
} from "@/types/dto/club.dto";
import { axiosMyClubInfo } from "@/api/axios/axios.custom";
import { STATUS_400_BAD_REQUEST } from "@/constants/StatusCode";

const ClubPage = () => {
  const [clubList, setClubList] = useState<ClubListReponseType>(undefined);
  const [toggleType, setToggleType] = useState<number>(0);

  useEffect(() => {
    getMyClubInfo();
  }, []);

  const getMyClubInfo = async () => {
    try {
      const response = await axiosMyClubInfo();
      const result = response.data.result;
      const totalLength = response.data.totalLength;
      setClubList({ result, totalLength } as ClubPaginationResponseDto);
    } catch (error) {
      setClubList(STATUS_400_BAD_REQUEST);
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
        <ClubList
          clubList={clubList}
          toggleType={toggleType}
          setToggleType={setToggleType}
        />
      )}
      <ClubPageInfo clubId={toggleType} />
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
  font-size: 1.5rem;
  font-weight: bold;
`;

export default ClubPage;
