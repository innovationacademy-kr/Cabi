package org.ftclub.cabinet.cabinet.controller;

import static org.ftclub.testutils.TestControllerUtils.mockRequest;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Collections;
import java.util.Map;
import javax.servlet.http.Cookie;
import javax.transaction.Transactional;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.utils.DateUtil;
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
				DateUtil.getNow());
		cookie = TestControllerUtils.getTokenCookie("사용자", userToken);
	}

	@Test
	void 건물_층_정보_가져오기() throws Exception {
		//항상 정상 입력
		mvc.perform(mockRequest(HttpMethod.GET, cookie,
						"/api/cabinets/buildings/floors"))
				.andExpect(status().isOk());
	}

	@Test
	void 구역별_사물함_가져오기() throws Exception {
		//정상 입력
		mvc.perform(mockRequest(HttpMethod.GET, cookie,
						"/api/cabinets/buildings/{building}/floors/{floor}",
						"새롬관", 2))
				.andExpect(status().isOk());

		//잘못된 입력
		mvc.perform(mockRequest(HttpMethod.GET, cookie,
						"/api/cabinets/buildings/{building}/floors/{floor}",
						42, "포티투"))
				.andExpect(status().isBadRequest());
	}

	@Test
	void 사물함_정보_가져오기() throws Exception {
		//정상 입력
		mvc.perform(
						mockRequest(HttpMethod.GET, cookie, "/api/cabinets/{cabinetId}",
								1))
				.andExpect(status().isOk());

		//잘못된 입력
		mvc.perform(
						mockRequest(HttpMethod.GET, cookie, "/api/cabinets/{cabinetId}",
								"사십이"))
				.andExpect(status().isBadRequest());

	}

	@Test
	void 사물함_제목_수정() throws Exception {
		Map<String, String> rightRequest = Collections.singletonMap("title", "수정된 제목");
		Map<String, String> wrongRequest = Collections.singletonMap("memo", "수정된 메모");
		Map<String, String> emptyRequest = Collections.emptyMap();
		String rightRequestBody = new ObjectMapper().writeValueAsString(rightRequest);
		String wrongRequestBody = new ObjectMapper().writeValueAsString(wrongRequest);
		String emptyRequestBody = new ObjectMapper().writeValueAsString(emptyRequest);

		//정상 입력
		mvc.perform(mockRequest(HttpMethod.PATCH, cookie, "/api/cabinets/{cabinetId}/title", 1)
						.contentType("application/json")
						.content(rightRequestBody))
				.andExpect(status().isOk());

		//잘못된 입력
		mvc.perform(mockRequest(HttpMethod.PATCH, cookie, "/api/cabinets/{cabinetId}/title", 1)
						.contentType("application/json")
						.content(wrongRequestBody))
				.andExpect(status().isBadRequest());

		//빈 입력
		mvc.perform(mockRequest(HttpMethod.PATCH, cookie, "/api/cabinets/{cabinetId}/title", 1)
						.contentType("application/json")
						.content(emptyRequestBody))
				.andExpect(status().isBadRequest());
	}

	@Test
	void 사물함_메모_수정() throws Exception {
		Map<String, String> rightRequest = Collections.singletonMap("memo", "수정된 메모");
		Map<String, String> wrongRequest = Collections.singletonMap("title", "수정된 제목");
		Map<String, String> emptyRequest = Collections.emptyMap();
		String rightRequestBody = new ObjectMapper().writeValueAsString(rightRequest);
		String wrongRequestBody = new ObjectMapper().writeValueAsString(wrongRequest);
		String emptyRequestBody = new ObjectMapper().writeValueAsString(emptyRequest);

		//정상 입력
		mvc.perform(mockRequest(HttpMethod.PATCH, cookie, "/api/cabinets/{cabinetId}/memo", 1)
						.contentType("application/json")
						.content(rightRequestBody))
				.andExpect(status().isOk());

		//잘못된 입력
		mvc.perform(mockRequest(HttpMethod.PATCH, cookie, "/api/cabinets/{cabinetId}/memo", 1)
						.contentType("application/json")
						.content(wrongRequestBody))
				.andExpect(status().isBadRequest());

		//빈 입력
		mvc.perform(mockRequest(HttpMethod.PATCH, cookie, "/api/cabinets/{cabinetId}/memo", 1)
						.contentType("application/json")
						.content(emptyRequestBody))
				.andExpect(status().isBadRequest());
	}
}
