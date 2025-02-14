package org.ftclub.cabinet.auth.security;

import static org.assertj.core.api.Assertions.assertThat;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.ftclub.cabinet.config.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
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
	}

	@Test
	@DisplayName("유효한 토큰에 대한 claims 변환")
	void parseValidToken() {
		String jwt = createValidToken();

		Claims claims = jwtTokenProvider.parseToken(jwt);

		assertThat(claims.getSubject()).isEqualTo("1");
		assertThat(claims.get("roles", String.class)).isEqualTo("USER");
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
