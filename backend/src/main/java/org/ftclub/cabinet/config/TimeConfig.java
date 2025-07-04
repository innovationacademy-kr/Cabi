package org.ftclub.cabinet.config;

import java.time.Clock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TimeConfig {

	@Bean
	public Clock clock() {
		// 시스템의 기본 시간대를 사용하여 Clock을 생성합니다.
		return Clock.systemDefaultZone();
	}
}
