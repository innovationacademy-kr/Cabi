package org.ftclub.cabinet.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class HaneProperties {

	@Value("${spring.hane.token}")
	private String jwtToken;

	@Value("${spring.hane.url}")
	private String url;

	@Value("${spring.hane.limit-time}")
	private int limit_time;
}
