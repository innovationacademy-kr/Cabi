package org.ftclub.cabinet.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.time.LocalDateTime;

/**
 * Jackson 설정 클래스입니다.
 */
@Configuration
@RequiredArgsConstructor
public class JacksonConfig {
	private final ObjectMapper objectMapper;

	/**
	 * LocalDateTime을 직렬화/역직렬화할 수 있도록 설정합니다.
	 */
	@PostConstruct
	public void postConstruct() {
		JavaTimeModule javaTimeModule = new JavaTimeModule();
		javaTimeModule.addSerializer(LocalDateTime.class, LocalDateTimeSerializer.INSTANCE);
		javaTimeModule.addDeserializer(LocalDateTime.class, LocalDateTimeDeserializer.INSTANCE);
		objectMapper.registerModule(javaTimeModule);
	}
}

