package org.ftclub.cabinet.cabinet.controller;

import static org.ftclub.testutils.TestControllerUtils.mockRequest;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
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
public class CabinetControllerTest {

	@Autowired
	MockMvc mvc;

	@Autowired
	JwtProperties jwtProperties;

	String userToken;
	Cookie cookie;

	@BeforeEach
	void setToken() {
		userToken = TestControllerUtils.getTestUserToken(jwtProperties.getSigningKey(),
				LocalDateTime.now());
		cookie = TestControllerUtils.getTokenCookie("사용자", userToken);
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
