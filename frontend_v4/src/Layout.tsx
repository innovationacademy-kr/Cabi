import React, { useState, useEffect } from "react";
import { Outlet } from "react-router";
import { useNavigate, useLocation } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userState } from "@/recoil/atoms";
import TopNav from "@/components/TopNav";
import LeftNavContainer from "@/containers/LeftNavContainer";
import LeftNavOptionContainer from "@/containers/LeftNavOptionContainer";
import LoadingModal from "@/components/LoadingModal";
import { getCookie } from "@/api/react_cookie/cookies";
import { axiosMyInfo } from "@/api/axios/axios.custom";
import { UserDto } from "@/types/dto/user.dto";
import styled from "styled-components";

const Layout = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isValidToken, setIsValidToken] = useState<boolean>(false);
  const setUser = useSetRecoilState<UserDto>(userState);
  const navigate = useNavigate();
  const location = useLocation();
  const token = getCookie("access_token");

  const isRootPath: boolean = location.pathname === "/";
  const isLoginPage: boolean = location.pathname === "/login";
  const isHomePage: boolean = location.pathname === "/home";

  useEffect(() => {
    if (!token && !isLoginPage) navigate("/login");

    if (token) {
      setIsLoading(true);
      const getMyInfo = async () => {
        try {
          const { data: myInfo } = await axiosMyInfo();
          setUser(myInfo);
          setIsValidToken(true);
          if (isRootPath || isLoginPage) navigate("/home");
        } catch (error) {
          console.log(error);
        }
      };
      getMyInfo();
    }
  }, []);

  return isLoginPage ? (
    <Outlet />
  ) : (
    <React.Fragment>
      {isValidToken && <TopNav setIsLoading={setIsLoading} />}
      {isLoading ? (
        <LoadingModal />
      ) : (
        <WrapperStyled>
          <LeftNavContainer />
          <LeftNavOptionContainer isVisible={!isHomePage} />
          <Outlet />
        </WrapperStyled>
      )}
    </React.Fragment>
  );
};

export default Layout;

const WrapperStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
`;
