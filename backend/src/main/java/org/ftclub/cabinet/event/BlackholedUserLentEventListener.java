package org.ftclub.cabinet.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.dto.UserBlackholeDto;
import org.ftclub.cabinet.utils.blackhole.manager.BlackholeManager;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Log4j2
@Component
@RequiredArgsConstructor
public class BlackholedUserLentEventListener {

	private final BlackholeManager blackholeManager;

	@EventListener
	public void handleBlackholedUserLentAttemptingEvent(UserBlackholeDto userBlackholeDto) {
		log.info("Called handleBlackholedUserLentAttemptingEvent");
		blackholeManager.handleBlackhole(userBlackholeDto);
	}
}
