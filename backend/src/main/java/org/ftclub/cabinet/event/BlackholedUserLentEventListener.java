package org.ftclub.cabinet.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.dto.UserBlackholeInfoDto;
import org.ftclub.cabinet.utils.blackhole.manager.BlackholeManager;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Log4j2
@Component
//@EnableAsync
@RequiredArgsConstructor
public class BlackholedUserLentEventListener {

	private final BlackholeManager blackholeManager;

	//	@Async
	@EventListener
	public void handleBlackholedUserLentAttemptingEvent(UserBlackholeInfoDto userBlackholeInfoDto) {
		log.info("Called handleBlackholedUserLentAttemptingEvent");
		blackholeManager.handleBlackhole(userBlackholeInfoDto);
	}
}
