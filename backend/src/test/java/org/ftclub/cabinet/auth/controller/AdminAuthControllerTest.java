package org.ftclub.cabinet.auth.controller;

import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.documentationConfiguration;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.get;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.requestParameters;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.restdocs.RestDocumentationContextProvider;
import org.springframework.restdocs.RestDocumentationExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.filter.CharacterEncodingFilter;

@ExtendWith(RestDocumentationExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
public class AdminAuthControllerTest {

	@Autowired
	MockMvc mockMvc;
	private final String URL_PREFIX = "/api/admin/auth";
	private final String DOCUMENT_NAME = "AdminAuth/{ClassName}/{methodName}";

	@BeforeEach
	void setUp(WebApplicationContext webApplicationContext,
			RestDocumentationContextProvider restDocumentation) {
		this.mockMvc = MockMvcBuilders
				.webAppContextSetup(webApplicationContext)
				.addFilters(new CharacterEncodingFilter("UTF-8", true))
				.apply(documentationConfiguration(restDocumentation))
				.build();
	}

	@Nested
	@DisplayName("어드민 로그인")
	class Login {

		private final String url = URL_PREFIX + "/login";

		@DisplayName("어드민 로그인 요청")
		@Test
		void ok() throws Exception {
			mockMvc.perform(get(url))
					.andExpect(status().isFound())
					.andDo(document(DOCUMENT_NAME));
		}
	}

	@Nested
	@DisplayName("어드민 로그인 콜백")
	class LoginCallback {

		private final String url = URL_PREFIX + "/login/callback?code={code}";

		@DisplayName("어드민 로그인 콜백 요청")
		@Test
		void ok() throws Exception {
			//valid한 코드는 알 수 없음
			String inValidCode = "thisMustBeBadGateWayBecauseOfInvalidCode";

			mockMvc.perform(get(url, inValidCode))
					.andExpect(status().isBadGateway())
					.andDo(document(DOCUMENT_NAME, requestParameters(
							parameterWithName("code").description("로그인 콜백 코드")
					)));
		}
	}
}
