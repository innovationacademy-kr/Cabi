package org.ftclub.cabinet;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
@Disabled
class CabinetApplicationTests {

	@PersistenceContext
	EntityManager em;

	@Test
	void healthcheck() {
		em.createQuery("select c from Cabinet c", Cabinet.class)
				.getResultList()
				.forEach(System.out::println);
	}

}
