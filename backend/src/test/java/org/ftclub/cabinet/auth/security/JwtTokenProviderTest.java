package org.ftclub.cabinet.auth.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
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
import org.ftclub.cabinet.config.security.JwtTokenProvider;
import org.ftclub.cabinet.config.security.TokenDto;
import org.ftclub.cabinet.exception.CustomAuthenticationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
public class JwtTokenProviderTest {

	@InjectMocks
	private JwtTokenProvider jwtTokenProvider;
	private String secretKey;

	@BeforeEach
	void setUp() {
		secretKey = "testSecretKeytestSecretKeytestSecretKeytestSecretKey";
		ReflectionTestUtils.setField(jwtTokenProvider, "secretKey", secretKey);
		ReflectionTestUtils.setField(jwtTokenProvider, "signingKey",
				Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8)));
		ReflectionTestUtils.setField(jwtTokenProvider, "accessTokenValidMillisecond", 1L);
	}

	@Test
	@DisplayName("유효한 토큰에 대한 claims 변환")
	void parseValidToken() {
		String jwt = createValidToken();

		Claims claims = jwtTokenProvider.parseToken(jwt);

		assertThat(claims.getSubject()).isEqualTo("1");
		assertThat(claims.get("roles", String.class)).isEqualTo("USER");
	}

	@Test
	@DisplayName("토큰 생성 및 파싱 일치 테스트")
	void extractValidToken() {
		Long userId = 1L;
		String roles = "USER";

		TokenDto tokenDto = jwtTokenProvider.createTokenDto(userId, roles);
		Claims claims = jwtTokenProvider.parseToken(tokenDto.getAccessToken());

		assertEquals(String.valueOf(userId), claims.getSubject());
		assertEquals(roles, claims.get("roles"));
	}

	@Test
	@DisplayName("만료 시 예외 발생")
	void expiredToken() throws InterruptedException {

		// given, refreshToken 유효기한을 1ms로 설정한다.
		Long userID = 123L;
		String roles = "USER";
		TokenDto tokenDto = jwtTokenProvider.createTokenDto(userID, roles);

		Thread.sleep(10);

		// when & then
		assertThrows(ExpiredJwtException.class, () -> {
			jwtTokenProvider.parseToken(tokenDto.getAccessToken());
		});
	}

	@Test
	@DisplayName("조작된 토큰 예외 발생")
	void invalidToken() {
		String invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fakePayload.signature"; // 임의로 조작된 토큰

		assertThrows(JwtException.class, () -> {
			jwtTokenProvider.parseToken(invalidToken);
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
	@DisplayName("Bearer로 시작 안함")
	void extractTokenWithoutBearer() {
		HttpServletRequest request = mock(HttpServletRequest.class);
		when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("invalidToken");

		assertThrows(CustomAuthenticationException.class, () -> {
			jwtTokenProvider.extractToken(request);
		});
	}

	@Test
	@DisplayName("Authorization 헤더 없음")
	void extractTokenWithoutAuthorizationHeader() {
		HttpServletRequest request = mock(HttpServletRequest.class);
		when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(null);

		assertThrows(CustomAuthenticationException.class, () -> {
			jwtTokenProvider.extractToken(request);
		});
	}

	private String createValidToken() {
		SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));

		return Jwts.builder()
				.setSubject("1")
				.claim("roles", "USER")
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + 60000))
				.signWith(key, SignatureAlgorithm.HS256)
				.compact();

	}
}
