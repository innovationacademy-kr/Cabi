package org.ftclub.cabinet.config.security;

import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Duration;
import javax.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * yml 파일 내의 값을 바인딩합니다.
 */
@Slf4j
@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "cabinet.jwt")
public class JwtTokenProperties {

	private Key signingKey;
	private String jwtSecretKey;
	private Duration accessExpiry;
	private Duration refreshExpiry;
	private String mainProvider;
	private String googleProvider;

	@PostConstruct
	public void init() {
		this.signingKey = Keys.hmacShaKeyFor(jwtSecretKey.getBytes(StandardCharsets.UTF_8));
	}

	public Long getAccessExpiryMillis() {
		return accessExpiry.toMillis();
	}

	public Long getRefreshExpiryMillis() {
		return refreshExpiry.toMillis();
	}

	public int getAccessExpirySeconds() {
		return (int) accessExpiry.toSeconds();
	}

	public int getRefreshExpirySeconds() {
		return (int) refreshExpiry.toSeconds();
	}
}
