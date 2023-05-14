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
import org.junit.jupiter.api.*;
import org.junit.platform.commons.annotation.Testable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.lang.reflect.Field;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest()
@Transactional
class LentServiceImplTest {

    @Autowired
    private LentService lentService;
    @PersistenceContext
    private EntityManager em;
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
    User normalUser1;
    User normalUser2;
    User normalUser3;
    User normalUser4;

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
        normalUser1 = User.of("normalUser1", "normalUser1@email", DateUtil.stringToDate("2024-12-31"), UserRole.USER);
        normalUser2 = User.of("normalUser2", "normalUser2@email", DateUtil.stringToDate("2024-12-31"), UserRole.USER);
        normalUser3 = User.of("normalUser3", "normalUser3@email", DateUtil.stringToDate("2024-12-31"), UserRole.USER);
        normalUser4 = User.of("normalUser4", "normalUser4@email", DateUtil.stringToDate("2024-12-31"), UserRole.USER);
        em.persist(normalUser1);
        em.persist(normalUser2);
        em.persist(normalUser3);
        em.persist(normalUser4);

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
}