package org.ftclub.cabinet.redis;

import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.lent.service.LentServiceImpl;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.listener.KeyExpirationEventMessageListener;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Component;


@Component
@Log4j2
public class ExpirationListener extends KeyExpirationEventMessageListener {

	private final LentServiceImpl lentServiceImpl;

	/**
	 * Creates new {@link MessageListener} for {@code __keyevent@*__:expired} messages.
	 *
	 * @param listenerContainer must not be {@literal null}.
	 * @param lentServiceImpl   must not be {@literal null}.
	 */
	public ExpirationListener(
			@Qualifier("redisMessageListenerContainer")
			RedisMessageListenerContainer listenerContainer,
			LentServiceImpl lentServiceImpl) {
		super(listenerContainer);
		this.lentServiceImpl = lentServiceImpl;
	}

	/**
	 * @param message redis key
	 * @param pattern __keyevent@*__:expired
	 */
	@Override
	public void onMessage(Message message, byte[] pattern) {
		log.debug("Called onMessage: {}, {}", message.toString(), pattern);
		String cabinetIdString = message.toString().split(":")[0];
		log.debug("cabinetIdWithSuffix: {}", cabinetIdString);
		lentServiceImpl.handleLentFromRedisExpired(cabinetIdString);
	}
}
