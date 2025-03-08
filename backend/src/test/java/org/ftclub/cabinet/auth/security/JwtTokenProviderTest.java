package org.ftclub.cabinet.auth.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import javax.servlet.http.HttpServletRequest;
import org.ftclub.cabinet.auth.domain.CookieManager;
import org.ftclub.cabinet.jwt.domain.JwtTokenConstants;
import org.ftclub.cabinet.jwt.domain.JwtTokenProperties;
import org.ftclub.cabinet.jwt.service.JwtTokenProvider;
import org.ftclub.cabinet.dto.TokenDto;
import org.ftclub.cabinet.jwt.service.JwtRedisService;
import org.ftclub.cabinet.user.service.UserQueryService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;

@ExtendWith(MockitoExtension.class)
public class JwtTokenProviderTest {

	private final String secretKey = "testSecretKeytestSecretKeytestSecretKeytestSecretKey";
	private final SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
	@Mock
	private JwtTokenProperties tokenProperties;
	@Mock
	private UserQueryService userQueryService;
	@Mock
	private CookieManager cookieManager;
	@Mock
	private JwtRedisService jwtRedisService;
	@InjectMocks
	private JwtTokenProvider jwtTokenProvider;
	@Mock
	private HttpServletRequest request;

	@Test
	@DisplayName("유효한 토큰에 대한 claims 변환")
	void parseValidToken() {
		when(tokenProperties.getSigningKey()).thenReturn(key);
		String jwt = createValidToken();
		Claims claims = jwtTokenProvider.parseValidToken(jwt);

		assertThat(claims.getSubject()).isEqualTo("1");
		assertThat(claims.get("roles", String.class)).isEqualTo("USER");
	}

	@Test
	@DisplayName("토큰 생성 및 파싱 일치 테스트")
	void extractValidToken() {
		Long userId = 1L;
		String roles = "USER";

		when(tokenProperties.getAccessExpiryMillis()).thenReturn(360000L);
		when(tokenProperties.getRefreshExpiryMillis()).thenReturn(36000000L);
		when(tokenProperties.getSigningKey()).thenReturn(key);

		TokenDto tokenDto = jwtTokenProvider.createTokens(userId, roles, "ft");
		Claims claims = jwtTokenProvider.parseValidToken(tokenDto.getAccessToken());

		assertEquals(String.valueOf(userId), String.valueOf(claims.get(JwtTokenConstants.USER_ID)));
		assertEquals(roles, claims.get("roles"));
	}

	@Test
	@DisplayName("만료 시 예외 발생")
	void expiredToken() throws InterruptedException {

		// given, refreshToken 유효기한을 1ms로 설정한다.
		when(tokenProperties.getSigningKey()).thenReturn(key);
		when(tokenProperties.getAccessExpiryMillis()).thenReturn(1L);
		when(tokenProperties.getRefreshExpiryMillis()).thenReturn(36000000L);

		Long userID = 123L;
		String roles = "USER";
		TokenDto tokenDto = jwtTokenProvider.createTokens(userID, roles, "ft");

		Thread.sleep(10);

		// when & then
		assertThrows(ExpiredJwtException.class, () -> {
			jwtTokenProvider.parseValidToken(tokenDto.getAccessToken());
		});
	}

	@Test
	@DisplayName("조작된 토큰 예외 발생")
	void invalidToken() {
		String invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fakePayload.signature"; // 임의로 조작된 토큰

		when(tokenProperties.getSigningKey()).thenReturn(key);
		assertThrows(JwtException.class, () -> {
			jwtTokenProvider.parseValidToken(invalidToken);
		});
	}

	@Test
	@DisplayName("정상 토큰 추출 테스트")
	void testExtractToken() {
		HttpServletRequest request = mock(HttpServletRequest.class);
		when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("Bearer validToken~");

		String token = jwtTokenProvider.extractToken(request);
		assertEquals("validToken~", token);
	}

	@Test
	@DisplayName("Authorization 헤더 없음")
	void extractTokenWithoutAuthorizationHeader() {
		HttpServletRequest request = mock(HttpServletRequest.class);
		when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(null);

		assertNull(jwtTokenProvider.extractToken(request));

	}

	private String createValidToken() {

		return Jwts.builder()
				.setSubject("1")
				.claim("roles", "USER")
				.setIssuedAt(new Date())
				.setExpiration(new Date(new Date().getTime() + 36000000))
				.signWith(tokenProperties.getSigningKey(), SignatureAlgorithm.HS256)
				.compact();

	}
}
