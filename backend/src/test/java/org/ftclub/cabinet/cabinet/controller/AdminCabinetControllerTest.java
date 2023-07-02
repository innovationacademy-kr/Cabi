package org.ftclub.cabinet.cabinet.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.util.*;

import static org.ftclub.testutils.TestUtils.mockRequest;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@Disabled
public class AdminCabinetControllerTest {

	@Autowired
	MockMvc mvc;

	@Autowired
	JwtProperties jwtProperties;

	String adminToken;
	Cookie cookie;

	@BeforeEach
	void setToken() {
		adminToken = TestUtils.getTestAdminToken(jwtProperties.getSigningKey(),
				LocalDateTime.now(), "name", "admin.domain.com");
		cookie = TestUtils.getTokenCookie("관리자", adminToken);
	}

	@Test
	void 사물함_정보_가져오기() throws Exception {
		//정상 입력
		mvc.perform(mockRequest(HttpMethod.GET, cookie,
						"/v4/admin/cabinets/{cabinetId}", 1))
				.andExpect(status().isOk());

		//잘못된 입력
		mvc.perform(mockRequest(HttpMethod.GET, cookie,
						"/v4/admin/cabinets/{cabinetId}", "사십이"))
				.andExpect(status().isBadRequest());
	}

	@Test
	void 사물함_상태_노트_업데이트() throws Exception {
		Map<String, String> rightRequest = Collections.singletonMap("statusNote", "수정된 제목");
		Map<String, String> wrongRequest = Collections.singletonMap("memo", "수정된 메모");
		Map<String, String> emptyRequest = Collections.emptyMap();
		String rightRequestBody = new ObjectMapper().writeValueAsString(rightRequest);
		String wrongRequestBody = new ObjectMapper().writeValueAsString(wrongRequest);
		String emptyRequestBody = new ObjectMapper().writeValueAsString(emptyRequest);

		// 정상 입력
		mvc.perform(
						mockRequest(HttpMethod.PATCH, cookie, "/v4/admin/cabinets/{cabinetId}/status-note",
								1)
								.content(rightRequestBody)
								.contentType("application/json"))
				.andExpect(status().isOk());

		// 잘못된 입력
		mvc.perform(
						mockRequest(HttpMethod.PATCH, cookie, "/v4/admin/cabinets/{cabinetId}/status-note",
								1)
								.content(wrongRequestBody)
								.contentType("application/json"))
				.andExpect(status().isBadRequest());

		// 빈 입력
		mvc.perform(
						mockRequest(HttpMethod.PATCH, cookie, "/v4/admin/cabinets/{cabinetId}/status-note",
								1)
								.content(emptyRequestBody)
								.contentType("application/json"))
				.andExpect(status().isBadRequest());
	}

	@Test
	void 사물함_제목_업데이트() throws Exception {
		Map<String, String> rightRequest = Collections.singletonMap("title", "수정된 제목");
		Map<String, String> wrongRequest = Collections.singletonMap("memo", "수정된 메모");
		Map<String, String> emptyRequest = Collections.emptyMap();
		String rightRequestBody = new ObjectMapper().writeValueAsString(rightRequest);
		String wrongRequestBody = new ObjectMapper().writeValueAsString(wrongRequest);
		String emptyRequestBody = new ObjectMapper().writeValueAsString(emptyRequest);

		// 정상 입력
		mvc.perform(mockRequest(HttpMethod.PATCH, cookie, "/v4/admin/cabinets/{cabinetId}/title",
						1)
						.content(rightRequestBody)
						.contentType("application/json"))
				.andExpect(status().isOk());

		// 잘못된 입력
		mvc.perform(mockRequest(HttpMethod.PATCH, cookie, "/v4/admin/cabinets/{cabinetId}/title",
						1)
						.content(wrongRequestBody)
						.contentType("application/json"))
				.andExpect(status().isBadRequest());

		// 빈 입력
		mvc.perform(mockRequest(HttpMethod.PATCH, cookie, "/v4/admin/cabinets/{cabinetId}/title",
						1)
						.content(emptyRequestBody)
						.contentType("application/json"))
				.andExpect(status().isBadRequest());
	}

	@Test
	void 사물함_좌표_업데이트() throws Exception {
		Map<String, Integer> rightRequest = new HashMap<>();
		rightRequest.put("row", 2);
		rightRequest.put("col", 2);
		Map<String, Integer> wrongRequest = Collections.singletonMap("memo", 3);
		Map<String, Integer> emptyRequest = Collections.emptyMap();
		String rightRequestBody = new ObjectMapper().writeValueAsString(rightRequest);
		String wrongRequestBody = new ObjectMapper().writeValueAsString(wrongRequest);
		String emptyRequestBody = new ObjectMapper().writeValueAsString(emptyRequest);

		// 정상 입력
		mvc.perform(mockRequest(HttpMethod.PATCH, cookie, "/v4/admin/cabinets/{cabinetId}/grid",
						1)
						.content(rightRequestBody)
						.contentType("application/json"))
				.andExpect(status().isOk());

		// 잘못된 입력
		mvc.perform(mockRequest(HttpMethod.PATCH, cookie, "/v4/admin/cabinets/{cabinetId}/grid",
						1)
						.content(wrongRequestBody)
						.contentType("application/json"))
				.andExpect(status().isBadRequest());

		//빈 입력
		mvc.perform(mockRequest(HttpMethod.PATCH, cookie, "/v4/admin/cabinets/{cabinetId}/grid",
						1)
						.content(emptyRequestBody)
						.contentType("application/json"))
				.andExpect(status().isBadRequest());
	}

	@Test
	void 사물함_실물번호_업데이트() throws Exception {
		Map<String, Integer> rightRequest = Collections.singletonMap("visibleNum", 3);
		Map<String, Integer> wrongRequest = Collections.singletonMap("memo", 2);
		Map<String, Integer> emptyRequest = Collections.emptyMap();
		String rightRequestBody = new ObjectMapper().writeValueAsString(rightRequest);
		String wrongRequestBody = new ObjectMapper().writeValueAsString(wrongRequest);
		String emptyRequestBody = new ObjectMapper().writeValueAsString(emptyRequest);

		// 정상 입력
		mvc.perform(
						mockRequest(HttpMethod.PATCH, cookie, "/v4/admin/cabinets/{cabinetId}/visible-num",
								1)
								.content(rightRequestBody)
								.contentType("application/json"))
				.andExpect(status().isOk());

		// 잘못된 입력
		mvc.perform(
						mockRequest(HttpMethod.PATCH, cookie, "/v4/admin/cabinets/{cabinetId}/visible-num",
								1)
								.content(wrongRequestBody)
								.contentType("application/json"))
				.andExpect(status().isBadRequest());

		// 빈 입력
		mvc.perform(
						mockRequest(HttpMethod.PATCH, cookie, "/v4/admin/cabinets/{cabinetId}/visible-num",
								1)
								.content(emptyRequestBody)
								.contentType("application/json"))
				.andExpect(status().isBadRequest());
	}

	@Test
	@Disabled
	void 사물함_여러_개_상태_업데이트() throws Exception {
		Map<String, List<Long>> rightRequest = Collections.singletonMap("cabinetIds",
				Arrays.asList(1L, 2L, 3L));
		Map<String, Long> wrongRequest = Collections.singletonMap("memo", 2L);
		Map<String, Long> emptyRequest = Collections.emptyMap();
		String rightRequestBody = new ObjectMapper().writeValueAsString(rightRequest);
		String wrongRequestBody = new ObjectMapper().writeValueAsString(wrongRequest);
		String emptyRequestBody = new ObjectMapper().writeValueAsString(emptyRequest);

		// 정상 입력
		mvc.perform(mockRequest(HttpMethod.PATCH, cookie, "/v4/admin/cabinets/status/{status}",
						"AVAILABLE")
						.content(rightRequestBody)
						.contentType("application/json"))
				.andExpect(status().isOk());

		// 잘못된 입력
		mvc.perform(mockRequest(HttpMethod.PATCH, cookie, "/v4/admin/cabinets/status/{status}",
						"AVAILABLE")
						.content(wrongRequestBody)
						.contentType("application/json"))
				.andExpect(status().isBadRequest());

		mvc.perform(mockRequest(HttpMethod.PATCH, cookie, "/v4/admin/cabinets/status/{status}",
						"WRONG_STATUS")
						.content(rightRequestBody)
						.contentType("application/json"))
				.andExpect(status().isBadRequest());

		// 빈 입력
		mvc.perform(mockRequest(HttpMethod.PATCH, cookie, "/v4/admin/cabinets/status/{status}",
						"AVAILABLE")
						.content(emptyRequestBody)
						.contentType("application/json"))
				.andExpect(status().isBadRequest());
	}

	@Test
	@Disabled
	void 사물함_여러_개_대여_타입_업데이트() throws Exception {
		Map<String, List<Long>> rightRequest = Collections.singletonMap("cabinetIds",
				Arrays.asList(1L, 2L, 3L));
		Map<String, Long> wrongRequest = Collections.singletonMap("memo", 2L);
		Map<String, Long> emptyRequest = Collections.emptyMap();
		String rightRequestBody = new ObjectMapper().writeValueAsString(rightRequest);
		String wrongRequestBody = new ObjectMapper().writeValueAsString(wrongRequest);
		String emptyRequestBody = new ObjectMapper().writeValueAsString(emptyRequest);

		// 정상 입력
		mvc.perform(
						mockRequest(HttpMethod.PATCH, cookie, "/v4/admin/cabinets/lent-types/{lentType}",
								"SHARE")
								.content(rightRequestBody)
								.contentType("application/json"))
				.andExpect(status().isOk());

		// 잘못된 입력
		mvc.perform(
						mockRequest(HttpMethod.PATCH, cookie, "/v4/admin/cabinets/lent-types/{lentType}",
								"SHARE")
								.content(wrongRequestBody)
								.contentType("application/json"))
				.andExpect(status().isBadRequest());

		mvc.perform(
						mockRequest(HttpMethod.PATCH, cookie, "/v4/admin/cabinets/lent-types/{lentType}",
								"WRONG_TYPE")
								.content(rightRequestBody)
								.contentType("application/json"))
				.andExpect(status().isBadRequest());

		// 빈 입력
		mvc.perform(
						mockRequest(HttpMethod.PATCH, cookie, "/v4/admin/cabinets/lent-types/{lentType}",
								"SHARE")
								.content(emptyRequestBody)
								.contentType("application/json"))
				.andExpect(status().isBadRequest());
	}
}
