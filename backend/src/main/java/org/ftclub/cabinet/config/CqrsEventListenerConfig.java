package org.ftclub.cabinet.config;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cqrs.manager.CqrsManager;
import org.ftclub.cabinet.event.CqrsEventListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class CqrsEventListenerConfig {

	private final CqrsEventListener cqrsEventListener;
	
	@Autowired
	public void init(CqrsManager cqrsManager) {
		cqrsEventListener.setCqrsManager(cqrsManager);
	}
}
