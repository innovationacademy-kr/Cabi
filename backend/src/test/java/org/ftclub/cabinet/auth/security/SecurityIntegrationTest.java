package org.ftclub.cabinet.auth.security;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.ftclub.cabinet.config.security.JwtTokenProvider;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Security Config 통합 테스트
 * <p>
 * 실제 OAuth2 환경을 구성하지 않고, 엔드포인트별 접근 권한을 확인한다.
 */
@SpringBootTest
@AutoConfigureMockMvc
public class SecurityIntegrationTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private JwtTokenProvider tokenProvider;

	// 공개된 EndPoint 가 없다..;;
//	@Test
//	@DisplayName("허용된 엔드포인트에 인증 없이 접근 가능")
//	void accessPublicEndpointWithoutAuthentication() throws Exception {
//		mockMvc.perform(get("/actuator"))
//				.andExpect(status().isOk());
//	}

	@Test
	@DisplayName("보호된 리소스에 인증 없이 접근 불가 - 인가 없음 401")
	void accessProtectedEndpointsWithoutAuthentication() throws Exception {
		mockMvc.perform(get("/v5/presentation/able-date"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	@DisplayName("USER의 보호된 리소스 접근")
	@WithMockUser(roles = "USER")
	void accessProtectedEndpointsWithUserAuthentication() throws Exception {
		mockMvc.perform(get("/v5/presentation/able-date"))
				.andExpect(status().isOk());
	}

	@Test
	@DisplayName("USER권한 유저는 ADMIN 리소스 접근 불가 - 인가 다름 403")
	@WithMockUser(roles = "USER")
	void authenticationUserCallProtectedApi() throws Exception {
		mockMvc.perform(get("/v4/admin/clubs/"))
				.andExpect(status().isForbidden());
	}

	@Test
	@DisplayName("ADMIN 리소스 접근")
	@WithMockUser(roles = "ADMIN")
	void accessEndPointWithAdminAuthentication() throws Exception {
		mockMvc.perform(get("/v5/admin/items"))
				.andExpect(status().isOk());
	}
}
