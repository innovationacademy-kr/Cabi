package org.ftclub.cabinet.redis;

import java.time.LocalDateTime;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.repository.CabinetOptionalFetcher;
import org.ftclub.cabinet.config.CabinetProperties;
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

	private final CabinetOptionalFetcher cabinetOptionalFetcher;
	private final TicketingSharedCabinet ticketingSharedCabinet;
	private final LentServiceImpl lentServiceImpl;
	private final CabinetProperties cabinetProperties;

	/**
	 * Creates new {@link MessageListener} for {@code __keyevent@*__:expired} messages.
	 *
	 * @param listenerContainer      must not be {@literal null}.
	 * @param cabinetOptionalFetcher
	 * @param ticketingSharedCabinet
	 * @param lentServiceImpl
	 * @param cabinetProperties
	 */
	public ExpirationListener(
			@Qualifier("redisMessageListenerContainer")
			RedisMessageListenerContainer listenerContainer,
			CabinetOptionalFetcher cabinetOptionalFetcher,
			TicketingSharedCabinet ticketingSharedCabinet,
			LentServiceImpl lentServiceImpl,
			CabinetProperties cabinetProperties) {
		super(listenerContainer);
		this.cabinetOptionalFetcher = cabinetOptionalFetcher;
		this.ticketingSharedCabinet = ticketingSharedCabinet;
		this.lentServiceImpl = lentServiceImpl;
		this.cabinetProperties = cabinetProperties;
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
		Long cabinetId = Long.parseLong(cabinetIdString);
		Cabinet cabinet = cabinetOptionalFetcher.getCabinetForUpdate(cabinetId);
		Long userCount = ticketingSharedCabinet.getSizeOfUsers(cabinetId.toString());
		if (cabinetProperties.getShareMinUserCount() <= userCount
				&& userCount <= cabinetProperties.getShareMaxUserCount()) {    // 2명 이상 4명 이하: 대여 성공
			LocalDateTime now = LocalDateTime.now();
			cabinet.specifyStatus(CabinetStatus.FULL);
			lentServiceImpl.saveLentHistories(now, cabinetId);
		} else {
			cabinet.specifyStatus(CabinetStatus.AVAILABLE);
		}
		ticketingSharedCabinet.deleteValueKey(cabinetId);
	}
}
