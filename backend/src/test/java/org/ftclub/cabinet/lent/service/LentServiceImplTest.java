package org.ftclub.cabinet.lent.service;

import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.BanType;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.user.repository.BanHistoryRepository;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.ftclub.cabinet.utils.DateUtil;
import org.junit.After;
import org.junit.jupiter.api.*;
import org.junit.platform.commons.annotation.Testable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.jpa.repository.Query;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.*;
import java.lang.reflect.Field;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest()
@Transactional
class LentServiceImplTest {

    @Autowired
    private LentService lentService;
    @PersistenceContext
    private EntityManager em;
    @PersistenceUnit
    private EntityManagerFactory emf;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private LentRepository lentRepository;
    @Autowired
    private BanHistoryRepository banHistoryRepository;


    private <T1, T2> void objectSetValue(T1 target, String filedName, T2 value) throws NoSuchFieldException, IllegalAccessException {
        Field fieldReflect = target.getClass().getDeclaredField(filedName);
        fieldReflect.setAccessible(true);
        fieldReflect.set(target, value);
        fieldReflect.setAccessible(false);
    }

    User banUser1;
    User banUser2;
    User penaltyUser1;
    User penaltyUser2;
    User lentUser1;
    User lentUser2;
    User overdueUser;
    User koreaUser;
    User foreignUser;
    User clubUser1;
    User clubUser2;
    User user1;
    User user2;
    User user3;
    User user4;
    User user5;
    User user6;
    User user7;
    User user8;
    User user9;
    User user10;
    User normalUser1;
    User normalUser2;
    User normalUser3;
    User normalUser4;
    User normalUser5;
    User normalUser6;
    User normalUser7;
    User normalUser8;
    User normalUser9;
    User normalUser10;

    Cabinet privateBrokenCabinet;
    Cabinet privateFullCabinet;
    Cabinet privateOverdueCabinet;
    Cabinet privateAvailableCabinet1;
    Cabinet privateAvailableCabinet2;
    Cabinet privateAvailableCabinet3;
    Cabinet privateAvailableCabinet4;
    Cabinet privateAvailableCabinet5;
    Cabinet privateAvailableCabinet6;
    Cabinet privateAvailableCabinet7;
    Cabinet privateAvailableCabinet8;
    Cabinet privateAvailableCabinet9;
    Cabinet privateAvailableCabinet10;
    Cabinet privateAvailableCabinet11;
    Cabinet privateAvailableCabinet12;

    Cabinet sharedBrokenCabinet;
    Cabinet sharedFullCabinet;
    Cabinet sharedOverdueCabinet;
    Cabinet sharedAvailableCabinet0;
    Cabinet sharedAvailableCabinet1;
    Cabinet sharedAvailableCabinet2;
    Cabinet sharedLimitedAvailableCabinet1;
    Cabinet sharedLimitedAvailableCabinet2;

    Cabinet clubCabinet1;
    Cabinet clubCabinet2;

    @BeforeEach
    void beforeEach() {
        banUser1 = em.find(User.class, 1L);
        banUser2 = em.find(User.class, 2L);
        penaltyUser1 = em.find(User.class, 3L);
        penaltyUser2 = em.find(User.class, 4L);
        lentUser1 = em.find(User.class, 5L);
        lentUser2 = em.find(User.class, 6L);
        overdueUser = lentUser2;
        koreaUser = em.find(User.class, 7L);
        foreignUser = em.find(User.class, 8L);
        clubUser1 = em.find(User.class, 21L);
        clubUser2 = em.find(User.class, 22L);

        user1 = em.find(User.class, 9L);
        user2 = em.find(User.class, 10L);
        user3 = em.find(User.class, 11L);
        user4 = em.find(User.class, 12L);
        user5 = em.find(User.class, 13L);
        user6 = em.find(User.class, 14L);
        user7 = em.find(User.class, 15L);
        user8 = em.find(User.class, 16L);
        user9 = em.find(User.class, 17L);
        user10 = em.find(User.class, 18L);

        normalUser1 = em.createQuery("select u from User u where u.name = :name", User.class).setParameter("name", "normalUser1").getSingleResult();
        normalUser2 = em.createQuery("select u from User u where u.name = :name", User.class).setParameter("name", "normalUser2").getSingleResult();
        normalUser3 = em.createQuery("select u from User u where u.name = :name", User.class).setParameter("name", "normalUser3").getSingleResult();
        normalUser4 = em.createQuery("select u from User u where u.name = :name", User.class).setParameter("name", "normalUser4").getSingleResult();
        normalUser5 = em.createQuery("select u from User u where u.name = :name", User.class).setParameter("name", "normalUser5").getSingleResult();
        normalUser6 = em.createQuery("select u from User u where u.name = :name", User.class).setParameter("name", "normalUser6").getSingleResult();
        normalUser7 = em.createQuery("select u from User u where u.name = :name", User.class).setParameter("name", "normalUser7").getSingleResult();
        normalUser8 = em.createQuery("select u from User u where u.name = :name", User.class).setParameter("name", "normalUser8").getSingleResult();
        normalUser9 = em.createQuery("select u from User u where u.name = :name", User.class).setParameter("name", "normalUser9").getSingleResult();
        normalUser10 = em.createQuery("select u from User u where u.name = :name", User.class).setParameter("name", "normalUser10").getSingleResult();
//        normalUser1 = User.of("normalUser1", "normalUser1@email", DateUtil.stringToDate("2024-12-31"), UserRole.USER);
//        normalUser2 = User.of("normalUser2", "normalUser2@email", DateUtil.stringToDate("2024-12-31"), UserRole.USER);
//        normalUser3 = User.of("normalUser3", "normalUser3@email", DateUtil.stringToDate("2024-12-31"), UserRole.USER);
//        normalUser4 = User.of("normalUser4", "normalUser4@email", DateUtil.stringToDate("2024-12-31"), UserRole.USER);
//        normalUser5 = User.of("normalUser5", "normalUser5@email", DateUtil.stringToDate("2024-12-31"), UserRole.USER);
//        normalUser6 = User.of("normalUser6", "normalUser6@email", DateUtil.stringToDate("2024-12-31"), UserRole.USER);
//        normalUser7 = User.of("normalUser7", "normalUser7@email", DateUtil.stringToDate("2024-12-31"), UserRole.USER);
//        normalUser8 = User.of("normalUser8", "normalUser8@email", DateUtil.stringToDate("2024-12-31"), UserRole.USER);
//        normalUser9 = User.of("normalUser9", "normalUser9@email", DateUtil.stringToDate("2024-12-31"), UserRole.USER);
//        normalUser10 = User.of("normalUser10", "normalUser10@email", DateUtil.stringToDate("2024-12-31"), UserRole.USER);
//        em.persist(normalUser1);
//        em.persist(normalUser2);
//        em.persist(normalUser3);
//        em.persist(normalUser4);
//        em.persist(normalUser5);
//        em.persist(normalUser6);
//        em.persist(normalUser7);
//        em.persist(normalUser8);
//        em.persist(normalUser9);
//        em.persist(normalUser10);

        privateBrokenCabinet = em.find(Cabinet.class, 1L);
        privateFullCabinet = em.find(Cabinet.class, 3L);
        privateOverdueCabinet = em.find(Cabinet.class, 5L);
        privateAvailableCabinet1 = em.find(Cabinet.class, 7L);
        privateAvailableCabinet2 = em.find(Cabinet.class, 11L);
        privateAvailableCabinet3 = em.find(Cabinet.class, 13L);
        privateAvailableCabinet4 = em.find(Cabinet.class, 15L);
        privateAvailableCabinet5 = em.find(Cabinet.class, 17L);
        privateAvailableCabinet6 = em.find(Cabinet.class, 19L);
        privateAvailableCabinet7 = em.find(Cabinet.class, 21L);
        privateAvailableCabinet8 = em.find(Cabinet.class, 23L);
        privateAvailableCabinet9 = em.find(Cabinet.class, 25L);
        privateAvailableCabinet10 = em.find(Cabinet.class, 27L);

        sharedBrokenCabinet = em.find(Cabinet.class, 2L);
        sharedFullCabinet = em.find(Cabinet.class, 4L);
        sharedOverdueCabinet = em.find(Cabinet.class, 6L);
        sharedAvailableCabinet0 = em.find(Cabinet.class, 8L); // 변수명 뒤에 숫자는 activeLentCount 값
        sharedAvailableCabinet1 = em.find(Cabinet.class, 12L); // 변수명 뒤에 숫자는 activeLentCount 값
        sharedAvailableCabinet2 = em.find(Cabinet.class, 14L); // 변수명 뒤에 숫자는 activeLentCount 값
        sharedLimitedAvailableCabinet1 = em.find(Cabinet.class, 16L); // 변수명 뒤에 숫자는 activeLentCount 값
        sharedLimitedAvailableCabinet2 = em.find(Cabinet.class, 18L); // 변수명 뒤에 숫자는 activeLentCount 값

        clubCabinet1 = em.find(Cabinet.class, 9L);
        clubCabinet2 = em.find(Cabinet.class, 10L);
    }

    @Test @DisplayName("사물함 대여 가능한 사용자는 available 상태의 사물함을 빌릴 수 있습니다 ")
    void generalLentSituation1() {
        // given
        int lentCountBefore = lentRepository.countUserActiveLent(normalUser1.getUserId());
        // when
        lentService.startLentCabinet(normalUser1.getUserId(), privateAvailableCabinet1.getCabinetId());
        // then
        int lentCountAfter = lentRepository.countUserActiveLent(normalUser1.getUserId());
        LentHistory lentHistory = lentRepository.findFirstByUserIdAndEndedAtIsNull(normalUser1.getUserId()).orElse(null);
        assertNotNull(lentHistory);
        Assertions.assertEquals(lentCountAfter, lentCountBefore + 1L);
        Assertions.assertEquals(CabinetStatus.FULL, privateAvailableCabinet1.getStatus());
        Assertions.assertNotNull(lentRepository.findFirstByUserIdAndEndedAtIsNull(normalUser1.getUserId()).orElse(null));
    }

    @Test @DisplayName("사물함 대여 가능한 사용자는 limited_available 상태의 사물함을 빌릴 수 있습니다 ")
    void generalLentSituation2() {
        // given
        Long userId = normalUser1.getUserId();
        Cabinet cabinet = sharedLimitedAvailableCabinet2;
        Long cabinetId = cabinet.getCabinetId();
        int activeLentCountBefore = lentRepository.countUserActiveLent(userId);
        // when
        lentService.startLentCabinet(userId, cabinetId);
        // then
        int activeLentCountAfter = lentRepository.countUserActiveLent(userId);
        LentHistory lentHistory = lentRepository.findFirstByUserIdAndEndedAtIsNull(userId).orElse(null);
        assertNotNull(lentHistory);
        Assertions.assertEquals(activeLentCountAfter, activeLentCountBefore + 1L);
        Assertions.assertEquals(CabinetStatus.FULL, cabinet.getStatus());
        Assertions.assertNotNull(lentRepository.findFirstByUserIdAndEndedAtIsNull(userId).orElse(null));
    }
    @Test @DisplayName("대여자는 또 다른 사물함을 빌릴 수 없습니다.")
    void alreadyLentUserSituation() {
        // given
        Long userId = lentUser1.getUserId();
        Long cabinetId1 = privateAvailableCabinet1.getCabinetId();
        Long cabinetId2 = sharedAvailableCabinet0.getCabinetId();
        // when
        ServiceException serviceException1 = assertThrows(ServiceException.class, () -> lentService.startLentCabinet(userId, cabinetId1));
        ServiceException serviceException2 = assertThrows(ServiceException.class, () -> lentService.startLentCabinet(userId, cabinetId2));
        // then
        assertEquals(ExceptionStatus.LENT_ALREADY_EXISTED, serviceException1.getStatus());
        assertEquals(ExceptionStatus.LENT_ALREADY_EXISTED, serviceException2.getStatus());
    }

    @Test @DisplayName("사물함이 빌릴 수 없는 상태이면 대여 실패 해야합니다(FULL, BROKEN, OVERDUE)")
    void startLentAlreadyLentCabinet() {
        // given
        Long userId = normalUser1.getUserId();
        Long cabinetId1 = privateBrokenCabinet.getCabinetId();
        Long cabinetId2 = privateOverdueCabinet.getCabinetId();
        Long cabinetId3 = privateFullCabinet.getCabinetId();
        Long cabinetId4 = sharedBrokenCabinet.getCabinetId();
        Long cabinetId5 = sharedOverdueCabinet.getCabinetId();
        Long cabinetId6 = sharedFullCabinet.getCabinetId();
        // when
        ServiceException serviceException1 = assertThrows(ServiceException.class, () -> lentService.startLentCabinet(userId, cabinetId1));
        ServiceException serviceException2 = assertThrows(ServiceException.class, () -> lentService.startLentCabinet(userId, cabinetId2));
        ServiceException serviceException3 = assertThrows(ServiceException.class, () -> lentService.startLentCabinet(userId, cabinetId3));
        ServiceException serviceException4 = assertThrows(ServiceException.class, () -> lentService.startLentCabinet(userId, cabinetId4));
        ServiceException serviceException5 = assertThrows(ServiceException.class, () -> lentService.startLentCabinet(userId, cabinetId5));
        ServiceException serviceException6 = assertThrows(ServiceException.class, () -> lentService.startLentCabinet(userId, cabinetId6));
        // then
        assertEquals(ExceptionStatus.LENT_BROKEN, serviceException1.getStatus());
        assertEquals(ExceptionStatus.LENT_EXPIRED, serviceException2.getStatus());
        assertEquals(ExceptionStatus.LENT_FULL, serviceException3.getStatus());
        assertEquals(ExceptionStatus.LENT_BROKEN, serviceException4.getStatus());
        assertEquals(ExceptionStatus.LENT_EXPIRED, serviceException5.getStatus());
        assertEquals(ExceptionStatus.LENT_FULL, serviceException6.getStatus());
    }

    @Test @DisplayName("존재하지 않는 유저 번호로 렌트를 시도하면 예외가 발생해야 합니다")
    void invalidStartLent1() {
        // given
        Long userId = normalUser1.getUserId();
        Long invalidCabinetId = -1L;
        Long maxCabinetId = (Long) em.createQuery("select max(c.cabinetId) from Cabinet c").getSingleResult();
        // when
        ServiceException serviceException1 = assertThrows(ServiceException.class, () -> lentService.startLentCabinet(userId, invalidCabinetId));
        ServiceException serviceException2 = assertThrows(ServiceException.class, () -> lentService.startLentCabinet(userId, maxCabinetId + 1L));
        // then
        assertEquals(ExceptionStatus.NOT_FOUND_CABINET, serviceException1.getStatus());
        assertEquals(ExceptionStatus.NOT_FOUND_CABINET, serviceException2.getStatus());
    }
    @Test @DisplayName("존재하지 않는 사물함 번호로 렌트를 시도하면 예외가 발생해야 합니다")
    void invalidStartLent2() {
        // given
        Long invalidUserId = -1L;
        Long maxUserId = (Long) em.createQuery("select max(u.userId) from User u").getSingleResult();
        Long cabinetId = privateAvailableCabinet1.getCabinetId();
        // when
        ServiceException serviceException1 = assertThrows(ServiceException.class, () -> lentService.startLentCabinet(invalidUserId, cabinetId));
        ServiceException serviceException2 = assertThrows(ServiceException.class, () -> lentService.startLentCabinet(maxUserId + 1, cabinetId));
        // then
        assertEquals(ExceptionStatus.NOT_FOUND_USER, serviceException1.getStatus());
        assertEquals(ExceptionStatus.NOT_FOUND_USER, serviceException2.getStatus());
    }
    @Test @DisplayName("대여자가 개인 사물함 정상 반납하면 lentHistory.endedAt 값 업데이트 됩니다")
    void generalEndSituation1() throws InterruptedException {
        // given
        Long userId = normalUser1.getUserId();
        Long cabinetId = privateAvailableCabinet1.getCabinetId();
        // when
        lentService.startLentCabinet(userId, cabinetId);
        lentService.endLentCabinet(userId);
        List<LentHistory> lentHistoryList = lentRepository.findByUserId(userId, null);
        // then
        for (LentHistory lentHistory : lentHistoryList) {
            assertNotNull(lentHistory.getEndedAt());
        }
    }
    @Test @DisplayName("대여자가 개인 사물함 정상 반납하면 banHistory에 등록되지 않습니다")
    void generalEndSituation2() throws InterruptedException {
        // given
        Long userId = normalUser1.getUserId();
        Long cabinetId = privateAvailableCabinet1.getCabinetId();
        // when
        lentService.startLentCabinet(userId, cabinetId);
        Long before = banHistoryRepository.countUserActiveBan(userId);
        lentService.endLentCabinet(userId);
        Long after = banHistoryRepository.countUserActiveBan(userId);
        // then
        assertEquals(before, after);
    }

    @Test @DisplayName("대여자가 공유 사물함 정상 반납하면 lentHistory.endedAt 값 업데이트 됩니다")
    void generalEndSituation3() throws InterruptedException {
        // given
        Long userId = normalUser1.getUserId();
        Long cabinetId = sharedAvailableCabinet0.getCabinetId();
        // when
        lentService.startLentCabinet(userId, cabinetId);
        lentService.endLentCabinet(userId);
        List<LentHistory> lentHistoryList = lentRepository.findByUserId(userId, null);
        // then
        for (LentHistory lentHistory : lentHistoryList) {
            assertNotNull(lentHistory.getEndedAt());
        }
    }
    @Test @DisplayName("대여자가 공유 사물함 정상 반납하면 banHistory에 등록되지 않습니다")
    void generalEndSituation4() throws InterruptedException {
        // given
        Long userId = normalUser1.getUserId();
        Long cabinetId = sharedAvailableCabinet0.getCabinetId();
        // when
        lentService.startLentCabinet(userId, cabinetId);
        Long before = banHistoryRepository.countUserActiveBan(userId);
        lentService.endLentCabinet(userId);
        Long after = banHistoryRepository.countUserActiveBan(userId);
        // then
        assertEquals(before, after);
    }
    @Test @DisplayName("존재하지 않는 유저 번호로 반납을 시도하면 예외가 발생해야 합니다")
    void invalidEndLent1() {
        // given
        Long invalidUserId = -1L;
        Long maxUserId = (Long) em.createQuery("select max(u.userId) from User u").getSingleResult();
        // when
        ServiceException serviceException1 = assertThrows(ServiceException.class, () -> lentService.endLentCabinet(invalidUserId));
        ServiceException serviceException2 = assertThrows(ServiceException.class, () -> lentService.endLentCabinet(maxUserId + 1));
        // then
        assertEquals(ExceptionStatus.NOT_FOUND_USER, serviceException1.getStatus());
        assertEquals(ExceptionStatus.NOT_FOUND_USER, serviceException2.getStatus());
    }
    @Test @DisplayName("대여자가 아님에도 반납을 시도하면 예외가 발생해야 합니다")
    void invalidEndLent2() {
        // given
        Long userId = normalUser1.getUserId();
        // when
        ServiceException serviceException1 = assertThrows(ServiceException.class, () -> lentService.endLentCabinet(userId));
        // then
        assertEquals(ExceptionStatus.NO_LENT_CABINET, serviceException1.getStatus());
    }
    @Testable @DisplayName("대여자가 개인사물함 혹은 공유사물함 연체반납. BAN")
    void delayedEndLent() {
        // given
        Long userId = overdueUser.getUserId();
        // when
        lentService.endLentCabinet(userId);
        BanHistory banHistory = banHistoryRepository.findFirstBanHistory(userId);
        // then
        assertNotNull(banHistory);
        assertEquals(BanType.PRIVATE, banHistory.getBanType());
    }
    @Testable @DisplayName("공유사물함을 빌리고 3일이내에 반납. penalty")
    void tooEarlyEndLentSharedCabinet() {
        // given
        Long userId = normalUser1.getUserId();
        Long cabinetId = sharedAvailableCabinet0.getCabinetId();
        // when
        lentService.startLentCabinet(userId, cabinetId);
        lentService.endLentCabinet(userId);
        List<BanHistory> userBanList = banHistoryRepository.findUserActiveBanList(userId);
        // then
        assertEquals(1, userBanList.size());
        assertEquals(BanType.SHARE, userBanList.get(0).getBanType());
    }

    @Test @DisplayName("현재 ban 상태인 유저는 모든 종류의 사물함을 대여할 수 없습니다.")
    public void banUserLentCabinet() throws Exception {
        // given
        Long userId = banUser1.getUserId();
        BanHistory userBanHistory = banHistoryRepository.findFirstBanHistory(userId);
        objectSetValue(userBanHistory, "unbannedAt", DateUtil.getInfinityDate());
        Long sharedCabinetId = sharedAvailableCabinet0.getCabinetId();
        Long privateCabinetId = privateAvailableCabinet1.getCabinetId();
        // when
        ServiceException serviceException1 = assertThrows(ServiceException.class, () -> lentService.startLentCabinet(userId, sharedCabinetId));
        ServiceException serviceException2 = assertThrows(ServiceException.class, () -> lentService.startLentCabinet(userId, privateCabinetId));
        // then
        assertEquals(ExceptionStatus.BAN_USER, serviceException1.getStatus());
        assertEquals(ExceptionStatus.BAN_USER, serviceException2.getStatus());
    }
    @Test @DisplayName("현재 penalty 상태인 유저는 개인 사물함을 대여할 수 있습니다.")
    public void penaltyUserLentCabinet1() throws Exception {
        // given
        Long userId = penaltyUser1.getUserId();
        BanHistory userBanHistory = banHistoryRepository.findFirstBanHistory(userId);
        objectSetValue(userBanHistory, "unbannedAt", DateUtil.getInfinityDate());
        Long cabinetId = privateAvailableCabinet1.getCabinetId();
        // when
        assertDoesNotThrow(() -> lentService.startLentCabinet(userId, cabinetId));
        // then
    }

    @Test @DisplayName("현재 penalty 상태인 유저는 공유 사물함을 대여할 수 없습니다.")
    public void penaltyUserLentCabinet2() throws Exception {
        // given
        Long userId = penaltyUser1.getUserId();
        BanHistory userBanHistory = banHistoryRepository.findFirstBanHistory(userId);
        objectSetValue(userBanHistory, "unbannedAt", DateUtil.getInfinityDate());
        Long cabinetId = sharedAvailableCabinet0.getCabinetId();
        // when
        ServiceException serviceException = assertThrows(ServiceException.class, () -> lentService.startLentCabinet(userId, cabinetId));
        // then
        assertEquals(ExceptionStatus.PENALTY_USER, serviceException.getStatus());
    }
    @Test @DisplayName("available -> full")
    void sharedCabinetProperStatus1() {
        // given
        Long userId1 = normalUser1.getUserId();
        Long userId2 = normalUser2.getUserId();
        Long userId3 = normalUser3.getUserId();
        Cabinet cabinet = sharedAvailableCabinet1;
        Long cabinetId = cabinet.getCabinetId();
        // when
        lentService.startLentCabinet(userId1, cabinetId);
        assertEquals(CabinetStatus.AVAILABLE, cabinet.getStatus());
        assertEquals(2, lentRepository.countCabinetActiveLent(cabinetId));
        List<LentHistory> activeLentHistoryList = lentRepository.findAllActiveLentByCabinetId(cabinetId);
        for (LentHistory lentHistory : activeLentHistoryList)
            assertEquals(DateUtil.getInfinityDate(), lentHistory.getExpiredAt());

        lentService.endLentCabinet(userId1);
        assertEquals(CabinetStatus.AVAILABLE, cabinet.getStatus());
        assertEquals(1, lentRepository.countCabinetActiveLent(cabinetId));

        lentService.startLentCabinet(userId2, cabinetId);
        assertEquals(CabinetStatus.AVAILABLE, cabinet.getStatus());
        assertEquals(2, lentRepository.countCabinetActiveLent(cabinetId));
        activeLentHistoryList = lentRepository.findAllActiveLentByCabinetId(cabinetId);
        for (LentHistory lentHistory : activeLentHistoryList)
            assertEquals(DateUtil.getInfinityDate(), lentHistory.getExpiredAt());

        lentService.startLentCabinet(userId3, cabinetId);
        assertEquals(CabinetStatus.FULL, cabinet.getStatus());
        assertEquals(3, lentRepository.countCabinetActiveLent(cabinetId));
        activeLentHistoryList = lentRepository.findAllActiveLentByCabinetId(cabinetId);
        for (LentHistory lentHistory : activeLentHistoryList)
            assertNotEquals(DateUtil.getInfinityDate(), lentHistory.getExpiredAt());
        // then
    }
    @Test @DisplayName("full -> limited_available -> full -> available")
    void sharedCabinetProperStatus2() {
        // given
        Long userId1 = normalUser1.getUserId();
        Long userId2 = normalUser2.getUserId();
        Long userId3 = normalUser3.getUserId();
        Long userId4 = normalUser4.getUserId();
        Cabinet cabinet = sharedAvailableCabinet0;
        Long cabinetId = cabinet.getCabinetId();
        lentService.startLentCabinet(userId1, cabinetId);
        lentService.startLentCabinet(userId2, cabinetId);
        lentService.startLentCabinet(userId3, cabinetId);
        assertEquals(CabinetStatus.FULL, cabinet.getStatus());
        List<LentHistory> activeLentHistoryList = lentRepository.findAllActiveLentByCabinetId(cabinetId);
        for (LentHistory lentHistory : activeLentHistoryList)
            assertNotEquals(DateUtil.getInfinityDate(), lentHistory.getExpiredAt());
        // when
        lentService.endLentCabinet(userId1);
        assertEquals(CabinetStatus.LIMITED_AVAILABLE, cabinet.getStatus());
        assertEquals(2, lentRepository.countCabinetActiveLent(cabinetId));

        lentService.startLentCabinet(userId4, cabinetId);
        assertEquals(CabinetStatus.FULL, cabinet.getStatus());
        assertEquals(3, lentRepository.countCabinetActiveLent(cabinetId));
        LentHistory latestLentHistory = lentRepository.findFirstByCabinetIdAndEndedAtIsNull(cabinetId).orElse(null);
        activeLentHistoryList = lentRepository.findAllActiveLentByCabinetId(cabinetId);
        for (LentHistory lentHistory : activeLentHistoryList)
            assertEquals(latestLentHistory.getExpiredAt(), lentHistory.getExpiredAt());

        lentService.endLentCabinet(userId2);
        lentService.endLentCabinet(userId3);
        lentService.endLentCabinet(userId4);
        // then
        assertEquals(CabinetStatus.AVAILABLE, cabinet.getStatus());
        assertEquals(0, lentRepository.countCabinetActiveLent(cabinetId));
        List<LentHistory> cabinetAllLentHistory = lentRepository.findByCabinetId(cabinetId, null);
        for (LentHistory lentHistory : cabinetAllLentHistory)
            assertTrue(DateUtil.isNearCurrent(lentHistory.getEndedAt()));
    }

    @Test @DisplayName("캐비넷 상태가 overdue일 때, 반납이 모두 이루어져야 available 상태로 바뀝니다.")
    void overdueCabinetStatus() throws Exception {
        // given
        Long userId1 = normalUser1.getUserId();
        Long userId2 = normalUser2.getUserId();
        Long userId3 = normalUser3.getUserId();
        Long userId4 = normalUser4.getUserId();
        Cabinet cabinet = sharedAvailableCabinet0;
        Long cabinetId = cabinet.getCabinetId();
        lentService.startLentCabinet(userId1, cabinetId);
        lentService.startLentCabinet(userId2, cabinetId);
        lentService.startLentCabinet(userId3, cabinetId);
        List<LentHistory> cabinetAllLentHistory = lentRepository.findAllActiveLentByCabinetId(cabinetId);
        for (LentHistory lentHistory : cabinetAllLentHistory)
            objectSetValue(lentHistory, "expiredAt", DateUtil.stringToDate("2020-01-01"));
        objectSetValue(cabinet, "status", CabinetStatus.OVERDUE);
        // when
        lentService.endLentCabinet(userId1);
        assertEquals(CabinetStatus.OVERDUE, cabinet.getStatus());

        lentService.endLentCabinet(userId2);
        assertEquals(CabinetStatus.OVERDUE, cabinet.getStatus());

        ServiceException serviceException = assertThrows(ServiceException.class, () -> lentService.startLentCabinet(userId4, cabinetId));
        assertEquals(ExceptionStatus.LENT_EXPIRED, serviceException.getStatus());

        lentService.endLentCabinet(userId3);
        // then
        assertEquals(CabinetStatus.AVAILABLE, cabinet.getStatus());
    }

    @Test @DisplayName("동시 대여 문제가 발생하는지 확인합니다")
    @Rollback(value = false)
    void concurrencyLent1() throws InterruptedException {
        // given
        List<Long> userIdList = em.createQuery("select u.userId from User u where u.name like :pattern")
                .setParameter("pattern", "normalUser%")
                .getResultList();
        Cabinet cabinet = sharedAvailableCabinet0;
        final CabinetStatus originalStatus = cabinet.getStatus();
        final Long cabinetId = cabinet.getCabinetId();
        // when
        int numberOfThreads = 10; // 동시에 실행할 스레드 수
        CountDownLatch latch = new CountDownLatch(numberOfThreads);
        AtomicInteger exceptionCount = new AtomicInteger(0);
        for (int i = 0; i < numberOfThreads; i++) {
            final Long finalUserId = userIdList.get(i); // effectively final 변수 생성
            // 새 쓰레드에서 실행되기 떄문에 내부적으로 새 entityManager를 만듦
            new Thread(() -> {
                try {
                    lentService.startLentCabinet(finalUserId, cabinetId);
                    lentService.endLentCabinet(finalUserId);
                } catch (Exception e) {
                    assertEquals(DataIntegrityViolationException.class, e.getClass());
                    exceptionCount.getAndIncrement();
                } finally {
                    latch.countDown();
                }
            }).start();
        }
        latch.await(); // 모든 스레드가 종료될 때까지 대기
        int lentCount = lentRepository.countCabinetActiveLent(cabinetId);
        // then
        assertTrue(lentCount <= cabinet.getMaxUser());
        em.createQuery("delete from LentHistory lh where lh.userId >= 23").executeUpdate();
        em.createQuery("update Cabinet c set c.status = :status where c.cabinetId = :cabinetId")
                .setParameter("status", originalStatus)
                .setParameter("cabinetId", cabinetId)
                .executeUpdate();
    }

    @Test @DisplayName("동시 대여, 반납시 캐비넷 상태가 적절히 변경되는지 확인합니다")
    @Rollback(value = false)
    void concurrencyLent2() throws InterruptedException {
        // given
        List<Long> userIdList = em.createQuery("select u.userId from User u where u.name like :pattern").setParameter("pattern", "normalUser%").getResultList();
        Cabinet cabinet = sharedAvailableCabinet0;
        final CabinetStatus originalStatus = cabinet.getStatus();
        final Long cabinetId = cabinet.getCabinetId();
        // when
        // 다수의 사람이 동시에 대여를 합니다.
        int numberOfThreads1 = 5; // 동시에 실행할 스레드 수
        CountDownLatch latch1 = new CountDownLatch(5);
        AtomicInteger exceptionCount = new AtomicInteger(0);
        for (int i = 0; i < numberOfThreads1; i++) {
            final Long lentUserId = userIdList.get(i);
            new Thread(() -> {
                try {
                    lentService.startLentCabinet(lentUserId, cabinetId);
                } catch (Exception e) {
                    assertEquals(DataIntegrityViolationException.class, e.getClass());
                    exceptionCount.getAndIncrement();
                } finally {
                    latch1.countDown();
                }
            }).start();
        }
        latch1.await();
        // 동시에 어떤 사람은 대여를, 어떤 사람은 반납을 합니다.
        final int numberOfThreads2 = numberOfThreads1 * 2;
        CountDownLatch latch2 = new CountDownLatch(numberOfThreads2);
        for (int i = numberOfThreads2 - 1; i >= 0; i--) {
            final int finalI = i;
            final Long lentUserId = userIdList.get(i);
            final Long endUserId = userIdList.get(i);
            new Thread(() -> {
                try {
                    if (finalI < (numberOfThreads2 / 2)) {
                        lentService.endLentCabinet(endUserId);
                    } else {
                        lentService.startLentCabinet(lentUserId, cabinetId);
                    }
                } catch (Exception e) {
                    boolean isDataIntegrityViolationException = e instanceof DataIntegrityViolationException;
                    boolean isServiceException = e instanceof ServiceException;
                    boolean isOptimisticLockException = e instanceof OptimisticLockException;
                    assertTrue(isDataIntegrityViolationException || isServiceException || isOptimisticLockException);
                    if (isOptimisticLockException) System.out.println("낙관적 락");
                    exceptionCount.getAndIncrement();
                } finally {
                    latch2.countDown();
                }
            }).start();
        }
        latch2.await();
        // 다수의 사람이 동시에 반납을 합니다.
        CountDownLatch latch3 = new CountDownLatch(5);
        for (int i = 5; i < 10; i++) {
            final int finalI = i;
            final Long lentUserId = userIdList.get(i);
            new Thread(() -> {
                try {
                    lentService.endLentCabinet(lentUserId);
                } catch (Exception e) {
                    boolean isDataIntegrityViolationException = e instanceof DataIntegrityViolationException;
                    boolean isServiceException = e instanceof ServiceException;
                    boolean isOptimisticLockException = e instanceof OptimisticLockException;
                    assertTrue(isDataIntegrityViolationException || isServiceException || isOptimisticLockException);
                    if (isOptimisticLockException) System.out.println("낙관적 락");
                    exceptionCount.getAndIncrement();
                } finally {
                    latch3.countDown();
                }
            }).start();
        }
        latch3.await();
        // then
        EntityManager tempEM = emf.createEntityManager();
        BigInteger bigInteger = (BigInteger)tempEM.createNativeQuery("select count(*) from LENT_HISTORY as lh where lh.cabinet_id = :cabinetId and lh.ended_at is null")
                .setParameter("cabinetId", cabinetId).getSingleResult();
        int lentCount = bigInteger.intValue();
        List<LentHistory> activeLentHistoryList = (List<LentHistory>) tempEM.createNativeQuery("select * from LENT_HISTORY as lh where lh.cabinet_id = :cabinetId and lh.ended_at is null", LentHistory.class)
                .setParameter("cabinetId", cabinetId).getResultList();
        assertTrue(lentCount <= cabinet.getMaxUser());
        if (lentCount == 0) {
            assertEquals(CabinetStatus.AVAILABLE, cabinet.getStatus());
        } else {
            Date expiredAt = activeLentHistoryList.get(0).getExpiredAt();
            if (DateUtil.isInfinite(expiredAt)) {
                assertEquals(CabinetStatus.AVAILABLE, cabinet.getStatus());
            } else {
                if (lentCount == cabinet.getMaxUser()) {
                    assertEquals(CabinetStatus.FULL, cabinet.getStatus());
                } else {
                    assertEquals(CabinetStatus.LIMITED_AVAILABLE, cabinet.getStatus());
                }
            }
            for (LentHistory lentHistory : activeLentHistoryList) {
                assertEquals(expiredAt, lentHistory.getExpiredAt());
            }
        }
        em.createQuery("delete from LentHistory lh where lh.userId >= 23").executeUpdate();
        em.createQuery("update Cabinet c set c.status = :status where c.cabinetId = :cabinetId")
                .setParameter("status", originalStatus)
                .setParameter("cabinetId", cabinetId)
                .executeUpdate();
    }

    @Test @DisplayName("동시 반납시 캐비넷 상태가 적절히 변경되는지 확인합니다")
    @Rollback(value = false)
    void concurrencyLent3() throws InterruptedException {
        // given
        Long userId1 = user7.getUserId();
        Long userId2 = user8.getUserId();
        Long userId3 = user9.getUserId();
        Cabinet cabinet = sharedFullCabinet;
        Long cabinetId = cabinet.getCabinetId();
        int lentCount = lentRepository.countCabinetActiveLent(cabinetId);
        CabinetStatus originalStatus = cabinet.getStatus();
        // when
        int numberOfThreads = 3; // 동시에 실행할 스레드 수
        List<Long> userList = new ArrayList<>();
        userList.add(userId1); userList.add(userId2); userList.add(userId3);
        CountDownLatch latch = new CountDownLatch(numberOfThreads);
        AtomicInteger successCount = new AtomicInteger(numberOfThreads);
        for (int i = 0; i < numberOfThreads; i++) {
            final Long lentUserId = userList.get(i);
            new Thread(() -> {
                try {
                    lentService.endLentCabinet(lentUserId);
                } catch (Exception e) {
                    successCount.decrementAndGet();
                    assertEquals(OptimisticLockException.class, e.getClass());
                } finally {
                    latch.countDown();
                }
            }).start();
        }
        latch.await();
        EntityManager tempEM = emf.createEntityManager();
        BigInteger count = (BigInteger)tempEM.createNativeQuery("select count(*) from LENT_HISTORY as lh where lh.cabinet_id = :cabinetId and lh.ended_at is null")
                .setParameter("cabinetId", cabinetId).getSingleResult();
        assertEquals(lentCount - successCount.get(), count.intValue());
        int activeLentCount = lentRepository.countCabinetActiveLent(cabinetId);
        assertEquals(lentCount - successCount.get(), activeLentCount);

//        tempEM.createQuery("delete from LentHistory lh where lh.userId >= 23").executeUpdate();
//        tempEM.createQuery("update LentHistory lh set lh.endedAt = null where lh.cabinetId = :cabinetId and lh.userId in :userIdList")
//                .setParameter("cabinetId", cabinetId).setParameter("userIdList", userList).setMaxResults(3).executeUpdate();
//        tempEM.createQuery("update Cabinet c set c.status = :status where c.cabinetId = :cabinetId")
//                .setParameter("status", originalStatus)
//                .setParameter("cabinetId", cabinetId)
//                .executeUpdate();
    }

    @Test @DisplayName("")
    @Rollback(value = false)
    void concurrencyLent4() {
        // given
        Long userId1 = user2.getUserId();
        Long userId2 = user3.getUserId();
        Long userId3 = normalUser1.getUserId();
        Cabinet cabinet = sharedAvailableCabinet2;
        CabinetStatus originalStatus = cabinet.getStatus();
        Long cabinetId = cabinet.getCabinetId();
        // when
        int numberOfThreads = 3; // 동시에 실행할 스레드 수
        List<Long> userList = new ArrayList<>();
        userList.add(userId1); userList.add(userId2); userList.add(userId3);
        CountDownLatch latch = new CountDownLatch(numberOfThreads);
        AtomicInteger successCount = new AtomicInteger(numberOfThreads);
        // 반납 시도
        new Thread(() -> {
            try {
                lentService.endLentCabinet(userId1);
            } catch (Exception e) {
                successCount.decrementAndGet();
                assertEquals(OptimisticLockException.class, e.getClass());
            } finally {
                latch.countDown();
            }
        }).start();
        // 대여 시도
        new Thread(() -> {
            try {
                lentService.startLentCabinet(userId3, cabinetId);
            } catch (Exception e) {
                successCount.decrementAndGet();
                assertEquals(OptimisticLockException.class, e.getClass());
            } finally {
                latch.countDown();
            }
        }).start();
        // then
        EntityManager tempEM = emf.createEntityManager();
        cabinet = (Cabinet) tempEM.createNativeQuery("select * from CABINET as c where c.cabinet_id = :cabinetId", Cabinet.class)
                .setParameter("cabinetId", cabinetId)
                .getSingleResult();
        assertEquals(originalStatus, cabinet.getStatus());
        BigInteger lentCount = (BigInteger)tempEM.createNativeQuery("select count(*) from LENT_HISTORY as lh where lh.cabinet_id = :cabinetId and lh.ended_at is null")
                .setParameter("cabinetId", cabinetId).getSingleResult();
        assertEquals(2, lentCount.intValue());
    }

}