package org.ftclub.cabinet.cqrs.respository;


import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;

@Logging(level = LogLevel.DEBUG)
@Component
public class CqrsRedis {

	private final RedisTemplate<String, String> redisTemplate; //조금 더 많은 기능을 지원
	private final HashOperations<String, String, String> hashTemplate;
	private final ValueOperations<String, String> valueTemplate;
	private final CqrsProperties cqrsProperties;

	@Autowired
	public CqrsRedis(RedisTemplate<String, String> redisTemplate,
			HashOperations<String, String, String> hashTemplate,
			ValueOperations<String, String> valueTemplate,
			CqrsProperties cqrsProperties) {
		this.redisTemplate = redisTemplate;
		this.hashTemplate = hashTemplate;
		this.valueTemplate = valueTemplate;
		this.cqrsProperties = cqrsProperties;
	}

}
