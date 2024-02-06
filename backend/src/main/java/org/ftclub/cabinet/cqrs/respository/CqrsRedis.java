package org.ftclub.cabinet.cqrs.respository;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
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

@Slf4j
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

	private <T> T stringToDto(String value, TypeReference<T> typeReference) {

		if (value == null) {
			return null;
		}
		try {
			return objectMapper.readValue(value, typeReference);
		} catch (JsonProcessingException e) {
			log.error("String to JSON Parse Error : {}, {}", value, e.toString());
			throw ExceptionStatus.INTERNAL_SERVER_ERROR.asDomainException();
		}
	}

	private <T> String dtoToString(T dto) {
		if (dto == null) {
			return null;
		}
		try {
			return objectMapper.writeValueAsString(dto);
		} catch (JsonProcessingException e) {
			log.error("DTO to String Parse Error : {}, {}", dto, e.toString());
			throw ExceptionStatus.INTERNAL_SERVER_ERROR.asDomainException();
		}
	}

	public void clear(String key) {
		redisTemplate.delete(key);
	}

	public void clearHash(String key, String subKey) {
		hashTemplate.delete(key, subKey);
	}

	public void clearBySuffix(String suffix) {
		ScanOptions options =
				ScanOptions.scanOptions().match("*" + suffix).count(200).build();
		Cursor<byte[]> keys = connection.scan(options);
		while (keys.hasNext()) {
			String key = new String(keys.next());
			redisTemplate.delete(key);
		}
	}

	public <T> T get(String key, TypeReference<T> typeReference) {
		String value = valueTemplate.get(key);
		return stringToDto(value, typeReference);
	}

	public <T> T getHash(String key, String subKey, TypeReference<T> typeReference) {
		return stringToDto(hashTemplate.get(key, subKey), typeReference);
	}

	public <K, V> Map<K, V> getHashEntries(String key, TypeReference<K> keyTypeReference,
			TypeReference<V> valueTypeReference) {
		Map<String, String> entries = hashTemplate.entries(key);
		Map<K, V> result = new HashMap<>();
		for (Map.Entry<String, String> entry : entries.entrySet()) {
			result.put(this.stringToDto(entry.getKey(), keyTypeReference),
					this.stringToDto(entry.getValue(), valueTypeReference));
		}
		return result;
	}

	public <T> void set(String key, T value) {
		redisTemplate.opsForValue().set(key, dtoToString(value));
	}

	public void setHash(String key, String subKey, Object value) {
		hashTemplate.put(key, subKey, dtoToString(value));
	}
}
