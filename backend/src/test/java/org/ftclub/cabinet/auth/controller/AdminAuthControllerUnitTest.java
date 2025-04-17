package org.ftclub.cabinet.auth.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.ftclub.cabinet.config.MasterProperties;
import org.ftclub.cabinet.dto.MasterLoginDto;
import org.ftclub.testutils.TestMockApplier;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
public class AdminAuthControllerUnitTest {

	static final String URL_PREFIX = "/v4/admin/auth";
	@Autowired
	MockMvc mockMvc;
	@Autowired
	MasterProperties masterProperties;
	@Autowired
	ObjectMapper objectMapper;

	@Nested
	@DisplayName("/login")
	class Login {

		static final String url = URL_PREFIX + "/login";
		MasterLoginDto commonDto;
		MasterLoginDto invalidDto;

		@BeforeEach
		void setUp() {
			commonDto = new MasterLoginDto(masterProperties.getId(),
					masterProperties.getPassword());
			invalidDto = new MasterLoginDto("invalidId", "invalidPassword");
		}

		@DisplayName("어드민 로그인 요청")
		@Test
		void adminOk() throws Exception {
			mockMvc.perform(get(url))
					.andExpect(status().isFound());
		}

		@DisplayName("최고 관리자 로그인 요청 성공")
		@Test
		@Disabled
		void masterOk() throws Exception {
			mockMvc.perform(TestMockApplier
							.apply(post(url), objectMapper)
							.setJsonContent(commonDto)
							.end())
					.andExpect(status().isOk());

		}

		@DisplayName("최고 관리자 로그인 요청 dto 빈 값")
		@Test
		void masterEmptyDto() throws Exception {
			mockMvc.perform(post(url))
					.andExpect(status().isBadRequest());
		}

		@DisplayName("최고 관리자 로그인 요청 실패")
		@Test
		void masterInvalidDto() throws Exception {
			mockMvc.perform(TestMockApplier
							.apply(post(url), objectMapper)
							.setJsonContent(invalidDto)
							.end())
					.andExpect(status().isUnauthorized());
		}
	}

	//	@Nested
//	@DisplayName("/login/callback")
//	class LoginCallback {
//
//		static final String url = URL_PREFIX + "/login/callback";
//		String invalidCode = "thisMustBeBadGateWayBecauseOfInvalidCode";
//		// valid한 코드는 알 수 없음
//
//		@DisplayName("어드민 로그인 콜백 실패")
//		@Test
//		void wrongCode() throws Exception {
//			mockMvc.perform(get(url)
//							.queryParam("code", invalidCode))
//					.andExpect(status().isBadGateway())
//					.andDo(document(DOCUMENT_NAME, requestParameters(
//							parameterWithName("code").description("콜백 코드"))));
//		}
//	}
	@Nested
	@DisplayName("/logout")
	class Logout {


		@Test
		@DisplayName("어드민 로그아웃 요청")
		@WithMockUser
		void adminLogoutOk() throws Exception {

			mockMvc.perform(get("/v4/auth/logout"))
					.andExpect(status().isOk());

		}
	}
}
