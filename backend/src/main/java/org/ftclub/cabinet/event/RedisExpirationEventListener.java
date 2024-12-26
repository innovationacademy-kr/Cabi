package org.ftclub.cabinet.event;

import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.lent.service.LentFacadeService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.listener.KeyExpirationEventMessageListener;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Component;


@Component
@Log4j2
public class RedisExpirationEventListener extends KeyExpirationEventMessageListener {

	private final LentFacadeService lentFacadeService;

	/**
	 * Creates new {@link MessageListener} for {@code __keyevent@*__:expired} messages.
	 *
	 * @param listenerContainer must not be {@literal null}.
	 * @param lentFacadeService must not be {@literal null}.
	 */
	public RedisExpirationEventListener(
			@Qualifier("redisMessageListenerContainer")
			RedisMessageListenerContainer listenerContainer,
			LentFacadeService lentFacadeService) {
		super(listenerContainer);
		this.lentFacadeService = lentFacadeService;
	}

	/**
	 * @param message redis key
	 * @param pattern __keyevent@*__:expired
	 */
	@Override
	public void onMessage(Message message, byte[] pattern) {
		log.debug("Called onMessage: {}, {}", message.toString(), pattern);
		String[] messageParseArray = message.toString().split(":");
		if (messageParseArray[1] != null && messageParseArray[1].equals("shadow")) {
			String cabinetIdString = messageParseArray[0];
			lentFacadeService.shareCabinetSessionExpired(Long.valueOf(cabinetIdString));
		}
	}
}
