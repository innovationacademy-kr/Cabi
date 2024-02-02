package org.ftclub.cabinet.cqrs.respository;


import static org.ftclub.cabinet.cqrs.respository.CqrsSuffix.PENDING_CABINET;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.List;
import org.ftclub.cabinet.dto.CabinetPreviewDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;

@Component
@Logging(level = LogLevel.DEBUG)
public class CqrsRedis {

	private final RedisTemplate<String, String> redisTemplate; // expire 같은 조금 더 많은 기능을 지원
	private final HashOperations<String, String, String> hashTemplate; // hash 사용 가능
	private final ValueOperations<String, String> valueTemplate;
	private final RedisConnection connection;

	private final ObjectMapper objectMapper;

	@Autowired
	public CqrsRedis(RedisTemplate<String, String> redisTemplate,
			RedisTemplate<String, String> hashTemplate,
			RedisTemplate<String, String> valueTemplate,
			ObjectMapper objectMapper) {
		this.redisTemplate = redisTemplate;
		this.hashTemplate = hashTemplate.opsForHash();
		this.valueTemplate = valueTemplate.opsForValue();
		RedisConnectionFactory connectionFactory = redisTemplate.getConnectionFactory();
		if (connectionFactory == null) {
			throw ExceptionStatus.INTERNAL_SERVER_ERROR.asDomainException();
		}
		this.connection = connectionFactory.getConnection();
		this.objectMapper = objectMapper;
	}

	private void setHash(String key, String hashKey, Object value) {
		if (value == null) {
			return;
		}
		try {
			String json = objectMapper.writeValueAsString(value);
			hashTemplate.put(key, hashKey, json);
		} catch (JsonProcessingException e) {
			throw ExceptionStatus.INTERNAL_SERVER_ERROR.asDomainException();
		}
	}

	public <T> T getValue(String key) {
		String value = valueTemplate.get(key);
		if (value == null) {
			return null;
		}
		try {
			//@formatter:off
			return objectMapper.readValue(value, new TypeReference<T>() {});
			//@formatter:on
		} catch (JsonProcessingException e) {
			throw ExceptionStatus.INTERNAL_SERVER_ERROR.asDomainException();
		}
	}

	private void setValue(String key, Object value) {
		if (value == null) {
			return;
		}
		try {
			String json = objectMapper.writeValueAsString(value);
			valueTemplate.set(key, json);
		} catch (JsonProcessingException e) {
			throw ExceptionStatus.INTERNAL_SERVER_ERROR.asDomainException();
		}
	}

	public void clear(String key) {
		redisTemplate.delete(key);
	}

	public void clearHash(String key, String subKey) {
		hashTemplate.delete(key, subKey);
	}

	public void clearBySuffix(CqrsSuffix suffix) {
		ScanOptions options =
				ScanOptions.scanOptions().match("*:" + suffix).count(200).build();
		Cursor<byte[]> keys = connection.scan(options);
		while (keys.hasNext()) {
			byte[] key = keys.next();
			redisTemplate.delete(new String(key));
		}
	}

	public List<CabinetPreviewDto> getPendingCabinets(String floor) {
		List<CabinetPreviewDto> pendingCabinets = this.getValue(floor + PENDING_CABINET.getValue());
		if (pendingCabinets == null) {
			return new ArrayList<>();
		}
		return pendingCabinets;
	}

	public void setPendingCabinet(String floor, List<CabinetPreviewDto> pendingCabinets) {
		this.setValue(floor + PENDING_CABINET.getValue(), pendingCabinets);
	}
}
