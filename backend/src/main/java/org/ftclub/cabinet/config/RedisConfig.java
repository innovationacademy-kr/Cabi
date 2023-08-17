package org.ftclub.cabinet.config;

import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.redis.ExpirationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;

@Slf4j
@Configuration
public class RedisConfig {

	private final String PATTERN = "__keyevent@*__:expired";

	@Bean
	public RedisMessageListenerContainer redisMessageListenerContainer(
			RedisConnectionFactory redisConnectionFactory, ExpirationListener expirationListener) {
		RedisMessageListenerContainer redisMessageListenerContainer = new RedisMessageListenerContainer();
		redisMessageListenerContainer.setConnectionFactory(redisConnectionFactory);
		redisMessageListenerContainer.addMessageListener(expirationListener,
				new PatternTopic(PATTERN));
		redisMessageListenerContainer.setErrorHandler(
				e -> log.error("There was an error in redis key expiration listener container", e));
		return redisMessageListenerContainer;
	}
}