package org.ftclub.cabinet.auth.controller;

import org.ftclub.cabinet.config.JwtProperties;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import javax.servlet.http.HttpServletResponse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerUnitTest {

    @Autowired
    MockMvc mvc;
    @Autowired
    JwtProperties jwtProperties;

    @Test
    void 유저_로그인_요청() throws Exception {
        //리디렉션 302
        mvc.perform(get("/v4/auth/login"))
                .andExpect(status().isFound());
    }

    @Test
    void 유저_로그인_콜백() throws Exception {
        //valid한 코드는 알 수 없음
        String inValidCode = "thisMustBeBadGateWayBecauseOfInvalidCode";

        mvc.perform(get("/v4/auth/login/callback?code={code}", inValidCode))
                .andExpect(status().isBadGateway());
    }

    @Test
    void 유저_로그아웃_요청() throws Exception {
        //given
        String tokenName = jwtProperties.getMainTokenName();

        //when
        MvcResult result = mvc.perform(get("/v4/auth/logout")).andReturn();

        //then
        assertEquals(result.getResponse().getStatus(), HttpServletResponse.SC_OK);
        assertEquals(result.getResponse().getCookie(tokenName).getValue(), null);
        assertEquals(result.getResponse().getCookie(tokenName).getMaxAge(), 0);
    }

}
