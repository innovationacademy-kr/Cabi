package org.ftclub.cabinet.user.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;

import java.time.LocalDateTime;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.lent.repository.LentOptionalFetcher;
import org.ftclub.cabinet.mapper.UserMapper;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.repository.UserOptionalFetcher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class UserFacadeServiceTest {

	private LocalDateTime testDate;
	@Mock(lenient = true)
	private User user1;
	@Mock(lenient = true)
	private UserSessionDto user1SessionDto;
	@Mock(lenient = true)
	private User user2;
	@Mock(lenient = true)
	private UserSessionDto user2SessionDto;
	@Mock(lenient = true)
	private Cabinet cabinet1;
	private BanHistory banHistory1;
	private BanHistory banHistory2;
	@Mock(lenient = true)
	private BanHistory banHistory3;

	@Mock(lenient = true)
	private UserService userService;

	@Mock(lenient = true)
	private UserOptionalFetcher userOptionalFetcher;

	@Mock(lenient = true)
	private LentOptionalFetcher lentOptionalFetcher;

	@Mock(lenient = true)
	private UserMapper userMapper;

	@InjectMocks
	private UserFacadeServiceImpl userFacadeService;

	@BeforeEach
	void setUp() {
//		testDate = LocalDateTime.now();
//
//		given(user1.getUserId()).willReturn(1L);
//		given(user1SessionDto.getUserId()).willReturn(1L);
//		user1 = User.of("testUser1", "testUser1@gmail.com", null, UserRole.USER);
//		user1SessionDto = new UserSessionDto(1L, "testUser1", "testUser1@gmail.com",
//				null, null, null, false);
//
//		given(user2.getUserId()).willReturn(2L);
//		given(user2SessionDto.getUserId()).willReturn(2L);
//		user2 = User.of("testUser2", "testUser2@gmail.com", null, UserRole.USER);
//		user2SessionDto = new UserSessionDto(2L, "testUser2", "testUser2@gmail.com",
//				null, null, null, false);
//
//		given(cabinet1.getCabinetId()).willReturn(1L);
//		cabinet1 = Cabinet.of(42, CabinetStatus.FULL, LentType.PRIVATE, 1,
//				Grid.of(4, 2), CabinetPlace.of(
//						Location.of("새롬관", 2, "오아시스"),
//						SectionFormation.of(10, 10),
//						MapArea.of(2, 3, 2, 3)));
//
//		banHistory1 = BanHistory.of(testDate.minusDays(10), testDate.minusDays(8),
//				BanType.PRIVATE, 1L);
//		banHistory2 = BanHistory.of(testDate.minusDays(5), testDate.minusDays(4),
//				BanType.PRIVATE, 2L);
//		banHistory3 = BanHistory.of(testDate.minusDays(3), testDate.plusDays(1),
//				BanType.PRIVATE, 2L);
//
//		given(lentOptionalFetcher.findActiveLentCabinetByUserId(1L)).willReturn(cabinet1);
//		given(lentOptionalFetcher.findActiveLentCabinetByUserId(2L)).willReturn(null);
//
//		given(userOptionalFetcher.findRecentActiveBanHistory(1L, LocalDateTime.now())).willReturn(
//				null);
//		given(userOptionalFetcher.findRecentActiveBanHistory(2L, LocalDateTime.now())).willReturn(
//				banHistory3);
//
//		given(userMapper.toMyProfileResponseDto(user1SessionDto, cabinet1, null)).willReturn(
//				new MyProfileResponseDto(1L, "testUser1", 1L, null));
//		given(userMapper.toMyProfileResponseDto(user2SessionDto, null, banHistory3)).willReturn(
//				new MyProfileResponseDto(2L, "testUser2", null, testDate.plusDays(1)));
	}

	@Test
	@DisplayName("내 프로필 조회 성공 - 캐비넷 대여 및 밴 없음")
	void getMyProfile_성공_캐비넷_대여_및_밴_없음() {
		// given
		given(user1SessionDto.getUserId()).willReturn(1L);
		given(user1SessionDto.getName()).willReturn("testUser1");
		given(cabinet1.getCabinetId()).willReturn(1L);
		given(lentOptionalFetcher.findActiveLentCabinetByUserId(1L)).willReturn(cabinet1);
		given(userOptionalFetcher.findRecentActiveBanHistory(1L, LocalDateTime.now()))
				.willReturn(null);
		given(userMapper.toMyProfileResponseDto(user1SessionDto, cabinet1, null)).willReturn(
				new MyProfileResponseDto(1L, "testUser1", 1L, null));

		// when
		MyProfileResponseDto myProfile = userFacadeService.getMyProfile(user1SessionDto);

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
		given(user2SessionDto.getUserId()).willReturn(2L);
		given(user2SessionDto.getName()).willReturn("testUser2");
		given(banHistory3.getUnbannedAt()).willReturn(testDate.plusDays(1));
		given(lentOptionalFetcher.findActiveLentCabinetByUserId(2L)).willReturn(null);
		given(userOptionalFetcher.findRecentActiveBanHistory(eq(2L), any())).willReturn(
				banHistory3);
		given(userMapper.toMyProfileResponseDto(user2SessionDto, null, banHistory3)).willReturn(
				new MyProfileResponseDto(2L, "testUser2", null, testDate.plusDays(1)));

		// when
		MyProfileResponseDto myProfile = userFacadeService.getMyProfile(user2SessionDto);

		// then
		assertEquals(2L, myProfile.getUserId());
		assertEquals("testUser2", myProfile.getName());
		assertEquals(null, myProfile.getCabinetId());
		assertEquals(testDate.plusDays(1), myProfile.getUnbannedAt());
	}

	@Test
	@DisplayName("")
	void getAllBanUsers_성공() {
	}

	@Test
	@DisplayName("")
	void getUserProfileListByPartialName_성공() {
	}

}
