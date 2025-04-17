package org.ftclub.cabinet.auth.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;
import org.ftclub.cabinet.security.SecurityConfig;
import org.ftclub.cabinet.security.handler.CustomOAuth2UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("local")

@Import(SecurityConfig.class)
public class AuthLoginTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private CustomOAuth2UserService customOAuth2UserService;

	@Test
	@DisplayName("FT oauth2 로그인 시 loadUser를 수행한다")
	void testFtOauth2SignupAndLogin() throws Exception {
		OAuth2User ftOauthUser = new DefaultOAuth2User(
				Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
				Map.of(
						"login", "sohyupar",
						"email", "sohyupar@ft.com",
						"roles", "USER",
						"blackholedAt", LocalDateTime.now()),
				"login"
		);

		when(customOAuth2UserService.loadUser(any())).thenReturn(ftOauthUser);

		mockMvc.perform(MockMvcRequestBuilders.get("/login/oauth2/code/ft")
						.with(SecurityMockMvcRequestPostProcessors.oauth2Login()))
				.andExpect(status().is3xxRedirection());
	}

}
