package org.ftclub.cabinet.user.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.user.domain.AdminRole;
import org.ftclub.cabinet.user.domain.AdminUser;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.user.repository.AdminUserRepository;
import org.ftclub.cabinet.user.repository.BanHistoryRepository;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.ftclub.cabinet.utils.DateUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Transactional
public class UserServiceTest {

	@Autowired
	private UserService userService;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private AdminUserRepository adminUserRepository;
	@Autowired
	private BanHistoryRepository banHistoryRepository;

	private final Date testDate = new Date(123, 0, 15, 9, 0);

	@Test
	void 유저_생성() {
		userService.createUser("testUser", "testUser@student.42seoul.kr", null, UserRole.USER);
		Optional<User> user = userRepository.findByName("testUser");
		assertEquals("testUser", user.get().getName());
		assertEquals(UserRole.USER, user.get().getRole());
	}

	@Test
	void 어드민_유저_생성() {
		userService.createAdminUser("testAdmin@gmail.com");
		Optional<AdminUser> adminUser = adminUserRepository.findByEmail("testAdmin@gmail.com");
		assertNotNull(adminUser.get());
		assertEquals(AdminRole.NONE, adminUser.get().getRole());
	}

	@Test
	void 유저_존재_확인하기() {
		String userName = "banuser1";
		String falseName = "test";
		boolean check = userService.checkUserExists(userName);
		assertEquals(true, check);
		boolean checkFalse = userService.checkUserExists(falseName);
		assertEquals(false, checkFalse);
	}

	@Test
	void 어드민_존재_확인하기() {
		String adminEmail = "admin1@gmail.com";
		String falseEmail = "test";

		boolean check = userService.checkAdminUserExists(adminEmail);
		assertEquals(true, check);

		boolean checkFalse = userService.checkAdminUserExists(falseEmail);
		assertEquals(false, checkFalse);
	}

	@Test
	void 유저_삭제() {
		Date deletedAt = DateUtil.getNow();
		Long userId = 1L;
		userService.deleteUser(userId, deletedAt);
		Optional<User> user = userRepository.findById(userId);
		assertEquals(user.get().getDeletedAt(), deletedAt);
	}

	@Test
	void 유저의_블랙홀_일자_업데이트() {
		Date blackholedAt = DateUtil.getNow();
		Long userId = 1L;
		userService.updateUserBlackholedAt(userId, blackholedAt);
		User user = userRepository.getUser(userId);
		assertEquals(user.getBlackholedAt(), blackholedAt);
	}

	@Test
	void 어드민_권한_변경() {
		Long adminUserId = 1L;
		userService.updateAdminUserRole(adminUserId, AdminRole.ADMIN);
		AdminUser adminUser = adminUserRepository.getAdminUser(adminUserId);
		assertEquals(adminUser.getRole(), AdminRole.ADMIN);
	}

	@Test
	void 유저_밴_처리() {
		// 3일 연체
		Date startedAt = new Date(2023, 3, 1);
		Date endedAt = new Date(2023, 3, 24);
		Date expiredAt = new Date(2023, 3, 21);
		// banuser2, 대여기록 X, ban 기록 X
		Long userId = 2L;
		LentType lentType = LentType.PRIVATE;

		userService.banUser(userId, lentType, startedAt, endedAt, expiredAt);
		Optional<BanHistory> banHistory = banHistoryRepository.findRecentBanHistoryByUserId(userId);
		assertEquals(userId, banHistory.get().getUserId());
		assertEquals(new Date(2023, 3, 27), banHistory.get().getUnbannedAt());
	}

//	@Test
//	void 유저_밴_해제() {
//		// banuser1, ban 기록 O
//		Long userId = 1L;
//		List<BanHistory> banHistory = banHistoryRepository.findBanHistoriesByUserId(userId);
//		userService.unbanUser(userId, testDate);
//		// 어떻게 검증?
//	}

	@Test
	void 누적_ban_기록_확인() {
		// banuser1, 1일 동안 벤
		Long userId = 1L;
		Long accumulatedBanDays = userService.getAccumulateBanDaysByUserId(userId);
		assertEquals(1, accumulatedBanDays);
	}

	@Test
	void 유저_벤_확인() {
		// banuser1
		Long userId = 1L;
		boolean isBanned = userService.checkUserIsBanned(userId, testDate);
		assertEquals(true, isBanned);
	}

	@Test
	void 모든_유저_가져오기() {
		// test DB상 존재하는 유저 20명
		List<User> users = userService.getAllUsers();
		assertEquals(20, users.size());
	}
}
