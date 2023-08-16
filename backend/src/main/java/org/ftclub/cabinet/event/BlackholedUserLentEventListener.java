package org.ftclub.cabinet.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.dto.UserBlackholeInfoDto;
import org.ftclub.cabinet.utils.blackhole.manager.BlackholeManagerV2;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Component;

@Log4j2
@Component
@EnableAsync
@RequiredArgsConstructor
public class BlackholedUserLentEventListener {

	private final BlackholeManagerV2 blackholeManager;

	@Async
	@EventListener
	public void handleBlackholedUserLentAttemptingEvent(UserBlackholeInfoDto userBlackholeInfoDto) {
		log.info("Called handleBlackholedUserLentAttemptingEvent");
		blackholeManager.blackholeRefresher(userBlackholeInfoDto);
	}
}
