package org.ftclub.cabinet.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetPlace;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.dto.LentHistoryDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.utils.DateUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class LentMapperTest {

	@Autowired
	LentMapper lentMapper;

	@Test
	void toLentDto() {
		LentHistory lentHistory = LentHistory.of(DateUtil.getNow(), DateUtil.getNow(), 19L, 99L, 1L);
		String name = "someName";
		LentDto lentDto = lentMapper.toLentDto("someName", lentHistory);
		assertEquals(lentHistory.getLentHistoryId(), lentDto.getLentHistoryId());
		assertEquals(lentHistory.getUserId(), lentDto.getUserId());
		assertEquals(name, lentDto.getName());
		assertEquals(lentHistory.getExpiredAt(), lentDto.getExpiredAt());
		assertEquals(lentHistory.getStartedAt(), lentDto.getStartedAt());
	}

	@Test
	void toLentHistoryDto() {
		Location location = Location.of("testBuilding", 9, "testSection");
		LentHistory lentHistory = LentHistory.of(DateUtil.getNow(), DateUtil.getNow(), 19L, 99L, 1L);
		User user = User.of("testName", "testEmail", DateUtil.getNow(), UserRole.USER);
		Cabinet cabinet = Cabinet.of(1, CabinetStatus.AVAILABLE, LentType.SHARE, 10, Grid.of(1, 2),
				CabinetPlace.of(location, null, null));
		LentHistoryDto lentHistoryDto = lentMapper.toLentHistoryDto(lentHistory, user, cabinet);
		assertEquals(cabinet.getCabinetId(), lentHistoryDto.getCabinetId());
		assertEquals(lentHistory.getUserId(), lentHistoryDto.getUserId());
		assertEquals(cabinet.getVisibleNum(), lentHistoryDto.getVisibleNum());
		assertEquals(user.getName(), lentHistoryDto.getName());
		assertEquals(lentHistory.getStartedAt(), lentHistoryDto.getStartedAt());
		assertEquals(lentHistory.getEndedAt(), lentHistoryDto.getEndedAt());
		assertEquals(location, lentHistoryDto.getLocation());
	}

}