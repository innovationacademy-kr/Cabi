package org.ftclub.cabinet.user.repository;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;

import java.util.Date;
import java.util.List;
import javax.transaction.Transactional;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.utils.DateUtil;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@SpringBootTest
@Transactional
public class BanHistoryRepositoryTest {

	// DB와 같이 2023.01.15 09:00:00 시간을 기준으로 했습니다.
	private final Date testDate = new Date(123, 0, 15, 9, 0);
	@Autowired
	private BanHistoryRepository banHistoryRepository;

	@Test
	public void 현재_active한_밴_히스토리가_있는_유저() {
		// ban history 한 개 존재
		Long userId = 1L;

		List<BanHistory> activeBanList = banHistoryRepository.findUserActiveBanList(userId,
				testDate);

		Assertions.assertNotNull(activeBanList);
		Assertions.assertFalse(activeBanList.isEmpty());
		Assertions.assertEquals(1, activeBanList.size());
	}

	@Test
	public void testFindBanHistoriesByUserId() {
		// penaltyuser1 의 ban history 1개 존재
		Long userId = 3L;

		List<BanHistory> banHistories = banHistoryRepository.findBanHistoriesByUserId(userId);

		assertNotNull(banHistories);
		assertFalse(banHistories.isEmpty());
		assertEquals(1, banHistories.size());
	}

	@Test
	public void testFindActiveBanList() {
		Pageable pageable = PageRequest.of(0, 10);
		List<BanHistory> activeBanList = banHistoryRepository.findPaginationActiveBanHistories(
				pageable,
				testDate).getContent();

		Assertions.assertNotNull(activeBanList);
		Assertions.assertEquals(2, activeBanList.size());
	}

	@Test
	public void testFindRecentBanHistoryByUserId() {
		// ban history가 없는 유저
		Long userId = 10L;

		BanHistory recentBanHistory = banHistoryRepository.findRecentBanHistoryByUserId(
				userId, DateUtil.getNow(), PageRequest.of(0, 1)).get(0);

//		Assertions.assertFalse(recentBanHistory.isPresent()); to-do
	}
}
