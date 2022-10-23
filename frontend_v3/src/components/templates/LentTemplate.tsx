import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Navigate, useNavigate } from "react-router-dom";
import GuideModal from "../atoms/modals/GuideModal";
import ReturnBox from "../atoms/modals/ReturnBox";
import HomeButton from "../atoms/buttons/HomeButton";
import MenuButton from "../atoms/buttons/MenuButton";
import ReturnButton from "../atoms/buttons/ReturnButton";
import LentInfo from "../organisms/LentInfo";
import { LentDto } from "../../types/dto/lent.dto";
import { axiosMyLentInfo } from "../../network/axios/axios.custom";
import { MyCabinetInfoResponseDto } from "../../types/dto/cabinet.dto";
import { useAppSelector } from "../../redux/hooks";
import { setUserCabinet } from "../../redux/slices/userSlice";

// const LentSection = styled.section`
//   position: absolute;
//   left: 5vw;
//   top: 5vw;
//   background-color: #f4f3f8;
//   border-radius: 1rem;
//   width: 90vw;
//   height: calc(90vh - 10vw);
// `;

const LentSection = styled.section`
  width: 100%;
  height: 100%;
  left: 5vw;
  top: 5vw;
  background-color: #f4f3f8;
  border-radius: 1rem;
`;

const LentNavSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5%;
  max-height: 2rem;
  padding: 0.5rem 0.7rem 0 0.7rem;
  margin-bottom: 1rem;
`;

const LentInfoSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75%;
`;

const LentReturnSection = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10%;
  margin-top: 5%;
`;

const LentTemplate = (): JSX.Element => {
  const userInfo = useAppSelector((state) => state.user);
  const [myLentInfo, setMyLentInfo] = useState<MyCabinetInfoResponseDto | null>(
    null
  );
  const [lentUser, setLentUser] = useState<LentDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    axiosMyLentInfo()
      .then((response) => {
        if (response.status === 204) {
          setUserCabinet(-1);
          navigate("/");
          return;
        }
        setLentUser(
          response.data.lent_info.filter(
            (user: LentDto) => user.intra_id === userInfo.intra_id
          )
        );
        setMyLentInfo(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <LentSection id="test">
      <LentNavSection className="LentNavSection">
        <HomeButton />
        <MenuButton />
      </LentNavSection>
      {!isLoading && (
        <>
          <LentInfoSection>
            <LentInfo myLentInfo={myLentInfo} />
          </LentInfoSection>
          <LentReturnSection>
            <GuideModal
              box={
                <ReturnBox
                  lentType={myLentInfo?.lent_type}
                  lentUser={lentUser}
                />
              }
              button={<ReturnButton button_title="반 납 하 기" />}
            />
          </LentReturnSection>
        </>
      )}
    </LentSection>
  );
};

export default LentTemplate;
