package org.ftclub.cabinet.alarm.fcm.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Duration;
import java.util.Objects;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class FCMTokenRedis {

	private static final String KEY_PREFIX = ":cabinetFcmToken";

	private final StringRedisTemplate redisTemplate;
	private final ObjectMapper objectMapper;


	/**
	 * @param key  조회할 키
	 * @param type 조회할 값의 타입
	 * @return 조회된 값
	 */
	public <T> Optional<T> findByKey(String key, Class<T> type) {
		String serializedValue = redisTemplate.opsForValue().get(key + KEY_PREFIX);
		final String NULL = "null";
		if (Objects.isNull(serializedValue) || serializedValue.equals(NULL)) {
			return Optional.empty();
		}
		try {
			return Optional.of(objectMapper.readValue(serializedValue, type));
		} catch (Exception e) {
			log.error("Redis findByKey error", e);
		}
		return Optional.empty();
	}

	/**
	 * @param key      저장할 키
	 * @param data     저장할 값
	 * @param duration 저장할 기간
	 */
	public <T> void save(String key, T data, Duration duration) {
		try {
			String serializedValue = objectMapper.writeValueAsString(data);
			redisTemplate.opsForValue().set(key + KEY_PREFIX, serializedValue, duration);
		} catch (Exception e) {
			log.error("Redis save error", e);
		}
	}

	/**
	 * @param key 삭제할 키
	 */
	public boolean delete(String key) {
		return Boolean.TRUE.equals(redisTemplate.delete(key + KEY_PREFIX));
	}
}
