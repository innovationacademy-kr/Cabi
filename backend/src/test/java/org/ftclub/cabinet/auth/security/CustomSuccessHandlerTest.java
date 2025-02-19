package org.ftclub.cabinet.auth.security;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.ftclub.cabinet.config.security.CustomOauth2User;
import org.ftclub.cabinet.config.security.CustomSuccessHandler;
import org.ftclub.cabinet.config.security.JwtTokenProvider;
import org.ftclub.cabinet.config.security.OauthService;
import org.ftclub.cabinet.config.security.TokenDto;
import org.ftclub.cabinet.exception.CustomAuthenticationException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.SpringSecurityException;
import org.ftclub.cabinet.user.domain.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles(value = "local")
public class CustomSuccessHandlerTest {

	private final String google_provider = "google";
	private final String ft_provider = "ft";
	private final User user = User.of("sohyupar", "sohyupar@test.com", null, "USER");
	@InjectMocks
	private CustomSuccessHandler customSuccessHandler;

	@Mock
	private OauthService oauthService;
	@Mock
	private JwtTokenProvider tokenProvider;
	@Mock
	private ObjectMapper objectMapper;
	@Mock
	private HttpServletRequest request;
	@Mock
	private HttpServletResponse response;
	@Mock
	private Authentication authentication;
	@Mock
	private CustomOauth2User customOauth2User;
	@Mock
	private PrintWriter printWriter;

	/**
	 * SpringBoot Test로 진행하지 않았으므로, Value 값을 강제주입
	 */
	@BeforeEach
	void setUp() throws IOException {

		when(authentication.getPrincipal()).thenReturn(customOauth2User);
		when(customOauth2User.getAttributes()).thenReturn(Map.of("email", "sohyupar@test.com"));

		ReflectionTestUtils.setField(customSuccessHandler, "googleProvider", "google");
		ReflectionTestUtils.setField(customSuccessHandler, "ftProvider", "ft");
		ReflectionTestUtils.setField(user, "id", 1L);
	}

	@Test
	@DisplayName("authentication 예외가 발생하지 않는 경우, 토큰을 발급한다.")
	void registerUser() throws ServletException, IOException {
		// given

		when(customOauth2User.getProvider()).thenReturn(ft_provider);
		when(oauthService.handleFtLogin(any())).thenReturn(user);
		when(response.getWriter()).thenReturn(printWriter);
		doReturn(new TokenDto("mock-access-token", "mock-refresh-token"))
				.when(tokenProvider).createTokenDto(anyLong(), any());

		//when
		customSuccessHandler.onAuthenticationSuccess(request, response, authentication);

		verify(tokenProvider, times(1)).createTokenDto(anyLong(), anyString());
	}

	@Test
	@DisplayName("google oauth 로그인 시도 시, ft oauth 에 로그인 상태가 아니라면 에러를 반환한다.")
	void onAuthenticationSuccess_invalid_oauth_type()
			throws ServletException, IOException {

		//given -> 이전 로그인 상태가 ft가 아닌 google
		when(customOauth2User.getProvider()).thenReturn(google_provider);
		when(oauthService.handleGoogleLogin(any(), any(CustomOauth2User.class)))
				.thenThrow(ExceptionStatus.NOT_FT_LOGIN_STATUS.asSpringSecurityException());

		assertThatThrownBy(() ->
				customSuccessHandler.onAuthenticationSuccess(request, response, authentication))
				.isInstanceOf(SpringSecurityException.class)
				.hasMessage(ExceptionStatus.NOT_FT_LOGIN_STATUS.getMessage());

		// 예외 발생 시, 아래의 서비스는 작동하지 않아야 한다.
		verify(response, times(0)).setContentType(MediaType.APPLICATION_JSON_VALUE);
		verify(response, times(0)).setCharacterEncoding("UTF-8");
		verify(response, times(0)).addCookie(any(Cookie.class));
		verify(tokenProvider, times(0)).createTokenDto(anyLong(), anyString(), anyString());
	}

	@Test
	@DisplayName("지원하지 않는 provider일 경우 예외를 반환한다")
	void unsupportedProvider() {

		// given
		when(customOauth2User.getProvider()).thenReturn("naver");

		// when & then
		assertThrows(CustomAuthenticationException.class,
				() -> customSuccessHandler.onAuthenticationSuccess(request, response,
						authentication));
	}
}
