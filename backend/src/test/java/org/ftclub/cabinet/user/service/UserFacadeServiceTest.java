package org.ftclub.cabinet.user.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import javax.transaction.Transactional;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.junit.Test;
import org.junit.jupiter.api.Nested;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Transactional
public class UserFacadeServiceTest {

	@Autowired
	private UserFacadeService userFacadeService;

	@Nested
	class getMyProfileResponseDto {

		@Test
		void 대여_정보_없는_유저_DTO_가져오기() {
			// 2 banuser2
			UserSessionDto user = new UserSessionDto(2L, "banuser2",
					"banuser2@student.42seoul.kr", null, null, null, false);

			MyProfileResponseDto myProfileResponseDto = userFacadeService.getMyProfile(user);
			assertEquals(user.getUserId(), myProfileResponseDto.getUserId());
			assertEquals(user.getName(), myProfileResponseDto.getName());
			assertEquals(-1L, myProfileResponseDto.getCabinetId());
		}

		@Test
		void 대여_정보_있는_유저_DTO_가져오기() {
			// 5 lentuser1
			UserSessionDto user = new UserSessionDto(5L, "lentuser1",
					"lentuser1@student.42seoul.kr", null, null, null, false);

			MyProfileResponseDto myProfileResponseDto = userFacadeService.getMyProfile(user);
			assertEquals(user.getUserId(), myProfileResponseDto.getUserId());
			assertEquals(user.getName(), myProfileResponseDto.getName());
			assertEquals(-1L, myProfileResponseDto.getCabinetId());
		}
	}


}
