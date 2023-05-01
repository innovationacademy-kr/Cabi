package org.ftclub.cabinet.lent.domain;

import org.ftclub.cabinet.cabinet.domain.*;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import java.util.Date;

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
        em.isOpen();
        User user = new User("tes", "test", new Date(), UserRole.USER);
        Cabinet cabinet = new Cabinet(1, CabinetStatus.AVAILABLE, LentType.PRIVATE, 1, new Grid(), new CabinetPlace(new Location(), new CabinetGrid(), new MapArea()));
        em.persist(user);
        em.persist(cabinet);
        em.flush();
        LentHistory lentHistory = new LentHistory(new Date(), new Date(), user.getUserId(), cabinet.getCabinetId());
        em.persist(lentHistory);
        Long userLentCount = lentRepository.userActiveLentCount(user.getUserId());
        Assertions.assertEquals(1, userLentCount);
    }
}