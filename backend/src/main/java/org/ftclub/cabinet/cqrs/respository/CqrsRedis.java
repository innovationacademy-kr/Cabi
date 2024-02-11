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

	/**
	 * JSON 문자열을 DTO로 변환한다.
	 *
	 * @param value         변환할 JSON 문자열
	 * @param typeReference DTO 변환을 위한 제네릭 타입 레퍼런스
	 * @param <T>           반환하는 제네릭 타입
	 * @return 변환된 DTO
	 */
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

	/**
	 * DTO를 JSON 문자열로 변환한다.
	 *
	 * @param dto 변환할 DTO
	 * @param <T> DTO의 제네릭 타입
	 * @return 변환된 JSON 문자열
	 */
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

	/**
	 * key에 해당하는 데이터를 삭제한다.
	 *
	 * @param key Redis key
	 */
	public void clear(String key) {
		redisTemplate.delete(key);
	}

	/**
	 * key에 해당하는 hash의 subKey에 해당하는 데이터를 삭제한다.
	 *
	 * @param key    Redis key
	 * @param subKey Redis subKey
	 */
	public void clearHash(String key, String subKey) {
		hashTemplate.delete(key, subKey);
	}

	/**
	 * suffix로 끝나는 key에 해당하는 데이터를 삭제한다.
	 * <p>
	 * Redis Scan을 통해 조회하여 삭제한다.
	 * </p>
	 *
	 * @param suffix 삭제할 key의 suffix
	 */
	public void clearBySuffix(String suffix) {
		ScanOptions options =
				ScanOptions.scanOptions().match("*" + suffix).count(200).build();
		Cursor<byte[]> keys = connection.scan(options);
		while (keys.hasNext()) {
			String key = new String(keys.next());
			redisTemplate.delete(key);
		}
	}

	/**
	 * key에 해당하는 데이터를 조회하여 제네릭 타입으로 반환한다.
	 *
	 * @param key           Redis key
	 * @param typeReference DTO 변환을 위한 제네릭 타입 레퍼런스
	 * @param <T>           반환하는 제네릭 타입
	 * @return 조회 후 변환된 DTO 객체
	 */
	public <T> T get(String key, TypeReference<T> typeReference) {
		String value = valueTemplate.get(key);
		return stringToDto(value, typeReference);
	}

	/**
	 * key에 해당하는 hash의 subKey에 해당하는 데이터를 조회하여 제네릭 타입으로 반환한다.
	 *
	 * @param key           Redis key
	 * @param subKey        Redis subKey
	 * @param typeReference DTO 변환을 위한 제네릭 타입 레퍼런스
	 * @param <T>           반환하는 제네릭 타입
	 * @return 조회 후 변환된 DTO 객체
	 */
	public <T> T getHash(String key, String subKey, TypeReference<T> typeReference) {
		return stringToDto(hashTemplate.get(key, subKey), typeReference);
	}

	/**
	 * key에 해당하는 hash의 모든 entry를 조회하여 제네릭 타입 Map으로 반환한다.
	 * <p>
	 * 반환하는 Map의 key와 value 모두 제네릭 타입으로 반환한다.
	 * </p>
	 *
	 * @param key                Redis key
	 * @param keyTypeReference   DTO 변환을 위한 key의 제네릭 타입 레퍼런스
	 * @param valueTypeReference DTO 변환을 위한 value의 제네릭 타입 레퍼런스
	 * @param <K>                key의 제네릭 타입
	 * @param <V>                value의 제네릭 타입
	 * @return Map<K, V>
	 */
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

	/**
	 * key에 해당하는 hash의 모든 entry를 조회하여 제네릭 타입 Map으로 반환한다.
	 * <p>
	 * 반환하는 Map의 value만 제네릭 타입으로 반환하고 key 타입은 조회한 String 그대로 반환한다.
	 * </p>
	 *
	 * @param key           Redis key
	 * @param typeReference DTO 변환을 위한 key의 제네릭 타입 레퍼런스
	 * @param <T>           value의 제네릭 타입
	 * @return Map<K, V>
	 */
	public <T> Map<String, T> getHashEntries(String key, TypeReference<T> typeReference) {
		Map<String, String> entries = hashTemplate.entries(key);
		Map<String, T> result = new HashMap<>();
		for (Map.Entry<String, String> entry : entries.entrySet()) {
			result.put(entry.getKey(), this.stringToDto(entry.getValue(), typeReference));
		}
		return result;
	}

	/**
	 * key에 해당하는 데이터를 저장한다.
	 *
	 * @param key   Redis key
	 * @param value 저장할 DTO 객체
	 * @param <T>   DTO의 제네릭 타입
	 */
	public <T> void set(String key, T value) {
		redisTemplate.opsForValue().set(key, dtoToString(value));
	}

	/**
	 * key에 해당하는 hash의 subKey에 해당하는 데이터를 저장한다.
	 *
	 * @param key    Redis key
	 * @param subKey Redis subKey
	 * @param value  저장할 DTO 객체
	 */
	public <T> void setHash(String key, String subKey, T value) {
		hashTemplate.put(key, subKey, dtoToString(value));
	}
}
