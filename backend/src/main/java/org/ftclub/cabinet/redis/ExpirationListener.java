package org.ftclub.cabinet.redis;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.KeyExpirationEventMessageListener;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Component;


@Component
public class ExpirationListener extends KeyExpirationEventMessageListener {

	@Autowired
	private RedisTemplate<String, Integer> valueRedisTemplate;

	/**
	 * Creates new {@link MessageListener} for {@code __keyevent@*__:expired} messages.
	 *
	 * @param listenerContainer must not be {@literal null}.
	 */
	public ExpirationListener(
			@Qualifier("redisMessageListenerContainer")
			RedisMessageListenerContainer listenerContainer) {
		super(listenerContainer);
	}

	/**
	 * @param message redis key
	 * @param pattern __keyevent@*__:expired
	 */
	@Override
	public void onMessage(Message message, byte[] pattern) {
		System.out.println("I'm shadow key");
		callCabinetSession(message.toString() + ":cabinet");
	}

	public void callCabinetSession(String key) {
		System.out.println(valueRedisTemplate.opsForHash().entries(key));
	}
}
