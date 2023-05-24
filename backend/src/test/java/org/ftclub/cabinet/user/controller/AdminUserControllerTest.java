package org.ftclub.cabinet.user.controller;

import static org.ftclub.testutils.TestControllerUtils.mockRequest;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import javax.servlet.http.Cookie;
import javax.transaction.Transactional;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.testutils.TestControllerUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AdminUserControllerTest {

	@Autowired
	MockMvc mockMvc;

	@Autowired
	JwtProperties jwtProperties;

	String adminToken;
	Cookie cookie;

	@BeforeEach
	void setToken() {
		adminToken = TestControllerUtils.getTestAdminToken(jwtProperties.getSigningKey());
		cookie = TestControllerUtils.getTokenCookie("관리자", adminToken);
	}

	@Test
	void getUserProfileListByPartialName() throws Exception {
		mockMvc.perform(mockRequest(HttpMethod.GET, cookie,
						"/api/admin/search/users/{name}", "user").param("page", "0").param("length", "10"))
				.andExpect(status().isOk());
	}

//	@Test
//	void findUserCabinetListByPartialName() throws Exception {
//		mockMvc.perform(mockRequest(HttpMethod.GET, cookie,
//						"/api/admin/search/users").param("name", "user").param("page", "0")
//						.param("length", "10"))
//				.andExpect(status().isOk());
//	}

	@Test
	void getBannedUsersList() throws Exception {
		mockMvc.perform(mockRequest(HttpMethod.GET, cookie,
						"/api/admin/search/users/banned").param("page", "0").param("length", "10"))
				.andExpect(status().isNoContent());
	}

	@Test
	void deleteBanHistoryByUserId() throws Exception {
		// 밴 기록이 없는 유저
		mockMvc.perform(mockRequest(HttpMethod.DELETE, cookie,
						"/api/admin/log/users/{userId}/ban-history", 2L))
				.andExpect(status().isNotFound());
	}

//	@Test
//	void getLentHistoriesByUserId() throws Exception {
//		mockMvc.perform(mockRequest(HttpMethod.GET, cookie,
//						"/api/admin/log/users/{userId}/lent-histories", 5L).param("page", "0")
//						.param("length", "10"))
//				.andExpect(status().isOk());
//	}
}