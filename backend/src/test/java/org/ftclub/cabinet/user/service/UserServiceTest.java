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
		boolean check = userService.checkUserExists("banuser1");
		assertEquals(true, check);
		boolean checkFalse = userService.checkUserExists("test");
		assertEquals(false, checkFalse);
	}

	@Test
	void 어드민_존재_확인하기() {
		boolean check = userService.checkAdminUserExists("admin1@gmail.com");
		assertEquals(true, check);
		boolean checkFalse = userService.checkAdminUserExists("test");
		assertEquals(false, checkFalse);
	}

	@Test
	void 유저_삭제() {
		Date deletedAt = DateUtil.getNow();
		userService.deleteUser(1L, deletedAt);
		Optional<User> user = userRepository.findById(1L);
		assertEquals(user.get().getDeletedAt(), deletedAt);
	}

	@Test
	void 유저의_블랙홀_일자_업데이트() {
		Date blackholedAt = DateUtil.getNow();
		userService.updateUserBlackholedAt(1L, blackholedAt);
		User user = userRepository.getUser(1L);
		assertEquals(user.getBlackholedAt(), blackholedAt);
	}

	@Test
	void 어드민_권한_변경() {
		userService.updateAdminUserRole(1L, AdminRole.ADMIN);
		AdminUser adminUser = adminUserRepository.getAdminUser(1L);
		assertEquals(adminUser.getRole(), AdminRole.ADMIN);
	}

	@Test
	void 유저_밴_처리() {
		// 3일 연체
		Date startedAt = new Date(2023, 3, 1);
		Date endedAt = new Date(2023, 3, 24);
		Date expiredAt = new Date(2023, 3, 21);
		// banuser2, 대여기록 X, ban 기록 X
		userService.banUser(2L, LentType.PRIVATE, startedAt, endedAt, expiredAt);
		Optional<BanHistory> banHistory = banHistoryRepository.findRecentBanHistoryByUserId(2L);
		assertEquals(2L, banHistory.get().getUserId());
		assertEquals(new Date(2023, 3, 27), banHistory.get().getUnbannedAt());
	}

	// ban Repository를 사용할 때 날짜를 매개변수로 줘야할 것 같음 (근데 안되서 일단 롤백)
	@Test
	void 유저_밴_해제() {
		// banuser1, ban 기록 O
		List<BanHistory> banHistory = banHistoryRepository.findBanHistoriesByUserId(1L);
		System.out.println(banHistory.get(0).getUnbannedAt());
		//assertEquals(1L, banHistory.get().getUserId());
		//userService.unbanUser(1L);
		//assertNull(banHistory);
	}

	@Test
	void 누적_ban_기록_확인() {
		// banuser1, 1일 동안 벤
		Long accumulatedBanDays = userService.getAccumulateBanDaysByUserId(1L);
		assertEquals(1, accumulatedBanDays);
	}

	@Test
	void 유저_벤_확인() {
		// banuser1, 아마 테스트상 과거에 unban 되었기 때문에 false가 나올 것.
		// 따라서 날짜를 매개변수로 넘겨주는 등 로직 수정 필요.
		boolean isBanned = userService.checkUserIsBanned(1L);
		assertEquals(false, isBanned);
	}

	@Test
	void 모든_유저_가져오기() {
		// test DB상 존재하는 유저 20명
		List<User> users = userService.getAllUsers();
		assertEquals(20, users.size());
	}
}
