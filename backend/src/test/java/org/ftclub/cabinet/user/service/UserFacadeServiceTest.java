package org.ftclub.cabinet.user.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Date;
import java.util.List;
import javax.transaction.Transactional;
import org.ftclub.cabinet.dto.BlockedUserPaginationDto;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.UserProfilePaginationDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.utils.DateUtil;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

// TODO: 나중에 통과하는 코드로 변경되면 @Disabled 제거
@SpringBootTest
@Transactional
@Disabled("나중에 제거 필")
public class UserFacadeServiceTest {

	private final Date testDate = new Date(123, 0, 15, 9, 0);
	@Autowired
	private UserFacadeService userFacadeService;

	@Test
	public void 대여_정보_없는_유저_DTO_가져오기() {
		// 4 penaltyuser2
		UserSessionDto user = new UserSessionDto(4L, "penaltyuser2",
				"penaltyuser2@student.42seoul.kr", null, null, null, false);

		MyProfileResponseDto myProfileResponseDto = userFacadeService.getMyProfile(user);
		assertEquals(user.getUserId(), myProfileResponseDto.getUserId());
		assertEquals(user.getName(), myProfileResponseDto.getName());
		assertEquals(-1L, myProfileResponseDto.getCabinetId());
	}

	@Test
	public void 대여_정보_있는_유저_DTO_가져오기() {
		// 5 lentuser1 3번 사물함 대여 중
		UserSessionDto user = new UserSessionDto(5L, "lentuser1",
				"lentuser1@student.42seoul.kr", null, null, null, false);

		MyProfileResponseDto myProfileResponseDto = userFacadeService.getMyProfile(user);
		assertEquals(user.getUserId(), myProfileResponseDto.getUserId());
		assertEquals(user.getName(), myProfileResponseDto.getName());
		assertEquals(3L, myProfileResponseDto.getCabinetId());
	}

	@Test
	public void 모든_벤_유저_가져오기() {
		BlockedUserPaginationDto blockedUserPaginationDto = userFacadeService.getAllBanUsers(0,
				10, testDate);
		assertEquals(2, blockedUserPaginationDto.getTotalPage());
		assertEquals(2, blockedUserPaginationDto.getResult().size());
		assertEquals("banuser1", blockedUserPaginationDto.getResult().get(0).getName());
	}

	@Test
	public void 모든_벤_유저_가져오기_현재_기준() {
		BlockedUserPaginationDto blockedUserPaginationDto = userFacadeService.getAllBanUsers(0,
				10, DateUtil.getNow());
		assertEquals(0, blockedUserPaginationDto.getTotalPage());
		assertTrue(blockedUserPaginationDto.getResult().isEmpty());
	}

	@Test
	public void 특정_문자_들어간_유저_프로필_가져오기() {
		// lent라는 문자열이 들어간 유저 (2명)
		UserProfilePaginationDto userProfilePaginationDto = userFacadeService.getUserProfileListByPartialName(
				"lent", 0, 10);
		assertEquals(2, userProfilePaginationDto.getTotalPage());
		assertEquals(2, userProfilePaginationDto.getResult().size());
		assertEquals("lentuser1", userProfilePaginationDto.getResult().get(0).getName());
		assertEquals("lentuser2", userProfilePaginationDto.getResult().get(1).getName());
	}

	@Test
	void 모든_유저_가져오기() {
		// test DB상 존재하는 유저 20명
		List<User> users = userFacadeService.getAllUsers();
		assertEquals(20, users.size());
	}
}
