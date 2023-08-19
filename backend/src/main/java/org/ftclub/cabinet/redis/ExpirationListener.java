package org.ftclub.cabinet.redis;

import java.util.Map;
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
	private RedisTemplate<String, Integer> redisTemplate;


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

//		System.out.println("########## onMessage pattern " + new String(pattern) + " | " + message.toString());

//		printExpiredKeyValue(message.toString());
		System.out.println("I'm shadow key");
//		System.out.println("message.toString() = " + message.toString());
		callCabinetSession(message.toString() + ":cabinet");
	}

	// 삭제된 키의 value를 출력하려고 해서 출력이 제대로 안 나옴
	public void printExpiredKeyValue(String key) {
//		System.out.println("########## printExpiredKeyValue " + key);
		final Map<Object, Object> entries =
				redisTemplate.opsForHash().entries(key);
		System.out.println(entries);
	}

	public void callCabinetSession(String key) {
		System.out.println(redisTemplate.opsForHash().entries(key));
	}
}
