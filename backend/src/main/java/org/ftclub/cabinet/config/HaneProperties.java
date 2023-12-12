package org.ftclub.cabinet.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class HaneProperties {
	private static final int SIXTY = 60;

	@Value("${cabinet.hane.token}")
	private String jwtToken;

	@Value("${cabinet.hane.url}")
	private String url;

	@Value("${cabinet.hane.limit-hours}")
	private int limitHours;

	public int getLimitTimeSeconds() {
		return limitHours * SIXTY * SIXTY;
	}
}
