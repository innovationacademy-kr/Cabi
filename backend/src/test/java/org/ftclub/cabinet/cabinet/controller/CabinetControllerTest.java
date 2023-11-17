package org.ftclub.cabinet.cabinet.controller;

import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.utils.DateUtil;
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
@Disabled
public class CabinetControllerTest {

	@Autowired
	MockMvc mvc;

	@Autowired
	JwtProperties jwtProperties;

	String userToken;
	Cookie cookie;

	@BeforeEach
	void setToken() {
		userToken = TestUtils.getTestUserTokenByName(jwtProperties.getSigningKey(),
				LocalDateTime.now(), DateUtil.getInfinityDate(), "name", "user.domain.com");
		cookie = TestUtils.getTokenCookie("사용자", userToken);
	}

	@Test
	void 건물_층_정보_가져오기() throws Exception {
		//항상 정상 입력
		mvc.perform(mockRequest(HttpMethod.GET, cookie,
						"/v4/cabinets/buildings/floors"))
				.andExpect(status().isOk());
	}

	@Test
	void 구역별_사물함_가져오기() throws Exception {
		//정상 입력
		mvc.perform(mockRequest(HttpMethod.GET, cookie,
						"/v4/cabinets/buildings/{building}/floors/{floor}",
						"새롬관", 2))
				.andExpect(status().isOk());

		//잘못된 입력
		mvc.perform(mockRequest(HttpMethod.GET, cookie,
						"/v4/cabinets/buildings/{building}/floors/{floor}",
						42, "포티투"))
				.andExpect(status().isBadRequest());
	}

	@Test
	void 사물함_정보_가져오기() throws Exception {
		//정상 입력
		mvc.perform(
						mockRequest(HttpMethod.GET, cookie, "/v4/cabinets/{cabinetId}",
								1))
				.andExpect(status().isOk());

		//잘못된 입력
		mvc.perform(
						mockRequest(HttpMethod.GET, cookie, "/v4/cabinets/{cabinetId}",
								"사십이"))
				.andExpect(status().isBadRequest());

	}

}
