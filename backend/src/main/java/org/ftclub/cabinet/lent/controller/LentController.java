package org.ftclub.cabinet.lent.controller;

import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

@RestController
@Transactional
public class LentController {

    @PersistenceContext
    private EntityManager em;
    @GetMapping("/test")
    public void s() {
        User normalUser1 = User.of("normalUser1", "normalUser1@email", DateUtil.stringToDate("2024-12-31"), UserRole.USER);
        User normalUser2 = User.of("normalUser2", "normalUser2@email", DateUtil.stringToDate("2024-12-31"), UserRole.USER);
        User normalUser3 = User.of("normalUser3", "normalUser3@email", DateUtil.stringToDate("2024-12-31"), UserRole.USER);
        User normalUser4 = User.of("normalUser4", "normalUser4@email", DateUtil.stringToDate("2024-12-31"), UserRole.USER);
        User normalUser5 = User.of("normalUser5", "normalUser5@email", DateUtil.stringToDate("2024-12-31"), UserRole.USER);
        User normalUser6 = User.of("normalUser6", "normalUser6@email", DateUtil.stringToDate("2024-12-31"), UserRole.USER);
        User normalUser7 = User.of("normalUser7", "normalUser7@email", DateUtil.stringToDate("2024-12-31"), UserRole.USER);
        User normalUser8 = User.of("normalUser8", "normalUser8@email", DateUtil.stringToDate("2024-12-31"), UserRole.USER);
        User normalUser9 = User.of("normalUser9", "normalUser9@email", DateUtil.stringToDate("2024-12-31"), UserRole.USER);
        User normalUser10 = User.of("normalUser10", "normalUser10@email", DateUtil.stringToDate("2024-12-31"), UserRole.USER);
        em.persist(normalUser1);
        em.persist(normalUser2);
        em.persist(normalUser3);
        em.persist(normalUser4);
        em.persist(normalUser5);
        em.persist(normalUser6);
        em.persist(normalUser7);
        em.persist(normalUser8);
        em.persist(normalUser9);
        em.persist(normalUser10);
    }
}