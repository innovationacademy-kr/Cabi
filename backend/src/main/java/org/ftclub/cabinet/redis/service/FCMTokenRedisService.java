package org.ftclub.cabinet.redis.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Duration;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class FCMTokenRedisService implements RedisService {

	private static final String KEY_PREFIX = "cabinet-fcm-token:";

	private final StringRedisTemplate redisTemplate;
	private final ObjectMapper objectMapper;


	/**
	 * @param key  조회할 키
	 * @param type 조회할 값의 타입
	 * @return 조회된 값
	 */
	@Override
	public <T> Optional<T> findByKey(String key, Class<T> type) {
		String serializedValue = redisTemplate.opsForValue().get(KEY_PREFIX + key);
		if (serializedValue == null) {
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
	@Override
	public <T> void save(String key, T data, Duration duration) {
		try {
			String serializedValue = objectMapper.writeValueAsString(data);
			redisTemplate.opsForValue().set(KEY_PREFIX + key, serializedValue, duration);
		} catch (Exception e) {
			log.error("Redis save error", e);
		}
	}

	/**
	 * @param key 삭제할 키
	 */
	@Override
	public boolean delete(String key) {
		return Boolean.TRUE.equals(redisTemplate.delete(KEY_PREFIX + key));
	}
}