package org.ftclub.cabinet.auth.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

	@Autowired
	MockMvc mvc;

	@Test
	void 유저_로그인_요청() throws Exception {
		//리디렉션 302
		mvc.perform(get("/api/auth/login"))
				.andExpect(status().isFound());
	}

	@Test
	void 유저_로그인_콜백() throws Exception {
		//valid한 코드는 알 수 없음
		String inValidCode = "thisMustBeBadGateWayBecauseOfInvalidCode";

		mvc.perform(get("/api/auth/login/callback?code={code}", inValidCode))
				.andExpect(status().isBadGateway());
	}

	@Test
	void 유저_로그아웃_요청() throws Exception {
		MvcResult result = mvc.perform(get("/api/auth/logout")).andExpect(status().isOk()).andReturn();
	}
}
