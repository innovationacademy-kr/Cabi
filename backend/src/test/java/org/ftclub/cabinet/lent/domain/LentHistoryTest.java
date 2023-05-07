package org.ftclub.cabinet.lent.domain;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest()
@ActiveProfiles("test")
@Transactional
class LentHistoryTest {

	@PersistenceContext
	EntityManager em;

	@Autowired
	LentRepository lentRepository;

	@Test
	public void test1() {
//        em.isOpen();
//        User user = new User("tes", "test", new Date(), UserRole.USER);
//        Cabinet cabinet = new Cabinet(1, CabinetStatus.AVAILABLE, LentType.PRIVATE, 1, new Grid(),
//                new CabinetPlace(new Location(), new CabinetGrid(), new MapArea()));
//        em.persist(user);
//        em.persist(cabinet);
//        em.flush();
//        LentHistory lentHistory = new LentHistory(new Date(), new Date(), user.getUserId(),
//                cabinet.getCabinetId(), 1L);
//        em.persist(lentHistory);
//        Long userLentCount = lentRepository.userActiveLentCount(user.getUserId());
//        Assertions.assertEquals(1, userLentCount);
	}
}
