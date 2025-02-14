package org.ftclub.cabinet.auth.security;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.ftclub.cabinet.config.security.JwtAuthenticationFilter;
import org.ftclub.cabinet.exception.CustomAuthenticationException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpHeaders;
import org.springframework.test.util.ReflectionTestUtils;

public class JwtAuthenticationFilterTest {

	private final String secretKey = "verysecretkeyverysecretkeyverysecretkey";
	@InjectMocks
	private JwtAuthenticationFilter jwtFilter;
	@Mock
	private HttpServletRequest request;
	@Mock
	private HttpServletResponse response;
	@Mock
	private FilterChain filterChain;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
		ReflectionTestUtils.setField(jwtFilter, "secretKey", secretKey);
	}

	@Test
	@DisplayName("토큰 정상 추출")
	void extractToken() {
		String token = "Bearer validTokenString~";
		when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(token);

		assertDoesNotThrow(() -> jwtFilter.doFilter(request, response, filterChain));
	}

	@Test
	@DisplayName("헤더가 존재하지 않는 경우, 예외가 발생한다.")
	void extractTokenNoToken() {
		when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(null);

		CustomAuthenticationException exception = assertThrows(
				CustomAuthenticationException.class,
				() -> jwtFilter.doFilter(request, response, filterChain)
		);

		assertEquals(ExceptionStatus.JWT_TOKEN_NOT_FOUND, exception.getStatus());
	}


}
