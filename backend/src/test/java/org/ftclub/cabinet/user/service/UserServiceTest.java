package org.ftclub.cabinet.user.service;

import org.junit.jupiter.api.Disabled;
import org.springframework.boot.test.context.SpringBootTest;

import javax.transaction.Transactional;

@SpringBootTest
@Transactional
@Disabled
public class UserServiceTest {

//	private final LocalDateTime testDate = LocalDateTime.of(123, 1, 15, 9, 0);
//	@Autowired
//	private UserService userService;
//	@Autowired
//	private UserOptionalFetcher userOptionalFetcher;
//	@Autowired
//	private AdminRepository adminRepository;
//	@Autowired
//	private BanHistoryRepository banHistoryRepository;
//
//	@Test
//	void 유저_생성() {
//		userService.createUser("testUser", "testUser@student.42seoul.kr", null, UserRole.USER);
//		User user = userOptionalFetcher.findUserByName("testUser");
//		assertEquals("testUser", user.getName());
//		assertEquals(UserRole.USER, user.getRole());
//	}
//
//	@Test
//	void 어드민_유저_생성() {
//		String adminEmail = "testAdmin@gmail.com";
//		userService.createAdminUser(adminEmail);
//		Admin admin = userOptionalFetcher.findAdminUserByEmail(adminEmail);
//		assertNotNull(admin);
//		assertEquals(AdminRole.NONE, admin.getRole());
//	}
//
//	@Test
//	void 유저_존재_확인하기() {
//		String userEmail = "banuser1@student.42seoul.kr";
//		String falseEmail = "test";
//		boolean check = userService.checkUserExists(userEmail);
//		assertTrue(check);
//		boolean checkFalse = userService.checkUserExists(falseEmail);
//		assertFalse(checkFalse);
//	}
//
//	@Test
//	void 어드민_존재_확인하기() {
//		String adminEmail = "admin1@gmail.com";
//		String falseEmail = "test";
//
//		boolean check = userService.checkAdminUserExists(adminEmail);
//		assertTrue(check);
//
//		boolean checkFalse = userService.checkAdminUserExists(falseEmail);
//		assertFalse(checkFalse);
//	}
//
//	@Test
//	void 유저_삭제() {
//		LocalDateTime deletedAt = LocalDateTime.now();
//		Long userId = 1L;
//		userService.deleteUser(userId, deletedAt);
//		User user = userOptionalFetcher.getUser(userId);
//		assertEquals(user.getDeletedAt(), deletedAt);
//	}
//
//	@Test
//	void 유저의_블랙홀_일자_업데이트() {
//		LocalDateTime blackholedAt = LocalDateTime.now();
//		Long userId = 1L;
//		userService.updateUserBlackholedAt(userId, blackholedAt);
//		User user = userOptionalFetcher.getUser(userId);
//		assertEquals(user.getBlackholedAt(), blackholedAt);
//	}
//
//	@Test
//	void 어드민_권한_변경() {
//		Long adminUserId = 1L;
//		userService.updateAdminUserRole(adminUserId, AdminRole.ADMIN);
//		Admin admin = userOptionalFetcher.getAdminUser(adminUserId);
//		assertEquals(admin.getRole(), AdminRole.ADMIN);
//	}
//
//	@Test
//	void 유저_밴_처리() {
//		// 3일 연체
//		LocalDateTime startedAt = LocalDateTime.of(2023, 3, 1, 0, 0);
//		LocalDateTime endedAt = LocalDateTime.of(2023, 3, 24, 0, 0);
//		LocalDateTime expiredAt = LocalDateTime.of(2023, 3, 21, 0, 0);
//		// banuser2, 대여기록 X, ban 기록 X
//		Long userId = 2L;
//		LentType lentType = LentType.PRIVATE;
//
//		userService.banUser(userId, lentType, startedAt, endedAt, expiredAt);
//		LocalDateTime date = LocalDateTime.of(2023, 3, 25, 0, 0);
//		BanHistory banHistory = banHistoryRepository.findRecentBanHistoryByUserId(userId,
//				date, PageRequest.of(0, 1)).get(0);
//		assertEquals(userId, banHistory.getUserId());
//		assertEquals(LocalDateTime.of(2023, 3, 27, 0, 0, 0), banHistory.getUnbannedAt());
//	}
//
////	@Test
////	void 유저_밴_해제() {
////		// banuser1, ban 기록 O
////		Long userId = 1L;
////		List<BanHistory> banHistory = banHistoryRepository.findBanHistoriesByUserId(userId);
////		userService.deleteRecentBanHistory(userId, testDate);
////		// 어떻게 검증?
////	}
//
////ban Policy로 이동
////	@Test
////	void 누적_ban_기록_확인() {
////		// banuser1, 1일 동안 벤
////		Long userId = 1L;
////		Long accumulatedBanDays = userService.getAccumulateBanDaysByUserId(userId);
////		assertEquals(1, accumulatedBanDays);
////	}
//
//	@Test
//	@DisplayName("이메일을 통해 어드민 유저를 찾고, 해당 유저의 어드민 권한을 승인합니다.")
//	void 어드민_권한_승인() {
//		//when
//		Long adminId1 = 1L;
//		String adminEmail1 = userOptionalFetcher.getAdminUser(adminId1).getEmail();
//		Long adminId2 = 2L;
//		String adminEmail2 = userOptionalFetcher.getAdminUser(adminId2).getEmail();
//
//		//given
//		userService.promoteAdminByEmail(adminEmail1);
//		userService.promoteAdminByEmail(adminEmail2);
//
//		//then
//		Admin admin1 = userOptionalFetcher.findAdminUser(adminId1);
//		Admin admin2 = userOptionalFetcher.findAdminUser(adminId2);
//		assertEquals(admin1.getRole(), AdminRole.ADMIN);
//		assertEquals(admin2.getRole(), AdminRole.ADMIN);
//	}
//
//	@Test
//	void 유저_벤_확인() {
//		// banuser1
//		Long userId = 1L;
//		boolean isBanned = userService.checkUserIsBanned(userId, testDate);
//		assertTrue(isBanned);
//	}
}
