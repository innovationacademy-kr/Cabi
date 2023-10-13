package org.ftclub.cabinet.redis.service;

import java.time.Duration;
import java.util.Optional;

public interface RedisService {

	<T> Optional<T> findByKey(String key, Class<T> type);

	<T> void save(String key, T data, Duration duration);

	boolean delete(String key);
}
