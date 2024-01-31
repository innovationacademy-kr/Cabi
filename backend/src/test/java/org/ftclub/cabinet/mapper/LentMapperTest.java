package org.ftclub.cabinet.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.user.domain.User;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class LentMapperTest {

	@Autowired
	LentMapper lentMapper;

	@Mock
	User user = mock(User.class);
	@Mock
	Cabinet cabinet = mock(Cabinet.class);

	@Test
	void toLentDto() {
		when(user.getId()).thenReturn(3L);
		when(user.getName()).thenReturn("someName");
		LentHistory lentHistory = LentHistory.of(LocalDateTime.now(), LocalDateTime.now(), 3L, 5L);
		LentDto lentDto = lentMapper.toLentDto(user, lentHistory);
		assertEquals(lentHistory.getId(), lentDto.getLentHistoryId());
		assertEquals(lentHistory.getUserId(), lentDto.getUserId());
		assertEquals(user.getName(), lentDto.getName());
		assertEquals(lentHistory.getExpiredAt(), lentDto.getExpiredAt());
		assertEquals(lentHistory.getStartedAt(), lentDto.getStartedAt());
	}

	@Test
	void toLentHistoryDto() {
//		Location location = Location.of("testBuilding", 9, "testSection");
//		LentHistory lentHistory = LentHistory.of(LocalDateTime.now(), LocalDateTime.now(), 19L,
//				99L);
//		User user = User.of("testName", "testEmail@testmail.com", LocalDateTime.now(),
//				UserRole.USER);
//		Cabinet cabinet = Cabinet.of(1, CabinetStatus.AVAILABLE, LentType.SHARE, 10, Grid.of(1, 2),
//				CabinetPlace.of(location, SectionFormation.of(1, 2), MapArea.of(1, 1, 1, 1)));
//
//		System.out.println(user);
//		System.out.println(cabinet);
//
//		LentHistoryDto lentHistoryDto = lentMapper.toLentHistoryDto(lentHistory, user, cabinet);
//		assertEquals(cabinet.getId(), lentHistoryDto.getCabinetId());
//		assertEquals(lentHistory.getUserId(), lentHistoryDto.getUserId());
//		assertEquals(cabinet.getVisibleNum(), lentHistoryDto.getVisibleNum());
//		assertEquals(user.getName(), lentHistoryDto.getName());
//		assertEquals(lentHistory.getStartedAt(), lentHistoryDto.getStartedAt());
//		assertEquals(lentHistory.getEndedAt(), lentHistoryDto.getEndedAt());
//		assertEquals(location, lentHistoryDto.getLocation());
	}

	@Test
	void toActiveLentHistoryDto() {
//		LocalDateTime now = LocalDateTime.now();
//		Location location = Location.of("testBuilding", 9, "testSection");
//
//		LentHistory lentHistory = LentHistory.of(now, now, 19L,
//				99L);
//		User user = User.of("testName", "testEmail@testmail.com", now,
//				UserRole.USER);
//		Cabinet cabinet = Cabinet.of(1, CabinetStatus.AVAILABLE, LentType.SHARE, 10, Grid.of(1, 2),
//				CabinetPlace.of(location, SectionFormation.of(1, 2), MapArea.of(1, 1, 1, 1)));
//
//		System.out.println(user);
//		System.out.println(cabinet);
//
//		ActiveLentHistoryDto activeLentHistoryDto = lentMapper.toActiveLentHistoryDto(
//				lentHistory,
//				user,
//				cabinet,
//				lentHistory.isExpired(now),
//				lentHistory.getDaysUntilExpiration(now));
//
//		assertEquals(activeLentHistoryDto.getUserId(), lentHistory.getUserId());
//		assertEquals(activeLentHistoryDto.getName(), user.getName());
//		assertEquals(activeLentHistoryDto.getEmail(), user.getEmail());
//		assertEquals(activeLentHistoryDto.getCabinetId(), cabinet.getId());
//		assertEquals(activeLentHistoryDto.getIsExpired(), lentHistory.isExpired(now));
//		assertEquals(activeLentHistoryDto.getDaysLeftFromExpireDate(),
//				lentHistory.getDaysUntilExpiration(now));
	}
}