package org.ftclub.cabinet.cabinet.controller;

import static org.ftclub.testutils.TestControllerUtils.mockRequest;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.documentationConfiguration;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Collections;
import java.util.Map;
import javax.servlet.http.Cookie;
import javax.transaction.Transactional;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.testutils.TestControllerUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.restdocs.RestDocumentationContextProvider;
import org.springframework.restdocs.RestDocumentationExtension;
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.filter.CharacterEncodingFilter;

@ExtendWith(RestDocumentationExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class CabinetControllerTest {

	@Autowired
	MockMvc mockMvc;

	private final String URL_PREFIX = "/api/cabinets";
	private final String DOCUMENT_NAME = "Cabinet/{ClassName}/{methodName}";

	@Autowired
	JwtProperties jwtProperties;

	String userToken;
	Cookie cookie;

	@BeforeEach
	void setUp(WebApplicationContext webApplicationContext,
			RestDocumentationContextProvider restDocumentation) {
		this.mockMvc = MockMvcBuilders
				.webAppContextSetup(webApplicationContext)
				.addFilters(new CharacterEncodingFilter("UTF-8", true))
				.apply(documentationConfiguration(restDocumentation))
				.build();
		setToken();
	}

	void setToken() {
		userToken = TestControllerUtils.getTestUserToken(jwtProperties.getSigningKey());
		cookie = TestControllerUtils.getTokenCookie("사용자", userToken);
	}

	@Nested
	@DisplayName("건물 층 정보 가져오기")
	class Floors {

		private final String url = URL_PREFIX + "/buildings/floors";

		@DisplayName("정상 입력")
		@Test
		void ok() throws Exception {
			//항상 정상 입력
			mockMvc.perform(mockRequest(HttpMethod.GET, cookie,
							url))
					.andExpect(status().isOk())
					.andDo(document(DOCUMENT_NAME,
							responseFields(
									fieldWithPath("[].building").description("건물 이름").type(
											JsonFieldType.STRING),
									fieldWithPath("[].floors").description("층 들")
											.type(JsonFieldType.ARRAY)
							)));
		}
	}

	@Test
	void 구역별_사물함_가져오기() throws Exception {
		//정상 입력
		mockMvc.perform(mockRequest(HttpMethod.GET, cookie,
						"/api/cabinets/buildings/{building}/floors/{floor}",
						"새롬관", 2))
				.andExpect(status().isOk());

		//잘못된 입력
		mockMvc.perform(mockRequest(HttpMethod.GET, cookie,
						"/api/cabinets/buildings/{building}/floors/{floor}",
						42, "포티투"))
				.andExpect(status().isBadRequest());
	}


	@Nested
	@DisplayName("사물함 정보 가져오기")
	class CabinetInfo {

		private final String url = URL_PREFIX + "/{cabinetId}";

		@DisplayName("정상 입력")
		@Test
		void ok() throws Exception {
			mockMvc.perform(
							mockRequest(HttpMethod.GET, cookie, url, 1))
					.andExpect(status().isOk())
					.andDo(document(DOCUMENT_NAME,
							responseFields(
									fieldWithPath("lents").description("")
											.type(JsonFieldType.ARRAY),
									fieldWithPath("cabinetId").description("")
											.type(JsonFieldType.NUMBER),
									fieldWithPath("visibleNum").description("")
											.type(JsonFieldType.NUMBER),
									fieldWithPath("lentType").description("")
											.type(JsonFieldType.STRING),
									fieldWithPath("maxUser").description("")
											.type(JsonFieldType.NUMBER),
									fieldWithPath("title").description("")
											.type(JsonFieldType.VARIES),
									fieldWithPath("status").description("")
											.type(JsonFieldType.STRING),
									fieldWithPath("building").description("")
											.type(JsonFieldType.STRING),
									fieldWithPath("floor").description("")
											.type(JsonFieldType.NUMBER),
									fieldWithPath("section").description("")
											.type(JsonFieldType.STRING)
							)));
		}

		@DisplayName("잘못된 입력")
		@Test
		void wrongPathParameter() throws Exception {
			mockMvc.perform(
							mockRequest(HttpMethod.GET, cookie, "/api/cabinets/{cabinetId}",
									"사십이"))
					.andExpect(status().isBadRequest())
					.andDo(document(DOCUMENT_NAME));

		}
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
		mockMvc.perform(mockRequest(HttpMethod.PATCH, cookie, "/api/cabinets/{cabinetId}/title", 1)
						.contentType("application/json")
						.content(rightRequestBody))
				.andExpect(status().isOk());

		//잘못된 입력
		mockMvc.perform(mockRequest(HttpMethod.PATCH, cookie, "/api/cabinets/{cabinetId}/title", 1)
						.contentType("application/json")
						.content(wrongRequestBody))
				.andExpect(status().isBadRequest());

		//빈 입력
		mockMvc.perform(mockRequest(HttpMethod.PATCH, cookie, "/api/cabinets/{cabinetId}/title", 1)
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
		mockMvc.perform(mockRequest(HttpMethod.PATCH, cookie, "/api/cabinets/{cabinetId}/memo", 1)
						.contentType("application/json")
						.content(rightRequestBody))
				.andExpect(status().isOk());

		//잘못된 입력
		mockMvc.perform(mockRequest(HttpMethod.PATCH, cookie, "/api/cabinets/{cabinetId}/memo", 1)
						.contentType("application/json")
						.content(wrongRequestBody))
				.andExpect(status().isBadRequest());

		//빈 입력
		mockMvc.perform(mockRequest(HttpMethod.PATCH, cookie, "/api/cabinets/{cabinetId}/memo", 1)
						.contentType("application/json")
						.content(emptyRequestBody))
				.andExpect(status().isBadRequest());
	}
}
