package org.ftclub.cabinet.cqrs.respository;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;

@Component
@Logging(level = LogLevel.DEBUG)
//@RequiredArgsConstructor
public class CqrsRedis {

	private final RedisTemplate<String, String> redisTemplate; //조금 더 많은 기능을 지원
	private final HashOperations<String, String, String> hashTemplate;
	private final ValueOperations<String, String> valueTemplate;

	private final ObjectMapper objectMapper;

	@Autowired
	public CqrsRedis(RedisTemplate<String, String> redisTemplate,
			RedisTemplate<String, String> hashTemplate,
			RedisTemplate<String, String> valueTemplate,
			ObjectMapper objectMapper) {
		this.redisTemplate = redisTemplate;
		this.hashTemplate = hashTemplate.opsForHash();
		this.valueTemplate = valueTemplate.opsForValue();
		this.objectMapper = objectMapper;
	}


}
