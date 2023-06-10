package org.ftclub.cabinet.lent.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.lang.reflect.Field;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.user.repository.BanHistoryRepository;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.ftclub.cabinet.utils.DateUtil;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.platform.commons.annotation.Testable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
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

	private <T1, T2> void objectSetValue(T1 target, String filedName, T2 value)
			throws NoSuchFieldException, IllegalAccessException {
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
		normalUser1 = User.of("normalUser1", "normalUser1@email.com",
				DateUtil.stringToDate("2024-12-31"), UserRole.USER);
		normalUser2 = User.of("normalUser2", "normalUser2@email.com",
				DateUtil.stringToDate("2024-12-31"), UserRole.USER);
		normalUser3 = User.of("normalUser3", "normalUser3@email.com",
				DateUtil.stringToDate("2024-12-31"), UserRole.USER);
		normalUser4 = User.of("normalUser4", "normalUser4@email.com",
				DateUtil.stringToDate("2024-12-31"), UserRole.USER);
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
		sharedAvailableCabinet0 = em.find(Cabinet.class, 8L); // 변수명 뒤에 숫자는 대여 카운트 값
		sharedAvailableCabinet1 = em.find(Cabinet.class, 12L); // 변수명 뒤에 숫자는 대여 카운트 값
		sharedAvailableCabinet2 = em.find(Cabinet.class, 14L); // 변수명 뒤에 숫자는 대여 카운트 값
		sharedLimitedAvailableCabinet1 = em.find(Cabinet.class, 16L); // 변수명 뒤에 숫자는 대여 카운트 값
		sharedLimitedAvailableCabinet2 = em.find(Cabinet.class, 18L); // 변수명 뒤에 숫자는 대여 카운트 값

		clubCabinet1 = em.find(Cabinet.class, 9L);
		clubCabinet2 = em.find(Cabinet.class, 10L);
	}

	@AfterEach
	void afterEach() throws NoSuchFieldException {
	}

	// 대여
	@Test
	@DisplayName("사물함 대여 가능한 사용자는 available, limited_available 상태의 사물함을 빌릴 수 있습니다 ")
	void generalLentSituation() {
		// given
		int lentCountBefore = lentRepository.countUserActiveLent(normalUser1.getUserId());
		// when
		lentService.startLentCabinet(normalUser1.getUserId(),
				privateAvailableCabinet1.getCabinetId());
		// then
		int lentCountAfter = lentRepository.countUserActiveLent(normalUser1.getUserId());
		LentHistory lentHistory = lentRepository.findFirstByUserIdAndEndedAtIsNull(
				normalUser1.getUserId()).orElseThrow(() -> new RuntimeException());
		Assertions.assertEquals(lentCountAfter, lentCountBefore + 1L);
		Assertions.assertEquals(CabinetStatus.FULL, privateAvailableCabinet1.getStatus());
		Assertions.assertNotNull(
				lentRepository.findFirstByUserIdAndEndedAtIsNull(normalUser1.getUserId())
						.orElse(null));
	}

	@Test
	@DisplayName("대여자는 또 다른 사물함을 빌릴 수 없습니다.")
	void alreadyLentUserSituation() {
		// given
		Long userId = lentUser1.getUserId();
		Long cabinetId = privateAvailableCabinet1.getCabinetId();
		// when
		ServiceException serviceException = assertThrows(ServiceException.class,
				() -> lentService.startLentCabinet(userId, cabinetId));
		// then
		assertEquals(ExceptionStatus.LENT_ALREADY_EXISTED, serviceException.getStatus());
	}

	@Testable
	@DisplayName("PRIVATE 사물함이 이미 대여중이면, 더 이상 대여할 수 없습니다. ")
	void alreadyLentCabinetSituation() {
	}

	@Testable
	@DisplayName("사물함이 빌릴 수 없는 상태이면 대여 실패 해야합니다(FULL, BROKEN, OVERDUE)")
	void startLentWithAlreadyLentCabinet() {
	}

	@Testable
	@DisplayName("존재하지 않는 유저 번호나 사물함 번호로 렌트를 시도하면 예외가 발생해야 합니다")
	void invalidUserOrCabinetStartLent() {
	}


	// 반납
	@Testable
	@DisplayName("대여자가 정상 반납한다.(연체반납X, 공유사물함3일이내반납X)")
	void generalEndSituation() throws InterruptedException {
	}

	@Testable
	@DisplayName("대여자가 개인사물함 혹은 공유사물함 연체반납. 밴을 받아야 합니다.")
	void userOverdueEndLentAboutPrivateOrPublicCabinet() {

	}

	@Testable
	@DisplayName("유저가 available 상태의 shared cabinet을 렌트. 3일이내 반납시 페널티를 받아야 합니다.")
	void userIllegalEndLentAboutSharedCabinet() {

	}

	@Testable
	@DisplayName("현재 ban 상태인 유저는 사물함을 대여할 수 없습니다.")
	public void banUserCannotLentCabinet() throws Exception {
		// given
		// when
		// then
	}

	@Testable
	@DisplayName("대여자가 공유사물함을 빌리고 3일이내에 반납. SHARE BAN.")
	void tooEarlyEndLentAboutSharedCabinet() {

	}

	// available -> full
	@Test
	@DisplayName("유저가 available 상태의 shared cabinet을 렌트합니다. cabinet의 status, expired_at, ended_at 값이 적절히 변경돼야 합니다.")
	void sharedCabinetProperStatus1() {
		// given
		Long userId1 = normalUser1.getUserId();
		Long userId2 = normalUser2.getUserId();
		Long userId3 = normalUser3.getUserId();
		Long cabinetId = sharedAvailableCabinet1.getCabinetId();
		Cabinet cabinet = sharedAvailableCabinet1;
		// when
		lentService.startLentCabinet(userId1, cabinetId);
		assertEquals(CabinetStatus.AVAILABLE, cabinet.getStatus());
		List<LentHistory> activeLentHistory = lentRepository.findAllActiveLentByCabinetId(
				cabinetId);
		for (LentHistory lentHistory : activeLentHistory) {
			assertEquals(DateUtil.getInfinityDate(), lentHistory.getExpiredAt());
		}

		lentService.endLentCabinet(userId1);
		assertEquals(CabinetStatus.AVAILABLE, cabinet.getStatus());

		lentService.startLentCabinet(userId2, cabinetId);
		assertEquals(CabinetStatus.AVAILABLE, cabinet.getStatus());

		lentService.startLentCabinet(userId3, cabinetId);
		assertEquals(CabinetStatus.FULL, cabinet.getStatus());
		activeLentHistory = lentRepository.findAllActiveLentByCabinetId(cabinetId);
		// then
		for (LentHistory lentHistory : activeLentHistory) {
			assertNotEquals(DateUtil.getInfinityDate(), lentHistory.getExpiredAt());
		}
	}

	// full -> limited_available -> full -> available
	@Test
	@DisplayName("유저가 available 상태의 shared cabinet을 렌트합니다. cabinet의 status, expired_at, ended_at 값이 적절히 변경돼야 합니다.")
	void sharedCabinetProperStatus2() {
		// given
		Long userId1 = normalUser1.getUserId();
		Long userId2 = normalUser2.getUserId();
		Long userId3 = normalUser3.getUserId();
		Long userId4 = normalUser4.getUserId();

		Long cabinetId = sharedAvailableCabinet0.getCabinetId();
		Cabinet cabinet = sharedAvailableCabinet0;
		lentService.startLentCabinet(userId1, cabinetId);
		lentService.startLentCabinet(userId2, cabinetId);
		lentService.startLentCabinet(userId3, cabinetId);
		assertEquals(CabinetStatus.FULL, cabinet.getStatus());
		List<LentHistory> activeLentHistory = lentRepository.findAllActiveLentByCabinetId(
				cabinetId);
		for (LentHistory lentHistory : activeLentHistory) {
			assertNotEquals(DateUtil.getInfinityDate(), lentHistory.getExpiredAt());
		}
		// when
		lentService.endLentCabinet(userId1);
		assertEquals(CabinetStatus.LIMITED_AVAILABLE, cabinet.getStatus());

		lentService.startLentCabinet(userId4, cabinetId);
		assertEquals(CabinetStatus.FULL, cabinet.getStatus());
		LentHistory latestLentHistory = lentRepository.findFirstByCabinetIdAndEndedAtIsNull(
				cabinetId).orElse(null);
		activeLentHistory = lentRepository.findAllActiveLentByCabinetId(cabinetId);
		for (LentHistory lentHistory : activeLentHistory) {
			assertEquals(latestLentHistory.getExpiredAt(), lentHistory.getExpiredAt());
		}

		lentService.endLentCabinet(userId2);
		lentService.endLentCabinet(userId3);
		lentService.endLentCabinet(userId4);
		assertEquals(CabinetStatus.AVAILABLE, cabinet.getStatus());

		// then
	}

	@Testable
	@DisplayName("공유 사물함을 빌린 뒤 인원수가 MAX-USER 값을 초과하지 않습니다")
	void startLentPublicCabinetMaxUserLimit() {

	}
}