package org.ftclub.cabinet.cqrs.event;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cqrs.domain.SessionLentEvent;
import org.ftclub.cabinet.cqrs.manager.CqrsManager;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SessionLentEventHandler {

	private final CqrsManager cqrsManager;

	@EventListener
	public void handleSessionLentEvent(SessionLentEvent sessionLentEvent) {
		cqrsManager.changeSessionLent(sessionLentEvent.getCabinetId(),
				sessionLentEvent.getUsersInSession());
	}
}
