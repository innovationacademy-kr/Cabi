package org.ftclub.cabinet.event;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManagerFactory;
import lombok.AllArgsConstructor;
import org.hibernate.event.service.spi.EventListenerRegistry;
import org.hibernate.event.spi.EventType;
import org.hibernate.internal.SessionFactoryImpl;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class HibernateEventListener {

	private final EntityManagerFactory entityManagerFactory;

	@PostConstruct
	private void init() {
		SessionFactoryImpl sessionFactory = entityManagerFactory.unwrap(SessionFactoryImpl.class);
		EventListenerRegistry registry = sessionFactory.getServiceRegistry()
				.getService(EventListenerRegistry.class);
		registry.getEventListenerGroup(EventType.POST_INSERT)
				.appendListener(new InsertEventListener());
	}
}
