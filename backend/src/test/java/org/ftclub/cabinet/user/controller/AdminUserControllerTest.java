package org.ftclub.cabinet.user.controller;

import org.ftclub.cabinet.auth.domain.TokenValidator;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.testutils.TestUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.test.web.servlet.MockMvc;

import javax.servlet.http.Cookie;
import javax.transaction.Transactional;
import java.time.LocalDateTime;

import static org.ftclub.testutils.TestUtils.mockRequest;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AdminUserControllerTest {

	@Autowired
	MockMvc mockMvc;

	@Autowired
	JwtProperties jwtProperties;

	@Autowired
	TokenValidator tokenValidator;

	String adminToken;
	Cookie cookie;

	@BeforeEach
	void setToken() {
		adminToken = TestUtils.getTestAdminToken(jwtProperties.getSigningKey(),
				LocalDateTime.now(), "admin", "gmail.com");
		cookie = TestUtils.getTokenCookie("관리자", adminToken);
	}

	@Test
	@Disabled
	void deleteBanHistoryByUserId() throws Exception {
		// 밴 기록이 없는 유저
		mockMvc.perform(mockRequest(HttpMethod.DELETE, cookie,
						"/v4/admin/users/{userId}/ban-history", 2L))
				.andExpect(status().isNotFound());
	}
}