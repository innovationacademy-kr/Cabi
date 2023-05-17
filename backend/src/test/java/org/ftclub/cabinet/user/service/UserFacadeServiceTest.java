package org.ftclub.cabinet.user.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import javax.transaction.Transactional;
import org.ftclub.cabinet.dto.BlockedUserPaginationDto;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.UserProfilePaginationDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Transactional
public class UserFacadeServiceTest {

	@Autowired
	private UserFacadeService userFacadeService;

	@Test
	public void 대여_정보_없는_유저_DTO_가져오기() {
		// 2 banuser2
		UserSessionDto user = new UserSessionDto(2L, "banuser2",
				"banuser2@student.42seoul.kr", null, null, null, false);

		MyProfileResponseDto myProfileResponseDto = userFacadeService.getMyProfile(user);
		assertEquals(user.getUserId(), myProfileResponseDto.getUserId());
		assertEquals(user.getName(), myProfileResponseDto.getName());
		assertEquals(-1L, myProfileResponseDto.getCabinetId());
	}

	@Test
	public void 대여_정보_있는_유저_DTO_가져오기() {
		// 5 lentuser1
		UserSessionDto user = new UserSessionDto(5L, "lentuser1",
				"lentuser1@student.42seoul.kr", null, null, null, false);

		MyProfileResponseDto myProfileResponseDto = userFacadeService.getMyProfile(user);
		assertEquals(user.getUserId(), myProfileResponseDto.getUserId());
		assertEquals(user.getName(), myProfileResponseDto.getName());
		assertEquals(-1L, myProfileResponseDto.getCabinetId());
	}

	@Test
	public void 모든_벤_유저_가져오기() {
		BlockedUserPaginationDto blockedUserPaginationDto = userFacadeService.getAllBanUsers(0,
				10);
//
		System.out.println("total lenght" + blockedUserPaginationDto.getTotalLength());
//		assertEquals(2, blockedUserPaginationDto.getTotalLength());
//		assertEquals(2, blockedUserPaginationDto.getResult().size());
	}

	@Test
	public void 특정_문자_들어간_유저_프로필_가져오기() {
		// lent라는 문자열이 들어간 유저 (2명)
		UserProfilePaginationDto userProfilePaginationDto = userFacadeService.getUserProfileListByPartialName(
				"lent", 0, 10);
		assertEquals(2, userProfilePaginationDto.getTotalLength());
		assertEquals(2, userProfilePaginationDto.getResult().size());
		assertEquals("lentuser1", userProfilePaginationDto.getResult().get(0).getName());
		assertEquals("lentuser2", userProfilePaginationDto.getResult().get(1).getName());
	}
}
