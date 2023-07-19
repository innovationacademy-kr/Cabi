package org.ftclub.cabinet.user.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.exception.ControllerException;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.repository.LentOptionalFetcher;
import org.ftclub.cabinet.user.domain.AdminRole;
import org.ftclub.cabinet.user.domain.AdminUser;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.BanPolicy;
import org.ftclub.cabinet.user.domain.BanType;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.user.repository.AdminUserRepository;
import org.ftclub.cabinet.user.repository.BanHistoryRepository;
import org.ftclub.cabinet.user.repository.UserOptionalFetcher;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class UserServiceUnitTest {

	@InjectMocks
	UserServiceImpl userService;
	@Mock
	private UserRepository userRepository;
	@Mock
	private AdminUserRepository adminUserRepository;
	@Mock
	private BanHistoryRepository banHistoryRepository;
	@Mock
	private BanPolicy banPolicy;
	@Mock
	private UserOptionalFetcher userOptionalFetcher;
	@Mock
	private LentOptionalFetcher lentOptionalFetcher;
	@Mock
	private User user;


	@Test
	@DisplayName("유저 존재 확인 성공 - 존재하는 유저인 경우")
	void checkUserExists_성공_존재하는_유저인_경우() {
		User user1 = mock(User.class);

		given(userOptionalFetcher.findUserByEmail("user1@student.42seoul.kr")).willReturn(user1);

		boolean result = userService.checkUserExists("user1@student.42seoul.kr");

		assertEquals(true, result);
		then(userOptionalFetcher).should(times(1)).findUserByEmail("user1@student.42seoul.kr");
	}

	@Test
	@DisplayName("유저 존재 확인 성공 - 유저가 없는 경우")
	void checkUserExists_성공_존재하지_않는_유저인_경우() {
		User user = null;
		given(userOptionalFetcher.findUserByEmail("notUser@student.42seoul.kr")).willReturn(user);

		boolean result = userService.checkUserExists("notUser@student.42seoul.kr");

		assertEquals(false, result);
		then(userOptionalFetcher).should(times(1)).findUserByEmail("notUser@student.42seoul.kr");
	}

	@Test
	@DisplayName("유저 생성 성공")
	void createUser_성공() {
		User user = User.of("user3", "user3@student.42seoul.kr", null, UserRole.USER);
		given(userRepository.save(user)).willReturn(user);

		userService.createUser("user3", "user3@student.42seoul.kr", null, UserRole.USER);

		then(userRepository).should(times(1)).save(user);
	}

	@Test
	@DisplayName("어드민 존재 확인 성공 - 존재하는 어드민인 경우")
	void checkAdminUserExists_성공_존재하는_어드민인_경우() {
		AdminUser adminUser1 = mock(AdminUser.class);

		given(userOptionalFetcher.findAdminUserByEmail("admin@admin.com")).willReturn(adminUser1);

		boolean result = userService.checkAdminUserExists("admin@admin.com");

		assertEquals(true, result);
		then(userOptionalFetcher).should(times(1)).findAdminUserByEmail("admin@admin.com");
	}

	@Test
	@DisplayName("어드민 존재 확인 성공 - 존재하지 않는 어드민인 경우")
	void checkAdminUserExists_성공_존재하지_않는_어드민인_경우() {
		AdminUser adminUser = null;
		given(userOptionalFetcher.findAdminUserByEmail("notAdmin@admin.com")).willReturn(adminUser);

		boolean result = userService.checkAdminUserExists("notAdmin@admin.com");

		assertEquals(false, result);
		then(userOptionalFetcher).should(times(1)).findAdminUserByEmail("notAdmin@admin.com");
	}

	@Test
	@DisplayName("어드민 생성 성공")
	void createAdminUser() {
		AdminUser adminUser = AdminUser.of("newAdminUser@admin.com", AdminRole.ADMIN);
		given(adminUserRepository.save(adminUser)).willReturn(adminUser);

		userService.createAdminUser("newAdminUser@admin.com");

		then(adminUserRepository).should(times(1)).save(adminUser);
	}

	@Test
	@DisplayName("유저 삭제 성공 - 존재하는 유저 삭제")
	void deleteUser_성공_존재하는_유저_삭제() {
		Long userId = 1L;
		User user1 = mock(User.class);
		LocalDateTime now = LocalDateTime.now();

		given(userOptionalFetcher.getUser(userId)).willReturn(user1);
		given(user1.getDeletedAt()).willReturn(now);

		userService.deleteUser(userId, now);

		then(userOptionalFetcher).should(times(1)).getUser(userId);
		then(user1).should(times(1)).setDeletedAt(now);
		then(userRepository).should(times(1)).save(eq(user1));
		assertEquals(now, user1.getDeletedAt());
	}

	@Test
	@DisplayName("유저 삭제 실패 - 존재하지 않는 유저 삭제 시도")
	void deleteUser_실패_존재하지_않는_유저_삭제_시도() {
		LocalDateTime now = LocalDateTime.now();
		given(userOptionalFetcher.getUser(-1L)).willThrow(
				new ServiceException(ExceptionStatus.NOT_FOUND_USER));

		assertThrows(ServiceException.class, () -> userService.deleteUser(-1L, now));
		then(userOptionalFetcher).should(times(1)).getUser(-1L);
		then(userRepository).should(times(0)).save(any());
	}

	@Test
	@DisplayName("동아리 유저 생성 성공")
	void createClubUser_성공() {
		String clubName = "testClub";
		String randomUUID = UUID.randomUUID().toString();
		user = User.of(clubName, randomUUID + "@student.42seoul.kr", null, UserRole.CLUB);

		userService.createClubUser(clubName);

		then(userRepository).should().save(user);
	}

	@Test
	@DisplayName("동아리 유저 생성 성공 - 이미 존재하는 동아리 유저였는데 soft delete 되어있는 경우")
	void createClubUser_성공_soft_delete_되었던_동아리_유저() {
		String clubName = "testClub";
		given(userOptionalFetcher.findUserByName(clubName)).willReturn(user);
		given(userOptionalFetcher.findUserByName(clubName).getDeletedAt()).willReturn(
				LocalDateTime.now());
		given(userOptionalFetcher.getUserByName(clubName)).willReturn(user);

		userService.createClubUser(clubName);

		then(userOptionalFetcher.getUserByName(clubName)).should().setDeletedAt(null);
	}

	@Test
	@DisplayName("동아리 유저 생성 실패 - 유효하지 않은 인자인 경우")
	void createClubUser_실패_유효하지_않은_인자() {
		assertThrows(ControllerException.class, () -> userService.createClubUser(null));
	}

	@Test
	@DisplayName("동아리 유저 생성 실패 - 이미 존재하는 동아리 유저")
	void createClubUser_실패_이미_존재하는_동아리_유저() {
		String clubName = "testClub";
		given(userOptionalFetcher.findUserByName(clubName)).willReturn(user);
		given(userOptionalFetcher.findUserByName(clubName).getDeletedAt()).willReturn(null);

		assertThrows(ControllerException.class, () -> userService.createClubUser(clubName));
	}


	@Test
	@DisplayName("동아리 유저 삭제 성공 - 존재하는 동아리 유저 삭제")
	void deleteClubUser_성공_존재하는_동아리유저_삭제() {
		// given
		Long clubUserId = 1L;
		LocalDateTime now = LocalDateTime.now();
		given(user.getUserId()).willReturn(clubUserId);
		given(userOptionalFetcher.getClubUser(clubUserId)).willReturn(user);
		given(lentOptionalFetcher.findActiveLentCabinetByUserId(clubUserId)).willReturn(null);

		// when
		userService.deleteClubUser(clubUserId, now);

		// then
		then(user).should().setDeletedAt(now);
		then(userRepository).should().save(user);
	}

	@Test
	@DisplayName("동아리 유저 삭제 실패 - 존재하지 않는 동아리 유저 삭제")
	void deleteClubUser_실패_존재하지않는_동아리유저_삭제() {
		// given
		Long clubUserId = -1L;
		LocalDateTime now = LocalDateTime.now();
		given(userOptionalFetcher.getClubUser(clubUserId)).willThrow(
				new ServiceException(ExceptionStatus.NOT_FOUND_USER));

		// when + then
		assertThrows(ServiceException.class, () -> userService.deleteClubUser(clubUserId, now));
	}

	@Test
	@DisplayName("어드민 삭제 성공 - 존재하는 어드민 삭제")
	void deleteAdminUser_성공_존재하는_어드민_삭제() {
		Long adminId = 1L;
		AdminUser adminUser = mock(AdminUser.class);
		given(userOptionalFetcher.getAdminUser(adminId)).willReturn(adminUser);

		userService.deleteAdminUser(adminId);

		then(userOptionalFetcher).should(times(1)).getAdminUser(adminId);
		then(adminUserRepository).should(times(1)).delete(adminUser);
	}

	@Test
	@DisplayName("어드민 삭제 실패 - 존재하지 않는 어드민 삭제 시도")
	void deleteAdminUser_실패_존재하지_않는_어드민_삭제_시도() {
		Long failId = -1L;
		given(userOptionalFetcher.getAdminUser(failId)).willThrow(
				new ServiceException(ExceptionStatus.NOT_FOUND_ADMIN_USER));

		assertThrows(ServiceException.class, () -> userService.deleteAdminUser(failId));
		then(userOptionalFetcher).should(times(1)).getAdminUser(failId);
	}

	@Test
	@DisplayName("어드민 Role 변경 성공 - 존재하는 어드민 Role 변경")
	void updateAdminUserRole_성공_존재하는_어드민_Role_변경() {
		Long adminId = 1L;
		AdminRole adminRole = AdminRole.MASTER;
		AdminUser adminUser = mock(AdminUser.class);
		given(userOptionalFetcher.getAdminUser(adminId)).willReturn(adminUser);
		given(adminUser.getRole()).willReturn(adminRole);

		userService.updateAdminUserRole(adminId, adminRole);

		then(adminUser).should(times(1)).changeAdminRole(adminRole);
		then(userOptionalFetcher).should(times(1)).getAdminUser(adminId);
		then(adminUserRepository).should(times(1)).save(adminUser);

		assertEquals(adminRole, adminUser.getRole());
	}

	@Test
	@DisplayName("어드민 Role 변경 실패 - 존재하지 않는 어드민 변경 시도")
	void updateAdminUserRole_실패_존재하지_않는_어드민_변경_시도() {
		Long failId = -1L;
		AdminRole adminRole = AdminRole.MASTER;
		given(userOptionalFetcher.getAdminUser(failId)).willThrow(
				new ServiceException(ExceptionStatus.NOT_FOUND_ADMIN_USER));

		assertThrows(ServiceException.class,
				() -> userService.updateAdminUserRole(failId, adminRole));
		then(userOptionalFetcher).should(times(1)).getAdminUser(failId);
	}

	@Test
	@DisplayName("어드민으로 승격 성공 - 권한이 없는 유저 어드민으로 승격")
	void promoteAdminByEmail_성공_권한이_없는_유저_어드민으로_승격() {
		String email = "noneAdmin@admin.com";
		AdminUser adminUser = mock(AdminUser.class);

		given(userOptionalFetcher.getAdminUserByEmail(email)).willReturn(adminUser);
		given(adminUser.getRole()).willReturn(AdminRole.NONE);

		userService.promoteAdminByEmail(email);

		then(userOptionalFetcher).should(times(1)).getAdminUserByEmail(email);
		then(adminUser).should(times(1)).getRole();
		then(adminUser).should(times(1)).changeAdminRole(AdminRole.ADMIN);
		then(adminUserRepository).should(times(1)).save(adminUser);
	}

	@Test
	@DisplayName("어드민으로 승격 성공 - role이 NONE이 아닌 어드민")
	void promoteAdminByEmail_성공_role이_NONE이_아닌_어드민() {
		String email = "admin@admin.com";
		AdminUser adminUser = mock(AdminUser.class);

		given(userOptionalFetcher.getAdminUserByEmail(email)).willReturn(adminUser);
		given(adminUser.getRole()).willReturn(AdminRole.ADMIN);

		userService.promoteAdminByEmail(email);

		then(userOptionalFetcher).should(times(1)).getAdminUserByEmail(email);
		then(adminUser).should(times(1)).getRole();
		then(adminUser).should(times(0)).changeAdminRole(AdminRole.ADMIN);
		then(adminUserRepository).should(times(0)).save(adminUser);
	}

	@Test
	@DisplayName("어드민으로 승격 실패 - 존재하지 않는 어드민 승격 시도")
	void promoteAdminByEmail_실패_존재하지_않는_어드민_승격_시도() {
		String failEmail = "fail@fail.com";
		given(userOptionalFetcher.getAdminUserByEmail(failEmail)).willThrow(
				new ServiceException(ExceptionStatus.NOT_FOUND_ADMIN_USER));

		assertThrows(ServiceException.class, () -> userService.promoteAdminByEmail(failEmail));
		then(userOptionalFetcher).should(times(1)).getAdminUserByEmail(failEmail);
	}

	@Test
	@DisplayName("유저 블랙홀 날짜 변경 성공 - 존재하는 유저 블랙홀 날짜 변경")
	void updateUserBlackholedAt_성공_존재하는_유저_블랙홀_날짜_변경() {
		Long userId = 1L;
		LocalDateTime newBlackholedAt = LocalDateTime.now().plusMonths(1);
		User user = mock(User.class);

		given(userOptionalFetcher.getUser(userId)).willReturn(user);
		given(user.getRole()).willReturn(UserRole.USER);
		given(user.getBlackholedAt()).willReturn(newBlackholedAt);

		userService.updateUserBlackholedAt(userId, newBlackholedAt);

		then(userOptionalFetcher).should(times(1)).getUser(userId);
		then(user).should(times(1)).getRole();
		then(user).should(times(1)).changeBlackholedAt(newBlackholedAt);
		then(userRepository).should(times(1)).save(user);

		assertEquals(newBlackholedAt, user.getBlackholedAt());
	}

	@Test
	@DisplayName("유저 블랙홀 날짜 변경 성공 - 존재하는 유저 블랙홀 날짜 변경")
	void updateUserBlackholedAt_성공_Role이_User가_아닌_경우() {
		Long userId = 10L;
		LocalDateTime newBlackholedAt = LocalDateTime.now().plusMonths(1);
		User club = mock(User.class);

		given(userOptionalFetcher.getUser(userId)).willReturn(club);
		given(club.getRole()).willReturn(UserRole.CLUB);

		userService.updateUserBlackholedAt(userId, newBlackholedAt);

		then(userOptionalFetcher).should(times(1)).getUser(userId);
		then(club).should(times(1)).getRole();
		then(club).should(times(0)).changeBlackholedAt(newBlackholedAt);
		then(userRepository).should(times(0)).save(club);
	}

	@Test
	@DisplayName("유저 블랙홀 날짜 변경 실패 - 존재하지 않는 유저 블랙홀 날짜 변경 시도")
	void updateUserBlackholedAt_실패_존재하지_않는_유저_블랙홀_날짜_변경_시도() {
		Long failId = -1L;
		LocalDateTime newBlackholedAt = LocalDateTime.now().plusMonths(1);
		given(userOptionalFetcher.getUser(failId)).willThrow(
				new ServiceException(ExceptionStatus.NOT_FOUND_USER));

		assertThrows(ServiceException.class,
				() -> userService.updateUserBlackholedAt(failId, newBlackholedAt));
		then(userOptionalFetcher).should(times(1)).getUser(failId);
	}

	@Test
	@DisplayName("유저 벤 성공 - 연체한 유저 벤")
	void banUser_성공_연체한_유저_벤() {
		// given
		Long userId = 1L;
		LentType lentType = LentType.PRIVATE;
		BanType banType = BanType.ALL;

		Long overdueDays = 7L; // 7일 연체
		Long lentDays = 21L; // 21일 대여

		LocalDateTime now = LocalDateTime.now();
		LocalDateTime startedAt = now.minusMonths(1);
		LocalDateTime endedAt = startedAt.plusDays(lentDays + overdueDays);
		LocalDateTime expiredAt = startedAt.plusDays(lentDays);
		LocalDateTime banDate = now.plusDays(overdueDays);

		BanHistory banHistory = BanHistory.of(now, banDate, banType, userId);

		given(banPolicy.verifyForBanType(lentType, startedAt, endedAt, expiredAt)).willReturn(
				banType);
		given(banPolicy.getBanDate(banType, endedAt, expiredAt, userId)).willReturn(banDate);

		userService.banUser(userId, lentType, startedAt, endedAt, expiredAt);

		then(banPolicy).should(times(1)).verifyForBanType(lentType, startedAt, endedAt, expiredAt);
		then(banPolicy).should(times(1)).getBanDate(banType, endedAt, expiredAt, userId);
		then(banHistoryRepository).should(times(1)).save(banHistory);
	}

	@Test
	@DisplayName("유저 벤 성공 - 공유 사물함 중도 반납 유저 벤")
	void banUser_성공_공유_사물함_중도_반납_유저_벤() {
		// given
		Long userId = 2L;
		LentType lentType = LentType.SHARE;
		BanType banType = BanType.SHARE;

		Long penaltyDays = 3L;
		Long lentDays = 21L;

		LocalDateTime now = LocalDateTime.now();
		LocalDateTime startedAt = now.minusMonths(1);
		LocalDateTime endedAt = startedAt.plusDays(lentDays + 1);
		LocalDateTime expiredAt = startedAt.plusDays(lentDays);
		LocalDateTime banDate = now.plusDays(penaltyDays);

		BanHistory banHistory = BanHistory.of(now, banDate, banType, userId);

		given(banPolicy.verifyForBanType(lentType, startedAt, endedAt, expiredAt)).willReturn(
				banType);
		given(banPolicy.getBanDate(banType, endedAt, expiredAt, userId)).willReturn(banDate);

		userService.banUser(userId, lentType, startedAt, endedAt, expiredAt);

		then(banPolicy).should(times(1)).verifyForBanType(lentType, startedAt, endedAt, expiredAt);
		then(banPolicy).should(times(1)).getBanDate(banType, endedAt, expiredAt, userId);
		then(banHistoryRepository).should(times(1)).save(banHistory);
	}

	@Test
	@DisplayName("유저 벤 성공 - 벤이 아닌 유저")
	void banUser_성공_벤이_아닌_유저() {
		// given
		Long userId = 3L;
		LentType lentType = LentType.PRIVATE;
		BanType banType = BanType.NONE;

		Long lentDays = 21L; // 21일 대여

		LocalDateTime now = LocalDateTime.now();
		LocalDateTime startedAt = now.minusMonths(1);
		LocalDateTime endedAt = startedAt.plusDays(lentDays - 1);
		LocalDateTime expiredAt = startedAt.plusDays(lentDays);

		BanHistory banHistory = mock(BanHistory.class);

		given(banPolicy.verifyForBanType(lentType, startedAt, endedAt, expiredAt)).willReturn(
				banType);

		userService.banUser(userId, lentType, startedAt, endedAt, expiredAt);

		then(banPolicy).should(times(1)).verifyForBanType(lentType, startedAt, endedAt, expiredAt);
		then(banPolicy).should(times(0)).getBanDate(banType, endedAt, expiredAt, userId);
		then(banHistoryRepository).should(times(0)).save(banHistory);
	}

	@Test
	@DisplayName("유저의 최근 벤 기록 삭제 성공")
	void deleteRecentBanHistory_성공() {
		Long userId = 1L;
		BanHistory banHistory = mock(BanHistory.class);
		LocalDateTime now = LocalDateTime.now();

		given(banHistory.getUnbannedAt()).willReturn(now.plusDays(3));
		given(userOptionalFetcher.getRecentBanHistory(userId)).willReturn(banHistory);
		given(banPolicy.isActiveBanHistory(banHistory.getUnbannedAt(), now)).willReturn(true);

		userService.deleteRecentBanHistory(userId, now);

		then(userOptionalFetcher).should(times(1)).getRecentBanHistory(userId);
		then(banPolicy).should(times(1)).isActiveBanHistory(banHistory.getUnbannedAt(), now);
		then(banHistoryRepository).should(times(1)).delete(banHistory);
	}

	@Test
	@DisplayName("유저의 최근 벤 기록 삭제 성공 - active한 벤 기록이 없는 경우")
	void deleteRecentBanHistory_active한_벤_기록이_없는_경우() {
		Long userId = 2L;
		BanHistory banHistory = mock(BanHistory.class);
		LocalDateTime now = LocalDateTime.now();

		given(banHistory.getUnbannedAt()).willReturn(now.minusDays(3));
		given(userOptionalFetcher.getRecentBanHistory(userId)).willReturn(banHistory);
		given(banPolicy.isActiveBanHistory(banHistory.getUnbannedAt(), now)).willReturn(false);

		userService.deleteRecentBanHistory(userId, now);

		then(userOptionalFetcher).should(times(1)).getRecentBanHistory(userId);
		then(banPolicy).should(times(1)).isActiveBanHistory(banHistory.getUnbannedAt(), now);
		then(banHistoryRepository).should(times(0)).delete(banHistory);
	}

	@Test
	@DisplayName("유저의 최근 벤 기록 삭제 실패 - 벤 기록이 없는 경우")
	void deleteRecentBanHistory_벤_기록이_없는_경우() {
		Long userId = 3L;
		LocalDateTime now = LocalDateTime.now();

		given(userOptionalFetcher.getRecentBanHistory(userId)).willThrow(
				new DomainException(ExceptionStatus.NOT_FOUND_BAN_HISTORY));

		assertThrows(DomainException.class, () -> userService.deleteRecentBanHistory(userId, now));
		then(userOptionalFetcher).should(times(1)).getRecentBanHistory(userId);
	}

	@Test
	@DisplayName("유저 벤 여부 판단 성공 - 벤인 유저")
	void checkUserIsBanned_성공_벤인_유저() {
		List<BanHistory> list = new ArrayList<>();
		Long userId = 1L;
		LocalDateTime now = LocalDateTime.now();
		BanHistory banHistory = mock(BanHistory.class);
		list.add(banHistory);

		given(banHistoryRepository.findUserActiveBanList(userId, now)).willReturn(list);

		boolean result = userService.checkUserIsBanned(userId, now);

		then(banHistoryRepository).should(times(1)).findUserActiveBanList(userId, now);
		assertEquals(result, true);
	}

	@Test
	@DisplayName("유저 벤 여부 판단 성공 - 벤이 아닌 유저")
	void checkUserIsBanned_성공_벤이_아닌_유저() {
		List<BanHistory> list = new ArrayList<>();
		Long userId = 2L;
		LocalDateTime now = LocalDateTime.now();

		given(banHistoryRepository.findUserActiveBanList(userId, now)).willReturn(list);

		boolean result = userService.checkUserIsBanned(userId, now);

		then(banHistoryRepository).should(times(1)).findUserActiveBanList(userId, now);
		assertEquals(result, false);
	}

	@Test
	@DisplayName("어드민 역할 가져오기 성공")
	void getAdminUserRole_성공() {
		String email = "admin@admin.com";
		AdminRole adminRole = AdminRole.ADMIN;

		given(userOptionalFetcher.findAdminUserRoleByEmail(email)).willReturn(adminRole);

		AdminRole result = userService.getAdminUserRole(email);

		then(userOptionalFetcher).should(times(1)).findAdminUserRoleByEmail(email);
		assertEquals(result, adminRole);
	}

	@Test
	@DisplayName("어드민 역할 가져오기 실패 - 어드민이 존재하지 않는 경우")
	void getAdminUserRole_실패_어드민이_존재하지_않는_경우() {
		String email = "notAdmin@admin.com";

		given(userOptionalFetcher.findAdminUserRoleByEmail(email)).willReturn(null);

		AdminRole result = userService.getAdminUserRole(email);

		then(userOptionalFetcher).should(times(1)).findAdminUserRoleByEmail(email);
		assertEquals(result, null);
	}
}