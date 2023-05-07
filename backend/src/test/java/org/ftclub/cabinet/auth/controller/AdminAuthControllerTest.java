package org.ftclub.cabinet.auth.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.ftclub.cabinet.auth.AdminAuthController;
import org.junit.Before;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@SpringBootTest(properties = {"spring.config.location=classpath:application-oauth.yml"})
@AutoConfigureMockMvc
public class AdminAuthControllerTest {

	@Autowired
	MockMvc mvc;

	@Before
	void setUp() {
		mvc = MockMvcBuilders.standaloneSetup(AdminAuthController.class)
				.build();
	}

	@Test
	void 어드민_로그인_요청() throws Exception {
		//리디렉션 302
		mvc.perform(get("/api/admin/auth/login"))
				.andExpect(status().isFound());
	}

	@Test
	void 어드민_로그인_콜백() throws Exception {
		//valid한 코드는 알 수 없음
		String inValidCode = "thisMustBeBadGateWayBecauseOfInvalidCode";

		mvc.perform(get("/api/admin/auth/login/callback?code={code}", inValidCode))
				.andExpect(status().isBadGateway());
	}
}
