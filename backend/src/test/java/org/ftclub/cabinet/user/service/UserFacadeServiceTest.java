package org.ftclub.cabinet.user.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.cabinet.repository.CabinetOptionalFetcher;
import org.ftclub.cabinet.dto.BlockedUserPaginationDto;
import org.ftclub.cabinet.dto.CabinetDto;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.OverdueUserCabinetDto;
import org.ftclub.cabinet.dto.OverdueUserCabinetPaginationDto;
import org.ftclub.cabinet.dto.UserBlockedInfoDto;
import org.ftclub.cabinet.dto.UserCabinetDto;
import org.ftclub.cabinet.dto.UserCabinetPaginationDto;
import org.ftclub.cabinet.dto.UserProfileDto;
import org.ftclub.cabinet.dto.UserProfilePaginationDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentOptionalFetcher;
import org.ftclub.cabinet.mapper.CabinetMapper;
import org.ftclub.cabinet.mapper.UserMapper;
import org.ftclub.cabinet.user.domain.AdminRole;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.user.repository.UserOptionalFetcher;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;

@ExtendWith(MockitoExtension.class)
public class UserFacadeServiceTest {

	private LocalDateTime testDate;
	@Mock(lenient = true)
	private UserSessionDto userSessionDto;
	@Mock(lenient = true)
	private User user1;
	@Mock(lenient = true)
	private User user2;
	@Mock(lenient = true)
	private User user3;
	@Mock(lenient = true)
	private Cabinet cabinet1;
	@Mock(lenient = true)
	private Cabinet cabinet2;
	@Mock(lenient = true)
	private Cabinet cabinet3;
	@Mock(lenient = true)
	private BanHistory banHistory1;
	@Mock(lenient = true)
	private BanHistory banHistory2;
	@Mock(lenient = true)
	private BanHistory banHistory3;
	@Mock(lenient = true)
	private LentHistory lentHistory1;
	@Mock(lenient = true)
	private LentHistory lentHistory2;
	@Mock(lenient = true)
	private LentHistory lentHistory3;

	@Mock(lenient = true)
	private UserService userService;

	@Mock(lenient = true)
	private UserOptionalFetcher userOptionalFetcher;
	@Mock
	private CabinetOptionalFetcher cabinetOptionalFetcher;

	@Mock(lenient = true)
	private LentOptionalFetcher lentOptionalFetcher;

	@Mock(lenient = true)
	private UserMapper userMapper;
	@Mock(lenient = true)
	private CabinetMapper cabinetMapper;
	@InjectMocks
	private UserFacadeServiceImpl userFacadeService;

	@Test
	@DisplayName("내 프로필 조회 성공 - 캐비넷 대여 및 밴 없음")
	void getMyProfile_성공_캐비넷_대여_및_밴_없음() {
		// given
		given(userSessionDto.getUserId()).willReturn(1L);
		given(userSessionDto.getName()).willReturn("testUser1");
		given(cabinet1.getCabinetId()).willReturn(1L);
		given(lentOptionalFetcher.findActiveLentCabinetByUserId(1L)).willReturn(cabinet1);
		given(userOptionalFetcher.findRecentActiveBanHistory(1L, LocalDateTime.now()))
				.willReturn(null);
		given(userMapper.toMyProfileResponseDto(userSessionDto, cabinet1, null)).willReturn(
				new MyProfileResponseDto(1L, "testUser1", 1L, null));

		// when
		MyProfileResponseDto myProfile = userFacadeService.getMyProfile(userSessionDto);

		// then
		assertEquals(1L, myProfile.getUserId());
		assertEquals("testUser1", myProfile.getName());
		assertEquals(1L, myProfile.getCabinetId());
		assertEquals(null, myProfile.getUnbannedAt());
	}

	@Test
	@DisplayName("내 프로필 조회 성공 - 캐비넷 대여 없음 및 밴 있음")
	void getMyProfile_성공_캐비넷_대여_없음_및_밴_있음() {
		// given
		testDate = LocalDateTime.now();
		given(userSessionDto.getUserId()).willReturn(2L);
		given(userSessionDto.getName()).willReturn("testUser2");
		given(banHistory1.getUnbannedAt()).willReturn(testDate.plusDays(1));
		given(lentOptionalFetcher.findActiveLentCabinetByUserId(2L)).willReturn(null);
		given(userOptionalFetcher.findRecentActiveBanHistory(eq(2L), any())).willReturn(
				banHistory1);
		given(userMapper.toMyProfileResponseDto(userSessionDto, null, banHistory1)).willReturn(
				new MyProfileResponseDto(2L, "testUser2", null, testDate.plusDays(1)));

		// when
		MyProfileResponseDto myProfile = userFacadeService.getMyProfile(userSessionDto);

		// then
		assertEquals(2L, myProfile.getUserId());
		assertEquals("testUser2", myProfile.getName());
		assertEquals(null, myProfile.getCabinetId());
		assertEquals(testDate.plusDays(1), myProfile.getUnbannedAt());
	}

	@Test
	@DisplayName("밴 유저 전체 조회 성공")
	void getAllBanUsers_성공() {
		// given
		testDate = LocalDateTime.now();
		given(userOptionalFetcher.findPaginationActiveBanHistories(any(), any()))
				.willReturn(new PageImpl(new ArrayList<BanHistory>(2) {{
					add(banHistory1);
					add(banHistory2);
					add(banHistory3);
				}}));
		given(banHistory1.getUser()).willReturn(user1);
		given(banHistory2.getUser()).willReturn(user2);
		given(banHistory3.getUser()).willReturn(user3);
		given(userMapper.toUserBlockedInfoDto(banHistory1, user1))
				.willReturn(new UserBlockedInfoDto(1L, "testUser1",
						testDate.minusDays(1), testDate.plusDays(1)));
		given(userMapper.toUserBlockedInfoDto(banHistory2, user2))
				.willReturn(new UserBlockedInfoDto(2L, "testUser2",
						testDate.minusDays(2), testDate.plusDays(2)));
		given(userMapper.toUserBlockedInfoDto(banHistory3, user3))
				.willReturn(new UserBlockedInfoDto(3L, "testUser3",
						testDate.minusDays(3), testDate.plusDays(3)));
		given(userMapper.toBlockedUserPaginationDto(any(),any()))
				.willReturn(new BlockedUserPaginationDto(new ArrayList<UserBlockedInfoDto>(3) {{
					add(new UserBlockedInfoDto(1L, "testUser1",
							testDate.minusDays(1), testDate.plusDays(1)));
					add(new UserBlockedInfoDto(2L, "testUser2",
							testDate.minusDays(2), testDate.plusDays(2)));
					add(new UserBlockedInfoDto(3L, "testUser3",
							testDate.minusDays(3), testDate.plusDays(3)));
				}}, 3));

		// when
		BlockedUserPaginationDto allBanUsers =
				userFacadeService.getAllBanUsers(0, 3, testDate);

		// then
		assertEquals(3, allBanUsers.getResult().size());
		assertEquals(3, allBanUsers.getTotalLength());

		assertEquals(1L, allBanUsers.getResult().get(0).getUserId());
		assertEquals("testUser1", allBanUsers.getResult().get(0).getName());
		assertEquals(testDate.minusDays(1), allBanUsers.getResult().get(0).getBannedAt());
		assertEquals(testDate.plusDays(1), allBanUsers.getResult().get(0).getUnbannedAt());

		assertEquals(2L, allBanUsers.getResult().get(1).getUserId());
		assertEquals("testUser2", allBanUsers.getResult().get(1).getName());
		assertEquals(testDate.minusDays(2), allBanUsers.getResult().get(1).getBannedAt());
		assertEquals(testDate.plusDays(2), allBanUsers.getResult().get(1).getUnbannedAt());

		assertEquals(3L, allBanUsers.getResult().get(2).getUserId());
		assertEquals("testUser3", allBanUsers.getResult().get(2).getName());
		assertEquals(testDate.minusDays(3), allBanUsers.getResult().get(2).getBannedAt());
		assertEquals(testDate.plusDays(3), allBanUsers.getResult().get(2).getUnbannedAt());
	}

	@Test
	@DisplayName("밴 유저 전체 조회 실패 - 밴 유저 없음")
	void getAllBanUsers_실패() {
		// given
		testDate = LocalDateTime.now();
		given(userOptionalFetcher.findPaginationActiveBanHistories(any(), any()))
				.willReturn(new PageImpl(new ArrayList<BanHistory>(0)));
		given(userMapper.toBlockedUserPaginationDto(any(),any()))
				.willReturn(new BlockedUserPaginationDto(
						new ArrayList<UserBlockedInfoDto>(0), 0));

		// when
		BlockedUserPaginationDto allBanUsers =
				userFacadeService.getAllBanUsers(0, 3, testDate);

		// then
		assertEquals(0, allBanUsers.getResult().size());
		assertEquals(0, allBanUsers.getTotalLength());
	}

	@Test
	@DisplayName("부분 이름으로 유저 조회 성공")
	void getUserProfileListByPartialName_성공() {
		// given
		given(userOptionalFetcher.findUsersByPartialName(eq("test"), any()))
				.willReturn(new PageImpl(new ArrayList<User>(2) {{
					add(user1);
					add(user2);
					add(user3);
				}}));
		given(userMapper.toUserProfileDto(user1)).willReturn(new UserProfileDto(1L, "testUser1"));
		given(userMapper.toUserProfileDto(user2)).willReturn(new UserProfileDto(2L, "testUser2"));
		given(userMapper.toUserProfileDto(user3)).willReturn(new UserProfileDto(3L, "testUser3"));
		given(userMapper.toUserProfilePaginationDto(any(),any()))
				.willReturn(new UserProfilePaginationDto(new ArrayList<UserProfileDto>(3) {{
					add(new UserProfileDto(1L, "testUser1"));
					add(new UserProfileDto(2L, "testUser2"));
					add(new UserProfileDto(3L, "testUser3"));
				}}, 3L));

		// when
		UserProfilePaginationDto userProfilePaginationDto =
				userFacadeService.getUserProfileListByPartialName("test", 0, 3);

		// then
		assertEquals(3, userProfilePaginationDto.getResult().size());
		assertEquals(3, userProfilePaginationDto.getTotalLength());

		assertEquals(1L, userProfilePaginationDto.getResult().get(0).getUserId());
		assertEquals("testUser1", userProfilePaginationDto.getResult().get(0).getName());

		assertEquals(2L, userProfilePaginationDto.getResult().get(1).getUserId());
		assertEquals("testUser2", userProfilePaginationDto.getResult().get(1).getName());

		assertEquals(3L, userProfilePaginationDto.getResult().get(2).getUserId());
		assertEquals("testUser3", userProfilePaginationDto.getResult().get(2).getName());
	}

	@Test
	@DisplayName("부분 이름으로 유저 조회 실패 - 맞는 유저 없음")
	void getUserProfileListByPartialName_실패() {
		// given
		given(userOptionalFetcher.findUsersByPartialName(eq("test"), any()))
				.willReturn(new PageImpl(new ArrayList<User>(0)));
		given(userMapper.toUserProfilePaginationDto(any(),any()))
				.willReturn(new UserProfilePaginationDto(new ArrayList<UserProfileDto>(0), 0L));

		// when
		UserProfilePaginationDto userProfilePaginationDto =
				userFacadeService.getUserProfileListByPartialName("test", 0, 3);

		// then
		assertEquals(0, userProfilePaginationDto.getResult().size());
		assertEquals(0, userProfilePaginationDto.getTotalLength());
	}

	@Test
	@DisplayName("부분 이름으로 유저가 대여 중인 사물함 조회 성공")
	void findUserCabinetListByPartialName_성공() {
		// given
		testDate = LocalDateTime.now();
		given(userOptionalFetcher.findUsersByPartialName(eq("test"), any()))
				.willReturn(new PageImpl(new ArrayList<User>(2) {{
					add(user1);
					add(user2);
					add(user3);
				}}));
		given(userOptionalFetcher.findRecentActiveBanHistory(user1.getUserId(), testDate))
				.willReturn(banHistory1);
		given(userOptionalFetcher.findRecentActiveBanHistory(user2.getUserId(), testDate))
				.willReturn(banHistory2);
		given(userOptionalFetcher.findRecentActiveBanHistory(user3.getUserId(), testDate))
				.willReturn(banHistory3);
		given(userMapper.toUserBlockedInfoDto(banHistory1, user1))
				.willReturn(new UserBlockedInfoDto(1L, "testUser1",
						testDate.minusDays(1), testDate.plusDays(1)));
		given(userMapper.toUserBlockedInfoDto(banHistory2, user2))
				.willReturn(new UserBlockedInfoDto(2L, "testUser2",
						testDate.minusDays(2), testDate.plusDays(2)));
		given(userMapper.toUserBlockedInfoDto(banHistory3, user3))
				.willReturn(new UserBlockedInfoDto(3L, "testUser3",
						testDate.minusDays(3), testDate.plusDays(3)));
		given(cabinetOptionalFetcher.findLentCabinetByUserId(user1.getUserId()))
				.willReturn(cabinet1);
		given(cabinetOptionalFetcher.findLentCabinetByUserId(user2.getUserId()))
				.willReturn(cabinet2);
		given(cabinetOptionalFetcher.findLentCabinetByUserId(user3.getUserId()))
				.willReturn(cabinet3);
		UserBlockedInfoDto userBlockedInfoDto1 = new UserBlockedInfoDto(1L, "testUser1",
				testDate.minusDays(1), testDate.plusDays(1));
		UserBlockedInfoDto userBlockedInfoDto2 = new UserBlockedInfoDto(2L, "testUser2",
				testDate.minusDays(2), testDate.plusDays(2));
		UserBlockedInfoDto userBlockedInfoDto3 = new UserBlockedInfoDto(3L, "testUser3",
				testDate.minusDays(3), testDate.plusDays(3));
		CabinetDto cabinetDto1 = new CabinetDto(1L, 24, LentType.PRIVATE, 1, "",
				CabinetStatus.FULL, "", Location.of("새롬관", 2, "오아시스"));
		CabinetDto cabinetDto2 = new CabinetDto(2L, 24, LentType.PRIVATE, 1, "",
				CabinetStatus.FULL, "", Location.of("새롬관", 4, "오아시스"));
		CabinetDto cabinetDto3 = new CabinetDto(3L, 24, LentType.PRIVATE, 1, "",
				CabinetStatus.FULL, "", Location.of("새롬관", 5, "오아시스"));
		given(cabinetMapper.toUserCabinetDto(userBlockedInfoDto1,cabinetDto1))
				.willReturn(new UserCabinetDto(userBlockedInfoDto1, cabinetDto1));
		given(cabinetMapper.toUserCabinetDto(userBlockedInfoDto2,cabinetDto2))
				.willReturn(new UserCabinetDto(userBlockedInfoDto2, cabinetDto2));
		given(cabinetMapper.toUserCabinetDto(userBlockedInfoDto3,cabinetDto3))
				.willReturn(new UserCabinetDto(userBlockedInfoDto3, cabinetDto3));
		UserCabinetDto userCabinetDto1 = new UserCabinetDto(userBlockedInfoDto1, cabinetDto1);
		UserCabinetDto userCabinetDto2 = new UserCabinetDto(userBlockedInfoDto2, cabinetDto2);
		UserCabinetDto userCabinetDto3 = new UserCabinetDto(userBlockedInfoDto3, cabinetDto3);
		given(cabinetMapper.toUserCabinetPaginationDto(any(), any()))
				.willReturn(new UserCabinetPaginationDto(
						new ArrayList<UserCabinetDto>(3) {{
							add(userCabinetDto1);
							add(userCabinetDto2);
							add(userCabinetDto3);
						}}, 3L));

		// when
		UserCabinetPaginationDto userCabinetPaginationDto =
				userFacadeService.findUserCabinetListByPartialName("test", 0, 3);

		// then
		assertEquals(3, userCabinetPaginationDto.getResult().size());
		assertEquals(3, userCabinetPaginationDto.getTotalLength());

		assertEquals(userCabinetDto1, userCabinetPaginationDto.getResult().get(0));
		assertEquals(userCabinetDto2, userCabinetPaginationDto.getResult().get(1));
		assertEquals(userCabinetDto3, userCabinetPaginationDto.getResult().get(2));
	}

	@Test
	@DisplayName("부분 이름으로 유저가 대여 중인 사물함 조회 실패 - 맞는 유저 없음")
	void findUserCabinetListByPartialName_실패() {
		// given
		given(userOptionalFetcher.findUsersByPartialName(eq("test"), any()))
				.willReturn(new PageImpl(new ArrayList<User>()));
		given(cabinetMapper.toUserCabinetPaginationDto(any(), any()))
				.willReturn(new UserCabinetPaginationDto(new ArrayList<>(), 0L));

		// when
		UserCabinetPaginationDto userCabinetPaginationDto =
				userFacadeService.findUserCabinetListByPartialName("test", 0, 3);

		// then
		assertEquals(0, userCabinetPaginationDto.getResult().size());
		assertEquals(0, userCabinetPaginationDto.getTotalLength());
	}

	@Test
	@DisplayName("전체 유저 조회 성공")
	void getAllUsers_성공() {
		// given
		given(userOptionalFetcher.findAllUsers()).willReturn(new ArrayList<User>(2) {{
			add(user1);
			add(user2);
		}});

		//when
		List<User> allUsers = userFacadeService.getAllUsers();

		// then
		assertEquals(2, allUsers.size());
		assertEquals(user1, allUsers.get(0));
		assertEquals(user2, allUsers.get(1));
	}

	@Test
	@DisplayName("전체 유저 조회 실패 - 유저 없음")
	void getAllUsers_실패_유저_없음() {
		// given
		given(userOptionalFetcher.findAllUsers()).willReturn(new ArrayList<User>());

		//when
		List<User> allUsers = userFacadeService.getAllUsers();

		// then
		assertEquals(0, allUsers.size());
	}

	@Test
	@DisplayName("유저가 존재하는지 확인 성공")
	void checkUserExists_성공() {
		// given
		given(userService.checkUserExists("test")).willReturn(true);

		// when + then
		assertTrue(userFacadeService.checkUserExists("test"));
	}

	@Test
	@DisplayName("유저가 존재하는지 확인 실패 - 존재하지 않는 경우")
	void checkUserExists_실패() {
		// given
		given(userService.checkUserExists("test")).willReturn(false);

		// when + then
		assertFalse(userFacadeService.checkUserExists("test"));
	}

	@Test
	@DisplayName("유저 생성 성공")
	void createUser_성공() {
		// when
		userFacadeService.createUser("testUser1", "testUser1@gmail.com", null, UserRole.USER);

		// then
		then(userService).should().createUser("testUser1", "testUser1@gmail.com", null, UserRole.USER);
	}

	@Test
	@DisplayName("어드민 유저가 존재하는지 확인 성공")
	void checkAdminUserExists_성공() {
		// given
		given(userService.checkAdminUserExists("testUser@gmail.com")).willReturn(true);

		// when + then
		assertTrue(userFacadeService.checkAdminUserExists("testUser@gmail.com"));
	}

	@Test
	@DisplayName("어드민 유저가 존재하는지 확인 실패 - 존재하지 않는 경우")
	void checkAdminUserExists_실패() {
		// given
		given(userService.checkAdminUserExists("test")).willReturn(false);

		// when + then
		assertFalse(userFacadeService.checkAdminUserExists("test"));
	}

	@Test
	@DisplayName("유저 삭제 성공")
	void deleteUser_성공() {
		// when
		testDate = LocalDateTime.now();
		userFacadeService.deleteUser(1L, testDate);

		// then
		then(userService).should().deleteUser(1L, testDate);
	}

	@Test
	@DisplayName("어드민 유저 삭제 성공")
	void deleteAdminUser_성공() {
		// when
		userFacadeService.deleteAdminUser(2L);

		// then
		then(userService).should().deleteAdminUser(2L);
	}

	@Test
	@DisplayName("어드민 유저 권한 변경 성공")
	void updateAdminUserRole_성공() {
		// when
		userFacadeService.updateAdminUserRole(3L, AdminRole.ADMIN);

		// then
		then(userService).should().updateAdminUserRole(3L, AdminRole.ADMIN);
	}

	@Test
	@DisplayName("유저를 어드민으로 승격 성공")
	void promoteUserToAdmin_성공() {
	    // when
		userFacadeService.promoteUserToAdmin("testUser@gmail.com");

		// then
		then(userService).should().promoteAdminByEmail("testUser@gmail.com");
	}

	@Test
	@DisplayName("유저 블랙홀 갱신 성공")
	void updateUserBlackholedAt_성공() {
	    // when
		testDate = LocalDateTime.now();
		userFacadeService.updateUserBlackholedAt(4L, testDate);

		// then
		then(userService).should().updateUserBlackholedAt(4L, testDate);
	}

	@Test
	@DisplayName("유저 밴 성공")
	void banUser_성공() {
	    // when
		testDate = LocalDateTime.now();
		userFacadeService.banUser(5L, LentType.PRIVATE, testDate, testDate.plusDays(1),
				testDate.plusDays(4));

		// then
		then(userService).should().banUser(5L, LentType.PRIVATE, testDate,
				testDate.plusDays(1), testDate.plusDays(4));
	}

	@Test
	@DisplayName("최근 밴 기록 삭제 성공")
	void deleteRecentBanHistory_성공() {
	    // when
		testDate = LocalDateTime.now();
		userFacadeService.deleteRecentBanHistory(6L, testDate);

		// then
		then(userService).should().deleteRecentBanHistory(6L, testDate);
	}

	@Test
	@DisplayName("연체 유저 목록 조회 성공")
		void getOverdueUserList_성공() {
		// given
		testDate = LocalDateTime.now();
		given(lentOptionalFetcher.findAllOverdueLent(any(), any())).willReturn(new ArrayList<LentHistory>(2) {{
			add(lentHistory1);
			add(lentHistory2);
			add(lentHistory3);
		}});
		given(lentHistory1.getUser()).willReturn(user1);
		given(lentHistory1.getExpiredAt()).willReturn(testDate.minusDays(5));
		given(lentHistory1.getCabinet()).willReturn(cabinet1);
		given(lentHistory2.getUser()).willReturn(user2);
		given(lentHistory2.getExpiredAt()).willReturn(testDate.minusDays(2));
		given(lentHistory2.getCabinet()).willReturn(cabinet2);
		given(lentHistory3.getUser()).willReturn(user3);
		given(lentHistory3.getExpiredAt()).willReturn(testDate.minusSeconds(10));
		given(lentHistory3.getCabinet()).willReturn(cabinet3);
		given(cabinetMapper.toOverdueUserCabinetDto(lentHistory1, user1, cabinet1, 5L))
				.willReturn(new OverdueUserCabinetDto("testUser1", 1L, 15,
						Location.of("새롬관", 2, "오아시스"), 5));
		given(cabinetMapper.toOverdueUserCabinetDto(lentHistory2, user2, cabinet2, 2L))
				.willReturn(new OverdueUserCabinetDto("testUser2", 2L, 15,
						Location.of("새롬관", 4, "오아시스"), 2));
		given(cabinetMapper.toOverdueUserCabinetDto(lentHistory3, user3, cabinet3, 0L))
				.willReturn(new OverdueUserCabinetDto("testUser3", 3L, 15,
						Location.of("새롬관", 5, "오아시스"), 0));
		given(cabinetMapper.toOverdueUserCabinetPaginationDto(any(), any()))
				.willReturn(new OverdueUserCabinetPaginationDto(new ArrayList<OverdueUserCabinetDto>(3) {{
					add(new OverdueUserCabinetDto("testUser1", 1L, 15,
							Location.of("새롬관", 2, "오아시스"), 5));
					add(new OverdueUserCabinetDto("testUser2", 2L, 15,
							Location.of("새롬관", 4, "오아시스"), 2));
					add(new OverdueUserCabinetDto("testUser3", 3L, 15,
							Location.of("새롬관", 5, "오아시스"), 0));
				}}, 3));

		//when
		OverdueUserCabinetPaginationDto overdueUserList =
				userFacadeService.getOverdueUserList(0, 3);

		// then
		assertEquals(3, overdueUserList.getResult().size());
		assertEquals(3, overdueUserList.getTotalLength());

		assertEquals("testUser1", overdueUserList.getResult().get(0).getName());
		assertEquals(1L, overdueUserList.getResult().get(0).getCabinetId());
		assertEquals(15, overdueUserList.getResult().get(0).getVisibleNum());
		assertEquals("새롬관", overdueUserList.getResult().get(0).getLocation().getBuilding());
		assertEquals(2, overdueUserList.getResult().get(0).getLocation().getFloor());
		assertEquals("오아시스", overdueUserList.getResult().get(0).getLocation().getSection());
		assertEquals(5, overdueUserList.getResult().get(0).getOverdueDays());

		assertEquals("testUser2", overdueUserList.getResult().get(1).getName());
		assertEquals(2L, overdueUserList.getResult().get(1).getCabinetId());
		assertEquals(15, overdueUserList.getResult().get(1).getVisibleNum());
		assertEquals("새롬관", overdueUserList.getResult().get(1).getLocation().getBuilding());
		assertEquals(4, overdueUserList.getResult().get(1).getLocation().getFloor());
		assertEquals("오아시스", overdueUserList.getResult().get(1).getLocation().getSection());
		assertEquals(2, overdueUserList.getResult().get(1).getOverdueDays());

		assertEquals("testUser3", overdueUserList.getResult().get(2).getName());
		assertEquals(3L, overdueUserList.getResult().get(2).getCabinetId());
		assertEquals(15, overdueUserList.getResult().get(2).getVisibleNum());
		assertEquals("새롬관", overdueUserList.getResult().get(2).getLocation().getBuilding());
		assertEquals(5, overdueUserList.getResult().get(2).getLocation().getFloor());
		assertEquals("오아시스", overdueUserList.getResult().get(2).getLocation().getSection());
		assertEquals(0, overdueUserList.getResult().get(2).getOverdueDays());
	}

	@Test
	@DisplayName("연체 유저 목록 조회 실패 - 연체 유저 없음")
	void getOverdueUserList_실패_연체_유저_없음() {
	    // given
		testDate = LocalDateTime.now();
		given(lentOptionalFetcher.findAllOverdueLent(any(), any()))
				.willReturn(new ArrayList<LentHistory>(0));
		given(cabinetMapper.toOverdueUserCabinetPaginationDto(any(), eq(0)))
				.willReturn(new OverdueUserCabinetPaginationDto(
						new ArrayList<OverdueUserCabinetDto>(0), 0));

		// when
		OverdueUserCabinetPaginationDto overdueUserList =
				userFacadeService.getOverdueUserList(0, 3);

		// then
		assertEquals(0, overdueUserList.getResult().size());
		assertEquals(0, overdueUserList.getTotalLength());
	}
}
